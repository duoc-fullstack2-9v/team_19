// Servicio para consumir la API de productos
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const productsService = {
  /**
   * Obtener todos los productos
   */
  async getAll() {
    try {
      const response = await fetch(`${API_BASE_URL}/productos`);
      if (!response.ok) {
        throw new Error('Error al obtener productos');
      }
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error en getAll:', error);
      throw error;
    }
  },

  /**
   * Obtener un producto por ID
   */
  async getById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/productos/${id}`);
      if (!response.ok) {
        throw new Error('Producto no encontrado');
      }
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error en getById:', error);
      throw error;
    }
  },

  /**
   * Crear un nuevo producto
   */
  async create(producto) {
    try {
      const response = await fetch(`${API_BASE_URL}/productos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(producto)
      });
      if (!response.ok) {
        throw new Error('Error al crear producto');
      }
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error en create:', error);
      throw error;
    }
  },

  /**
   * Actualizar un producto
   */
  async update(id, producto) {
    try {
      const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(producto)
      });
      if (!response.ok) {
        throw new Error('Error al actualizar producto');
      }
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error en update:', error);
      throw error;
    }
  },

  /**
   * Eliminar un producto
   */
  async delete(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Error al eliminar producto');
      }
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error en delete:', error);
      throw error;
    }
  },

  /**
   * Verificar disponibilidad de la API
   */
  async checkHealth() {
    try {
      const response = await fetch(`${API_BASE_URL.replace('/api', '')}/api/health`);
      return response.ok;
    } catch (error) {
      console.error('API no disponible:', error);
      return false;
    }
  }
};

export default productsService;
