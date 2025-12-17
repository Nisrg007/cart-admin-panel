import { useContext } from 'react';
import { CartContext } from '../contexts/CartContext';

export const useCarts = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCarts must be used within a CartProvider');
  }
  return context;
};