import { apiService } from './api';
import type { Alert, AlertsResponse } from '../types/alert';

export const alertsService = {
  async getAlerts(params?: {
    status?: string;
    alert_type?: string;
    severity?: string;
    page?: number;
    limit?: number;
  }): Promise<AlertsResponse> {
    const response = await apiService.get<AlertsResponse>('/api/v1/alerts', params);
    return response.data;
  },

  async getAlert(alertId: string): Promise<Alert> {
    const response = await apiService.get<{ alert: Alert }>(`/api/v1/alerts/${alertId}`);
    return response.data.alert;
  },

  async acknowledgeAlert(alertId: string): Promise<Alert> {
    const response = await apiService.post<{ alert: Alert }>(`/api/v1/alerts/${alertId}/acknowledge`);
    return response.data.alert;
  },

  async dismissAlert(alertId: string, reason?: string): Promise<Alert> {
    const response = await apiService.post<{ alert: Alert }>(`/api/v1/alerts/${alertId}/dismiss`, { reason });
    return response.data.alert;
  },

  async resolveAlert(alertId: string): Promise<Alert> {
    const response = await apiService.post<{ alert: Alert }>(`/api/v1/alerts/${alertId}/resolve`);
    return response.data.alert;
  }
};