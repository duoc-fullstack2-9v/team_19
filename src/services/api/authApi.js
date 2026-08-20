/**
 * authApi - Servicio de Autenticación y Autorización
 * Gestiona endpoints de login, registro, validación de token y decodificación JWT.
 * Incluye modo fallback/demo automático cuando el backend no está disponible en desarrollo local.
 */
import apiClient, { ApiError } from './apiClient';

// Permite configurar una URL base específica para el microservicio de autenticación si es diferente
const AUTH_BASE_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:8080/api/auth';

/**
 * Helper para generar tokens JWT simulados en entorno de desarrollo / modo offline
 */
const createMockJwt = (email, rol) => {
  try {
    const header = btoa(JSON.stringify({ alg: 'HS512', typ: 'JWT' }))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
    const payload = btoa(JSON.stringify({
      sub: email,
      rol: rol,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 86400 * 30
    }))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
    return `${header}.${payload}.mockSignature`;
  } catch {
    return `mock.${btoa(JSON.stringify({ sub: email, rol }))}.signature`;
  }
};

export const authApi = {
  /**
   * Obtiene la ruta base para autenticación
   */
  getEndpoint(path) {
    const base = AUTH_BASE_URL.replace(/\/+$/, '');
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${base}${cleanPath}`;
  },

  /**
   * Decodifica un payload JWT
   */
  decodeToken(jwtToken) {
    if (!jwtToken || typeof jwtToken !== 'string') return null;
    try {
      const parts = jwtToken.split('.');
      if (parts.length < 2) return null;
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decodificando token JWT:', error);
      return null;
    }
  },

  /**
   * Inicia sesión con email y contraseña
   * @param {string} email
   * @param {string} password
   */
  async login(email, password) {
    const url = this.getEndpoint('/login');
    try {
      const result = await apiClient.post(url, { email, password });
      
      // Si la respuesta viene en formato { success: true, data: token }
      if (result && typeof result === 'object' && 'success' in result) {
        if (result.success && result.data) {
          apiClient.setToken(result.data);
          return {
            token: result.data,
            decoded: this.decodeToken(result.data),
            raw: result
          };
        }
        throw new ApiError(result.error || 'Credenciales inválidas', 400, result, false);
      }

      // Si viene directamente el token como string o en propiedad token
      const token = typeof result === 'string' ? result : (result?.token || result?.data);
      if (token) {
        apiClient.setToken(token);
        return {
          token,
          decoded: this.decodeToken(token),
          raw: result
        };
      }

      throw new ApiError('Error en login', 400, result, false);
    } catch (error) {
      // Fallback para modo desarrollo / demo si el servidor backend no está corriendo
      if (error && error.isNetworkError) {
        if (email === 'admin@test.com' && password === 'admin123') {
          const mockToken = createMockJwt('admin@test.com', 'ADMIN');
          apiClient.setToken(mockToken);
          return {
            token: mockToken,
            decoded: this.decodeToken(mockToken),
            raw: { success: true, data: mockToken }
          };
        }
        if (email === 'user@test.com' && password === 'user123') {
          const mockToken = createMockJwt('user@test.com', 'USUARIO');
          apiClient.setToken(mockToken);
          return {
            token: mockToken,
            decoded: this.decodeToken(mockToken),
            raw: { success: true, data: mockToken }
          };
        }
        // Verificar si existe en usuarios locales de localStorage
        try {
          if (typeof window !== 'undefined' && window.localStorage) {
            const localUsers = JSON.parse(localStorage.getItem('users') || '[]');
            const found = localUsers.find(u => u.email === email && u.password === password);
            if (found) {
              const role = found.isAdmin ? 'ADMIN' : (found.rol || 'USUARIO');
              const mockToken = createMockJwt(found.email, role);
              apiClient.setToken(mockToken);
              return {
                token: mockToken,
                decoded: this.decodeToken(mockToken),
                raw: { success: true, data: mockToken }
              };
            }
          }
        } catch {
          // Ignorar error de lectura local
        }
      }
      throw error;
    }
  },

  /**
   * Registra un nuevo usuario
   * @param {string} nombre
   * @param {string} email
   * @param {string} password
   */
  async register(nombre, email, password) {
    const url = this.getEndpoint('/register');
    try {
      const result = await apiClient.post(url, { nombre, email, password });

      if (result && typeof result === 'object' && 'success' in result) {
        if (result.success && result.data) {
          apiClient.setToken(result.data);
          return {
            token: result.data,
            decoded: this.decodeToken(result.data),
            raw: result
          };
        }
        throw new ApiError(result.error || 'Error en registro', 400, result, false);
      }

      const token = typeof result === 'string' ? result : (result?.token || result?.data);
      if (token) {
        apiClient.setToken(token);
        return {
          token,
          decoded: this.decodeToken(token),
          raw: result
        };
      }

      return { raw: result };
    } catch (error) {
      if (error && error.isNetworkError && (email === 'admin@test.com' || email === 'user@test.com')) {
        const role = email === 'admin@test.com' ? 'ADMIN' : 'USUARIO';
        const mockToken = createMockJwt(email, role);
        apiClient.setToken(mockToken);
        return {
          token: mockToken,
          decoded: this.decodeToken(mockToken),
          raw: { success: true, data: mockToken }
        };
      }
      throw error;
    }
  },

  /**
   * Valida un token JWT con el servidor
   * @param {string} [customToken]
   */
  async validateToken(customToken) {
    const tokenToValidate = customToken || apiClient.getToken();
    if (!tokenToValidate) return false;

    const url = this.getEndpoint('/validate');
    const headers = { Authorization: `Bearer ${tokenToValidate}` };

    try {
      const result = await apiClient.get(url, { headers });
      return result;
    } catch (error) {
      // Si es un error de red (servidor backend offline), validar localmente la estructura y expiración del JWT
      if (error && error.isNetworkError) {
        const decoded = this.decodeToken(tokenToValidate);
        if (decoded && decoded.sub && (!decoded.exp || decoded.exp * 1000 > Date.now())) {
          return { success: true, data: tokenToValidate };
        }
      }
      // Si el servidor responde 401/403 o no es válido
      apiClient.clearToken();
      throw error;
    }
  },

  /**
   * Cierra sesión y remueve token local
   */
  logout() {
    apiClient.clearToken();
  }
};

export default authApi;
