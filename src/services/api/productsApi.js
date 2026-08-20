/**
 * productsApi - Servicio de Productos
 * Proporciona operaciones CRUD sobre el catálogo de productos.
 */
import apiClient from './apiClient';

export const productsApi = {
  /**
   * Obtiene todos los productos del catálogo
   */
  async getAll() {
    try {
      const result = await apiClient.get('/productos');
      if (result && typeof result === 'object' && 'data' in result) {
        return result.data || [];
      }
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error('Error en productsApi.getAll:', error);
      throw error;
    }
  },

  /**
   * Obtiene un producto por su ID
   * @param {string|number} id
   */
  async getById(id) {
    try {
      const result = await apiClient.get(`/productos/${id}`);
      if (result && typeof result === 'object' && 'data' in result) {
        return result.data;
      }
      return result;
    } catch (error) {
      console.error(`Error en productsApi.getById (${id}):`, error);
      throw error;
    }
  },

  /**
   * Crea un nuevo producto
   * @param {Object} producto
   */
  async create(producto) {
    try {
      const result = await apiClient.post('/productos', producto);
      if (result && typeof result === 'object' && 'data' in result) {
        return result.data;
      }
      return result;
    } catch (error) {
      console.error('Error en productsApi.create:', error);
      throw error;
    }
  },

  /**
   * Actualiza un producto existente
   * @param {string|number} id
   * @param {Object} producto
   */
  async update(id, producto) {
    try {
      const result = await apiClient.put(`/productos/${id}`, producto);
      if (result && typeof result === 'object' && 'data' in result) {
        return result.data;
      }
      return result;
    } catch (error) {
      console.error(`Error en productsApi.update (${id}):`, error);
      throw error;
    }
  },

  /**
   * Elimina un producto por ID
   * @param {string|number} id
   */
  async delete(id) {
    try {
      const result = await apiClient.delete(`/productos/${id}`);
      if (result && typeof result === 'object' && 'data' in result) {
        return result.data;
      }
      return result;
    } catch (error) {
      console.error(`Error en productsApi.delete (${id}):`, error);
      throw error;
    }
  },

  /**
   * Verifica la disponibilidad de la API (Health check)
   */
  async checkHealth() {
    try {
      // Intentar endpoint de salud
      await apiClient.get('/health', { timeout: 3000 });
      return true;
    } catch {
      try {
        // Fallback: verificar respuesta en /productos
        await apiClient.get('/productos', { timeout: 3000 });
        return true;
      } catch (err) {
        console.warn('API no disponible:', err.message);
        return false;
      }
    }
  }
};

export default productsApi;
