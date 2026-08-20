/**
 * API Manager - Punto de entrada unificado para todos los servicios HTTP del proyecto
 */
import apiClient, { ApiError } from './apiClient';
import authApi from './authApi';
import productsApi from './productsApi';
import usersApi from './usersApi';

export { apiClient, ApiError, authApi, productsApi, usersApi };

/**
 * Objeto centralizador apiManager
 */
export const apiManager = {
  client: apiClient,
  auth: authApi,
  products: productsApi,
  users: usersApi,

  /**
   * Helper para configurar la URL base de toda la aplicación
   */
  setBaseUrl(url) {
    apiClient.setBaseUrl(url);
  },

  /**
   * Helper para obtener el estado de autenticación actual
   */
  isAuthenticated() {
    return !!apiClient.getToken();
  },

  /**
   * Helper para cerrar sesión en toda la capa de API
   */
  logout() {
    authApi.logout();
  }
};

export default apiManager;
