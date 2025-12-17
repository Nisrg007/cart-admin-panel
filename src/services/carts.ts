import { apiService } from './api';
import type { Cart, CreateCartRequest, AssignCartRequest, AssignCartResponse, CartsResponse } from '../types/cart';

export const cartsService = {
  async getCarts(params?: {
    status?: string;
    vendor_id?: string;
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<CartsResponse> {
    const response = await apiService.get<CartsResponse>('/api/v1/carts', params);
    return response.data;
  },

  async getCart(cartId: string): Promise<Cart> {
    const response = await apiService.get<{ cart: Cart }>(`/api/v1/carts/${cartId}`);
    return response.data.cart;
  },

  async createCart(cartData: CreateCartRequest): Promise<Cart> {
    const response = await apiService.post<{ cart: Cart }>('/api/v1/carts', cartData);
    return response.data.cart;
  },

  async updateCart(cartId: string, cartData: Partial<CreateCartRequest>): Promise<Cart> {
    const response = await apiService.put<{ cart: Cart }>(`/api/v1/carts/${cartId}`, cartData);
    return response.data.cart;
  },

  async deleteCart(cartId: string): Promise<void> {
    await apiService.delete(`/api/v1/carts/${cartId}`);
  },

  async assignCart(assignmentData: AssignCartRequest): Promise<AssignCartResponse> {
    const response = await apiService.post<AssignCartResponse>('/api/v1/carts/assign-cart', assignmentData);
    return response.data;
  },

  async getCurrentLocations(params?: {
    status?: string;
    vendor_id?: string;
    bounds?: string;
  }): Promise<{ carts: any[] }> {
    const response = await apiService.get<{ carts: any[] }>('/api/v1/carts/current/locations', params);
    return response.data;
  },

  async getLocationHistory(cartId: string, params?: {
    from?: string;
    to?: string;
    limit?: number;
  }): Promise<any> {
    const response = await apiService.get(`/api/v1/carts/${cartId}/locations`, params);
    return response.data;
  }
};