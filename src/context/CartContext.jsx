import React, { useState, useMemo } from 'react';
import { CartContext } from './cartToken';

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

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
    setCart(prev => prev.map(p => p.id === id ? { ...p, cantidad } : p));
  };

  const clearCart = () => setCart([]);

  const totalCount = useMemo(() => cart.reduce((s, i) => s + (i.cantidad || 0), 0), [cart]);
  const totalPrice = useMemo(() => cart.reduce((s, i) => s + ((i.precio || 0) * (i.cantidad || 0)), 0), [cart]);

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, updateQuantity, clearCart, totalCount, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
