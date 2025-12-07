import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { CartContextToken } from './cartToken';
import productsService from '../services/productsService';

export const CartContext = React.createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar productos desde la API
  const loadProductos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productsService.getAll();
      setProductos(data);
    } catch (err) {
      console.error('Error al cargar productos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar productos al montar el componente
  useEffect(() => {
    loadProductos();
  }, [loadProductos]);

  const addItem = (producto, cantidad = 1) => {
    if (!producto) return;
    setCart(prev => {
      const existente = prev.find(p => p.id === producto.id);
      if (existente) {
        return prev.map(p => p.id === producto.id ? { ...p, cantidad: (p.cantidad || 0) + cantidad } : p);
      }
      return [...prev, { ...producto, cantidad }];
    });
  };

  const removeItem = (id) => {
    setCart(prev => prev.filter(p => p.id !== id));
  };

  const updateQuantity = (id, cantidad) => {
    if (cantidad <= 0) {
      removeItem(id);
    } else {
      setCart(prev => prev.map(p => p.id === id ? { ...p, cantidad } : p));
    }
  };

  const clearCart = () => setCart([]);

  const totalCount = useMemo(() => cart.reduce((s, i) => s + (i.cantidad || 0), 0), [cart]);
  const totalPrice = useMemo(() => cart.reduce((s, i) => s + ((i.precio || 0) * (i.cantidad || 0)), 0), [cart]);

  const value = {
    cart,
    productos,
    loading,
    error,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalCount,
    totalPrice,
    reloadProducts: loadProductos
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = React.useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de CartProvider');
  }
  return context;
};

export default CartProvider;
