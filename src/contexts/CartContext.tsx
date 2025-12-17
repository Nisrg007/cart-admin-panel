import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { Cart, CreateCartRequest, AssignCartRequest, CartLocation } from '../types/cart';
import { cartsService } from '../services/carts';
import { webSocketService } from '../services/websocket';

interface CartContextType {
  carts: Cart[];
  loading: boolean;
  error: string | null;
  fetchCarts: (filters?: any) => Promise<void>;
  createCart: (cartData: CreateCartRequest) => Promise<void>;
  updateCart: (cartId: string, cartData: Partial<CreateCartRequest>) => Promise<void>;
  deleteCart: (cartId: string) => Promise<void>;
  assignCart: (assignmentData: AssignCartRequest) => Promise<any>;
  getCartLocationHistory: (cartId: string, params?: any) => Promise<any>;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

type CartAction =
  | { type: 'FETCH_CARTS_START' }
  | { type: 'FETCH_CARTS_SUCCESS'; payload: Cart[] }
  | { type: 'FETCH_CARTS_FAILURE'; payload: string }
  | { type: 'UPDATE_CART_LOCATION'; payload: { cartId: string; location: any } }
  | { type: 'ADD_CART'; payload: Cart }
  | { type: 'UPDATE_CART'; payload: Cart }
  | { type: 'DELETE_CART'; payload: string };

const cartReducer = (state: { carts: Cart[]; loading: boolean; error: string | null }, action: CartAction) => {
  switch (action.type) {
    case 'FETCH_CARTS_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_CARTS_SUCCESS':
      return { carts: action.payload, loading: false, error: null };
    case 'FETCH_CARTS_FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_CART_LOCATION':
      return {
        ...state,
        carts: state.carts.map(cart =>
          cart.cart_id === action.payload.cartId
            ? { ...cart, current_location: action.payload.location }
            : cart
        )
      };
    case 'ADD_CART':
      return { ...state, carts: [...state.carts, action.payload] };
    case 'UPDATE_CART':
      return {
        ...state,
        carts: state.carts.map(cart =>
          cart.cart_id === action.payload.cart_id ? action.payload : cart
        )
      };
    case 'DELETE_CART':
      return {
        ...state,
        carts: state.carts.filter(cart => cart.cart_id !== action.payload)
      };
    default:
      return state;
  }
};

const initialState = {
  carts: [],
  loading: false,
  error: null
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    // Setup WebSocket listeners for real-time updates
    const handleCartLocationUpdate = (data: { cart_id: string; location: CartLocation }) => {
      dispatch({
        type: 'UPDATE_CART_LOCATION',
        payload: { cartId: data.cart_id, location: data.location }
      });
    };

    webSocketService.on('cartLocationUpdated', handleCartLocationUpdate);
    webSocketService.connect();

    return () => {
      webSocketService.off('cartLocationUpdated', handleCartLocationUpdate);
    };
  }, []);

  // ✅ CRITICAL FIX: Wrap in useCallback with dispatch as dependency
  const fetchCarts = useCallback(async (filters?: any) => {
    dispatch({ type: 'FETCH_CARTS_START' });
    try {
      const response = await cartsService.getCarts(filters);
      dispatch({ type: 'FETCH_CARTS_SUCCESS', payload: response.carts });
    } catch (error: any) {
      dispatch({ type: 'FETCH_CARTS_FAILURE', payload: error.message });
    }
  }, [dispatch]); // dispatch is stable from useReducer

  const createCart = useCallback(async (cartData: CreateCartRequest) => {
    try {
      const newCart = await cartsService.createCart(cartData);
      dispatch({ type: 'ADD_CART', payload: newCart });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }, [dispatch]);

  const updateCart = useCallback(async (cartId: string, cartData: Partial<CreateCartRequest>) => {
    try {
      const updatedCart = await cartsService.updateCart(cartId, cartData);
      dispatch({ type: 'UPDATE_CART', payload: updatedCart });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }, [dispatch]);

  const deleteCart = useCallback(async (cartId: string) => {
    try {
      await cartsService.deleteCart(cartId);
      dispatch({ type: 'DELETE_CART', payload: cartId });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }, [dispatch]);

  const assignCart = useCallback(async (assignmentData: AssignCartRequest) => {
    try {
      return await cartsService.assignCart(assignmentData);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }, []);

  const getCartLocationHistory = useCallback(async (cartId: string, params?: any) => {
    try {
      return await cartsService.getLocationHistory(cartId, params);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }, []);

  return (
    <CartContext.Provider value={{
      ...state,
      fetchCarts,
      createCart,
      updateCart,
      deleteCart,
      assignCart,
      getCartLocationHistory
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCarts = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCarts must be used within a CartProvider');
  }
  return context;
};