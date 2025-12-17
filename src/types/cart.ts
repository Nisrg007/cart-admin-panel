import type { PaginationResponse } from "./api";

export interface Cart {
  cart_id: string;
  vendor_id: string;
  cart_model: string;
  serial_number?: string;
  status: 'active' | 'maintenance' | 'retired';
  created_at: string;
  updated_at: string;
  current_location?: CartLocation;
  assignment?: CartAssignment;
}

export interface CartLocation {
  latitude: number;
  longitude: number;
  timestamp: string;
  accuracy: number;
  speed?: number;
  heading?: number;
  battery_level?: number;
  is_moving: boolean;
  fraud_flags?: FraudFlags;
}

export interface FraudFlags {
  mock_location: boolean;
  unrealistic_speed: boolean;
  timestamp_skew: boolean;
}

export interface CartAssignment {
  renter_phone: string;
  device_fingerprint: string;
  assigned_at: string;
  expires_at: string;
  status: string;
}

export interface CreateCartRequest {
  cart_id: string;
  vendor_id: string;
  cart_model: string;
  serial_number?: string;
  status?: 'active' | 'maintenance' | 'retired';
}

export interface AssignCartRequest {
  cart_id: string;
  renter_phone: string;
  duration_hours?: number;
}

export interface AssignCartResponse {
  assignment_token: string;
  expires_at: string;
  qr_code_data: string;
  message: string;
}

export interface CartsResponse {
  carts: Cart[];
  pagination: PaginationResponse;
}