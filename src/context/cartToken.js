import { createContext } from 'react';

// Archivo que exporta solo el contexto (para evitar errores de Fast Refresh)
export const CartContext = createContext(null);

export default CartContext;
