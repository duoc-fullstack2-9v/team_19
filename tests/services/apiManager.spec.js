import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiClient, ApiError } from '../../src/services/api/apiClient';
import { authApi } from '../../src/services/api/authApi';
import { productsApi } from '../../src/services/api/productsApi';
import { usersApi } from '../../src/services/api/usersApi';
import { apiManager } from '../../src/services/api/index';

global.fetch = vi.fn();

describe('API Manager Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    apiClient.setBaseUrl('http://localhost:5000/api');
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('apiClient', () => {
    test('construye URLs relativas y absolutas adecuadamente', () => {
      expect(apiClient.buildUrl('/productos')).toBe('http://localhost:5000/api/productos');
      expect(apiClient.buildUrl('productos')).toBe('http://localhost:5000/api/productos');
      expect(apiClient.buildUrl('https://api.ejemplo.com/v1')).toBe('https://api.ejemplo.com/v1');
    });

    test('inyecta token de Authorization si existe en localStorage', async () => {
      localStorage.setItem('authToken', 'test-token-123');

      global.fetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ success: true, data: [] })
      });

      await apiClient.get('/productos');

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/productos',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-token-123',
            'Content-Type': 'application/json'
          })
        })
      );
    });

    test('lanza ApiError con información detallada en fallos HTTP', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ error: 'Recurso no encontrado' })
      });

      await expect(apiClient.get('/no-existe')).rejects.toThrow('Recurso no encontrado');
    });

    test('soporta query parameters correctamente', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ success: true, data: [] })
      });

      await apiClient.get('/productos', { params: { search: 'spider', limit: 10 } });

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/productos?search=spider&limit=10',
        expect.anything()
      );
    });
  });

  describe('authApi', () => {
    test('realiza login y almacena token en localStorage', async () => {
      const mockToken = 'jwt-token-sample';
      global.fetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ success: true, data: mockToken })
      });

      const response = await authApi.login('user@test.com', '123456');

      expect(response.token).toBe(mockToken);
      expect(localStorage.getItem('authToken')).toBe(mockToken);
    });

    test('decodifica tokens JWT adecuadamente', () => {
      // payload: {"sub":"admin@test.com","rol":"ADMIN"}
      const mockJwt = 'header.eyJzdWIiOiJhZG1pbkB0ZXN0LmNvbSIsInJvbCI6IkFETUlOIn0.signature';
      const decoded = authApi.decodeToken(mockJwt);
      expect(decoded).toEqual({ sub: 'admin@test.com', rol: 'ADMIN' });
    });

    test('logout limpia el token de localStorage', () => {
      localStorage.setItem('authToken', 'token-activo');
      authApi.logout();
      expect(localStorage.getItem('authToken')).toBeNull();
    });
  });

  describe('productsApi', () => {
    test('getAll retorna arreglo de productos', async () => {
      const mockProducts = [{ id: 1, nombre: 'Comic 1', precio: 5000 }];
      global.fetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ success: true, data: mockProducts })
      });

      const result = await productsApi.getAll();
      expect(result).toEqual(mockProducts);
    });

    test('create envía producto mediante POST', async () => {
      const newProduct = { nombre: 'Batman Vol 1', precio: 8000 };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ success: true, data: { id: 10, ...newProduct } })
      });

      const result = await productsApi.create(newProduct);
      expect(result).toEqual({ id: 10, ...newProduct });
    });
  });

  describe('usersApi', () => {
    test('getAll obtiene lista de usuarios', async () => {
      const mockUsers = [{ id: 1, email: 'admin@test.com', rol: 'ADMIN' }];
      global.fetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ data: mockUsers })
      });

      const result = await usersApi.getAll();
      expect(result).toEqual(mockUsers);
    });
  });

  describe('apiManager façade', () => {
    test('expone todos los servicios y utilidades centralizadas', () => {
      expect(apiManager.client).toBeDefined();
      expect(apiManager.auth).toBeDefined();
      expect(apiManager.products).toBeDefined();
      expect(apiManager.users).toBeDefined();
      expect(typeof apiManager.setBaseUrl).toBe('function');
      expect(typeof apiManager.isAuthenticated).toBe('function');
    });
  });
});
