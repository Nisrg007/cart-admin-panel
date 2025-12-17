import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import { API_BASE_URL, ADMIN_API_KEY } from '../utils/constants';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': ADMIN_API_KEY // This is REQUIRED for your backend
      }
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor - Add admin token to ALL requests
    this.client.interceptors.request.use(
      (config) => {
        console.log('🔄 Making request to:', config.url);
        console.log('🔑 Using admin token:', ADMIN_API_KEY ? 'Present' : 'Missing');
        
        // Ensure admin token is always included
        if (ADMIN_API_KEY) {
          config.headers['x-admin-token'] = ADMIN_API_KEY;
        } else {
          console.error('❌ ADMIN_API_KEY is missing from environment variables');
        }

        return config;
      },
      (error) => {
        console.error('❌ Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        console.log('✅ Response received:', response.status, response.config.url);
        return response;
      },
      (error) => {
        console.error('❌ Response error:', {
          url: error.config?.url,
          status: error.response?.status,
          message: error.message
        });

        if (error.response?.status === 401) {
          console.warn('🔐 401 Unauthorized - Check ADMIN_API_KEY configuration');
        }
        
        return Promise.reject(error);
      }
    );
  }

  public async get<T>(url: string, params?: any): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, { params });
  }

  public async post<T>(url: string, data?: any): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data);
  }

  public async put<T>(url: string, data?: any): Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, data);
  }

  public async patch<T>(url: string, data?: any): Promise<AxiosResponse<T>> {
    return this.client.patch<T>(url, data);
  }

  public async delete<T>(url: string): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url);
  }

  // Enhanced health check
  public async healthCheck(): Promise<{ healthy: boolean; message: string }> {
    try {
      const response = await this.client.get('/health');
      return {
        healthy: response.status === 200,
        message: 'Backend is healthy'
      };
    } catch (error: any) {
      return {
        healthy: false,
        message: error.response?.data?.message || 'Backend connection failed'
      };
    }
  }

  // Test backend connection with detailed info
  public async testConnection(): Promise<any> {
    try {
      const response = await this.client.get('/health');
      return {
        connected: true,
        status: response.status,
        data: response.data
      };
    } catch (error: any) {
      return {
        connected: false,
        status: error.response?.status,
        message: error.message,
        details: error.response?.data
      };
    }
  }
}

export const apiService = new ApiService();