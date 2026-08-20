// Servicio para consumir la API de productos (Capa de compatibilidad con apiManager)
import { productsApi } from './api/productsApi';

export const productsService = {
  getAll: () => productsApi.getAll(),
  getById: (id) => productsApi.getById(id),
  create: (producto) => productsApi.create(producto),
  update: (id, producto) => productsApi.update(id, producto),
  delete: (id) => productsApi.delete(id),
  checkHealth: () => productsApi.checkHealth()
};

export default productsService;
