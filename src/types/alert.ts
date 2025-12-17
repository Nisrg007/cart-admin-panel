import type { PaginationResponse } from "./api";

export interface Alert {
  _id: string;
  alert_type: 'proximity' | 'fraud' | 'offline' | 'battery_low';
  cart_ids: string[];
  severity: 'low' | 'medium' | 'high';
  message: string;
  details: any;
  location?: AlertLocation;
  status: 'active' | 'acknowledged' | 'resolved' | 'dismissed';
  created_at: string;
  acknowledged_at?: string;
  acknowledged_by?: string;
  resolved_at?: string;
  dismissed_at?: string;
  dismissed_by?: string;
}

export interface AlertLocation {
  type: 'Point';
  coordinates: [number, number];
}

export interface AlertsResponse {
  alerts: Alert[];
  pagination: PaginationResponse;
}

export interface AlertStats {
  total: number;
  active: number;
  acknowledged: number;
  resolved: number;
  byType: {
    proximity: number;
    fraud: number;
    offline: number;
    battery_low: number;
  };
  bySeverity: {
    high: number;
    medium: number;
    low: number;
  };
}