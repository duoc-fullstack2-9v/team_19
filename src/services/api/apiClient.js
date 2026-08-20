/**
 * ApiClient - Cliente HTTP Centralizado y Robusto
 * Proporciona métodos para peticiones HTTP con manejo automático de:
 * - URL base configurable por variables de entorno (VITE_API_URL)
 * - Inyección automática de token JWT (Authorization: Bearer <token>)
 * - Serialización y deserialización de JSON
 * - Interceptación y normalización de errores con la clase ApiError
 * - Soporte para timeout con AbortController
 */

export class ApiError extends Error {
  constructor(message, status = 0, data = null, isNetworkError = false) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    this.isNetworkError = isNetworkError;
  }
}

class ApiClient {
  constructor(config = {}) {
    this.baseUrl = config.baseUrl || import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    this.defaultTimeout = config.timeout || 15000;
    this.tokenStorageKey = config.tokenStorageKey || 'authToken';
  }

  /**
   * Obtiene la URL base configurada actualmente
   */
  getBaseUrl() {
    return this.baseUrl;
  }

  /**
   * Permite actualizar la URL base dinámicamente
   */
  setBaseUrl(url) {
    this.baseUrl = url;
  }

  /**
   * Obtiene el token de autenticación actual
   */
  getToken() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return localStorage.getItem(this.tokenStorageKey);
      }
    } catch {
      // Ignorar errores de acceso a localStorage
    }
    return null;
  }

  /**
   * Establece el token de autenticación en almacenamiento local
   */
  setToken(token) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        if (token) {
          localStorage.setItem(this.tokenStorageKey, token);
        } else {
          localStorage.removeItem(this.tokenStorageKey);
        }
      }
    } catch {
      // Ignorar errores de acceso a localStorage
    }
  }

  /**
   * Remueve el token almacenado
   */
  clearToken() {
    this.setToken(null);
  }

  /**
   * Construye los encabezados HTTP por defecto e inyecta la autenticación
   */
  getHeaders(customHeaders = {}, isFormData = false) {
    const headers = { ...customHeaders };

    if (!isFormData && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    if (!headers['Accept']) {
      headers['Accept'] = 'application/json, text/plain, */*';
    }

    const token = this.getToken();
    if (token && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Normaliza la URL agregando la baseUrl si es relativa
   */
  buildUrl(endpoint) {
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
      return endpoint;
    }
    const cleanBase = this.baseUrl.replace(/\/+$/, '');
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${cleanBase}${cleanEndpoint}`;
  }

  /**
   * Ejecuta una petición HTTP genérica
   */
  async request(endpoint, options = {}) {
    const {
      method = 'GET',
      headers = {},
      body,
      params,
      timeout = this.defaultTimeout,
      signal,
      ...customOptions
    } = options;

    let url = this.buildUrl(endpoint);

    // Agregar query params si existen
    if (params && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          searchParams.append(key, String(val));
        }
      });
      const separator = url.includes('?') ? '&' : '?';
      url = `${url}${separator}${searchParams.toString()}`;
    }

    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    const finalHeaders = this.getHeaders(headers, isFormData);

    let requestBody = body;
    if (body && !isFormData && typeof body === 'object') {
      requestBody = JSON.stringify(body);
    }

    const fetchConfig = {
      method,
      headers: finalHeaders,
      body: requestBody,
      ...customOptions
    };

    if (signal) {
      fetchConfig.signal = signal;
    }

    try {
      const response = await fetch(url, fetchConfig);

      // Parsear respuesta de forma segura con fallback para mocks
      let data = null;
      if (response) {
        if (typeof response.json === 'function') {
          try {
            data = await response.json();
          } catch {
            if (typeof response.text === 'function') {
              const text = await response.text().catch(() => '');
              try {
                data = JSON.parse(text);
              } catch {
                data = text;
              }
            }
          }
        } else if (typeof response.text === 'function') {
          const text = await response.text().catch(() => '');
          try {
            data = JSON.parse(text);
          } catch {
            data = text;
          }
        }
      }

      // Si la respuesta no es exitosa (HTTP >= 400)
      if (response && !response.ok) {
        let errorMessage = 'Error en la petición';
        if (data && typeof data === 'object') {
          errorMessage = data.message || data.error || errorMessage;
        } else if (typeof data === 'string' && data) {
          errorMessage = data;
        }
        throw new ApiError(errorMessage, response.status || 500, data, false);
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      if (error && error.name === 'AbortError') {
        throw new ApiError('La petición excedió el tiempo límite (timeout)', 408, null, true);
      }

      throw new ApiError(
        (error && error.message) ? error.message : 'Error de conexión con el servidor',
        0,
        null,
        true
      );
    }
  }

  // Métodos de conveniencia
  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', body });
  }

  put(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', body });
  }

  patch(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PATCH', body });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

// Instancia singleton por defecto
export const apiClient = new ApiClient();
export default apiClient;
