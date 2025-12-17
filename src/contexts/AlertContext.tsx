import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { Alert } from '../types/alert';
import { alertsService } from '../services/alerts';
import { webSocketService } from '../services/websocket';

interface AlertContextType {
  alerts: Alert[];
  loading: boolean;
  error: string | null;
  fetchAlerts: (filters?: any) => Promise<void>;
  acknowledgeAlert: (alertId: string) => Promise<void>;
  dismissAlert: (alertId: string, reason?: string) => Promise<void>;
  resolveAlert: (alertId: string) => Promise<void>;
}

export const AlertContext = createContext<AlertContextType | undefined>(undefined);

type AlertAction =
  | { type: 'FETCH_ALERTS_START' }
  | { type: 'FETCH_ALERTS_SUCCESS'; payload: Alert[] }
  | { type: 'FETCH_ALERTS_FAILURE'; payload: string }
  | { type: 'ADD_ALERT'; payload: Alert }
  | { type: 'UPDATE_ALERT'; payload: Alert }
  | { type: 'ACKNOWLEDGE_ALERT'; payload: string }
  | { type: 'DISMISS_ALERT'; payload: string }
  | { type: 'RESOLVE_ALERT'; payload: string };

const alertReducer = (state: { alerts: Alert[]; loading: boolean; error: string | null }, action: AlertAction) => {
  switch (action.type) {
    case 'FETCH_ALERTS_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_ALERTS_SUCCESS':
      return { alerts: action.payload, loading: false, error: null };
    case 'FETCH_ALERTS_FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'ADD_ALERT':
      return { alerts: [action.payload, ...state.alerts], loading: false, error: null };
    case 'ACKNOWLEDGE_ALERT':
      return {
        ...state,
        alerts: state.alerts.map(alert =>
          alert._id === action.payload
            ? { ...alert, status: 'acknowledged' as Alert['status'] }
            : alert
        )
      };
    case 'DISMISS_ALERT':
      return {
        ...state,
        alerts: state.alerts.map(alert =>
          alert._id === action.payload
            ? { ...alert, status: 'dismissed' as Alert['status'] }
            : alert
        )
      };
    case 'RESOLVE_ALERT':
      return {
        ...state,
        alerts: state.alerts.map(alert =>
          alert._id === action.payload
            ? { ...alert, status: 'resolved' as Alert['status'] }
            : alert
        )
      };
    default:
      return state;
  }
};

const initialState = {
  alerts: [],
  loading: false,
  error: null
};

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(alertReducer, initialState);

  useEffect(() => {
    // Setup WebSocket listeners with stable references
    const handleAlertCreated = (data: Alert) => {
      dispatch({ type: 'ADD_ALERT', payload: data });
    };

    const handleAlertResolved = (data: Alert) => {
      dispatch({ type: 'RESOLVE_ALERT', payload: data._id });
    };

    webSocketService.on('alertCreated', handleAlertCreated);
    webSocketService.on('alertResolved', handleAlertResolved);

    return () => {
      webSocketService.off('alertCreated', handleAlertCreated);
      webSocketService.off('alertResolved', handleAlertResolved);
    };
  }, []);

  // ✅ CRITICAL FIX: Wrap in useCallback
  const fetchAlerts = useCallback(async (filters?: any) => {
    dispatch({ type: 'FETCH_ALERTS_START' });
    try {
      const response = await alertsService.getAlerts(filters);
      dispatch({ type: 'FETCH_ALERTS_SUCCESS', payload: response.alerts });
    } catch (error: any) {
      dispatch({ type: 'FETCH_ALERTS_FAILURE', payload: error.message });
    }
  }, [dispatch]);

  const acknowledgeAlert = useCallback(async (alertId: string) => {
    try {
      await alertsService.acknowledgeAlert(alertId);
      dispatch({ type: 'ACKNOWLEDGE_ALERT', payload: alertId });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }, [dispatch]);

  const dismissAlert = useCallback(async (alertId: string, reason?: string) => {
    try {
      await alertsService.dismissAlert(alertId, reason);
      dispatch({ type: 'DISMISS_ALERT', payload: alertId });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }, [dispatch]);

  const resolveAlert = useCallback(async (alertId: string) => {
    try {
      await alertsService.resolveAlert(alertId);
      dispatch({ type: 'RESOLVE_ALERT', payload: alertId });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }, [dispatch]);

  return (
    <AlertContext.Provider value={{
      ...state,
      fetchAlerts,
      acknowledgeAlert,
      dismissAlert,
      resolveAlert
    }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlerts = () => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlerts must be used within an AlertProvider');
  }
  return context;
};