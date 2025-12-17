export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
export const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
export const ADMIN_API_KEY = import.meta.env.VITE_ADMIN_API_KEY;

export const CART_STATUS = {
  ACTIVE: 'active',
  MAINTENANCE: 'maintenance',
  RETIRED: 'retired'
} as const;

export const ALERT_TYPES = {
  PROXIMITY: 'proximity',
  FRAUD: 'fraud',
  OFFLINE: 'offline',
  BATTERY_LOW: 'battery_low'
} as const;

export const ALERT_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
} as const;

export const ALERT_STATUS = {
  ACTIVE: 'active',
  ACKNOWLEDGED: 'acknowledged',
  RESOLVED: 'resolved',
  DISMISSED: 'dismissed'
} as const;

export const DEFAULT_ADMIN_USERS = [
  { username: 'admin', password: 'admin123', email: 'admin@hocco.com' },
  { username: 'manager', password: 'manager123', email: 'manager@hocco.com' },
  { username: 'supervisor', password: 'supervisor123', email: 'supervisor@hocco.com' }
];