/**
 * usersApi - Servicio para gestión de usuarios
 * Proporciona endpoints para administración y consulta de usuarios.
 */
import apiClient from './apiClient';

export const usersApi = {
  /**
   * Obtiene la lista de usuarios
   */
  async getAll() {
    try {
      const result = await apiClient.get('/usuarios');
      if (result && typeof result === 'object' && 'data' in result) {
        return result.data || [];
      }
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error('Error en usersApi.getAll:', error);
      throw error;
    }
  },

  /**
   * Obtiene un usuario por su ID o Email
   * @param {string|number} id
   */
  async getById(id) {
    try {
      const result = await apiClient.get(`/usuarios/${id}`);
      if (result && typeof result === 'object' && 'data' in result) {
        return result.data;
      }
      return result;
    } catch (error) {
      console.error(`Error en usersApi.getById (${id}):`, error);
      throw error;
    }
  },

  /**
   * Crea un nuevo usuario
   * @param {Object} userData
   */
  async create(userData) {
    try {
      const result = await apiClient.post('/usuarios', userData);
      if (result && typeof result === 'object' && 'data' in result) {
        return result.data;
      }
      return result;
    } catch (error) {
      console.error('Error en usersApi.create:', error);
      throw error;
    }
  },

  /**
   * Actualiza un usuario
   * @param {string|number} id
   * @param {Object} userData
   */
  async update(id, userData) {
    try {
      const result = await apiClient.put(`/usuarios/${id}`, userData);
      if (result && typeof result === 'object' && 'data' in result) {
        return result.data;
      }
      return result;
    } catch (error) {
      console.error(`Error en usersApi.update (${id}):`, error);
      throw error;
    }
  },

  /**
   * Elimina un usuario
   * @param {string|number} id
   */
  async delete(id) {
    try {
      const result = await apiClient.delete(`/usuarios/${id}`);
      if (result && typeof result === 'object' && 'data' in result) {
        return result.data;
      }
      return result;
    } catch (error) {
      console.error(`Error en usersApi.delete (${id}):`, error);
      throw error;
    }
  }
};

export default usersApi;
