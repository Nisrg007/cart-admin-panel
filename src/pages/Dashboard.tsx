import React, { useEffect, useRef, useState } from 'react';
import { StatsCards } from '../components/dashboard/StatsCards';
import { MapView } from '../components/dashboard/MapView';
import { RecentAlerts } from '../components/dashboard/RecentAlerts';
import { useCarts } from '../contexts/CartContext';
import { useAlerts } from '../contexts/AlertContext';
import { apiService } from '../services/api';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { fetchCarts } = useCarts();
  const { fetchAlerts } = useAlerts();
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [connectionError, setConnectionError] = useState<string>('');

  const initializeData = async () => {
    try {
      console.log('🔄 Checking backend connection...');
      const health = await apiService.healthCheck();
      
      if (health.healthy) {
        setBackendStatus('online');
        setConnectionError('');
        console.log('✅ Backend is online, fetching data...');
        
        // Fetch initial data
        await Promise.all([
          fetchCarts().catch(err => console.warn('Failed to fetch carts:', err)),
          fetchAlerts({ status: 'active', limit: 10 }).catch(err => console.warn('Failed to fetch alerts:', err))
        ]);
      } else {
        setBackendStatus('offline');
        setConnectionError(health.message);
      }
    } catch (error: any) {
      console.error('❌ Backend connection failed:', error);
      setBackendStatus('offline');
      setConnectionError(error.message || 'Cannot connect to backend server');
    }
  };

  useEffect(() => {
  initializeData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []); // ✅ Run only once on mount

// OR if you really need the functions:
const stableFetchCarts = useRef(fetchCarts);
const stableFetchAlerts = useRef(fetchAlerts);

useEffect(() => {
  stableFetchCarts.current = fetchCarts;
  stableFetchAlerts.current = fetchAlerts;
});

useEffect(() => {
  const init = async () => {
    await stableFetchCarts.current();
    await stableFetchAlerts.current({ status: 'active', limit: 10 });
  };
  init();
}, []); // ✅ Stable

  const retryConnection = async () => {
    setBackendStatus('checking');
    setConnectionError('');
    await initializeData();
  };

  if (backendStatus === 'checking') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-hocco-primary animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Checking Backend Connection</h2>
          <p className="mt-2 text-gray-600">Please wait while we connect to the server...</p>
        </div>
      </div>
    );
  }

  if (backendStatus === 'offline') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <WifiOff className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Backend Unavailable</h2>
          <p className="text-gray-600 mb-4">
            {connectionError || 'Cannot connect to the backend server.'}
          </p>
          <div className="space-y-3 text-sm text-gray-500 text-left bg-gray-100 p-4 rounded-lg mb-6">
            <p><strong>Please check:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>Backend server is running on port 3001</li>
              <li>ADMIN_API_KEY is set in .env file</li>
              <li>No firewall blocking the connection</li>
            </ul>
          </div>
          <button
            onClick={retryConnection}
            className="btn-primary flex items-center justify-center space-x-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Connection</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Connection Status Banner */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Real-time overview of your cart tracking system
          </p>
        </div>
        <div className="flex items-center space-x-2 text-green-600">
          <Wifi className="w-5 h-5" />
          <span className="text-sm font-medium">Backend Connected</span>
        </div>
      </div>

      {/* Statistics Cards */}
      <StatsCards />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Live Map */}
        <div className="lg:col-span-2">
          <MapView />
        </div>

        {/* Recent Alerts */}
        <div className="lg:col-span-1">
          <RecentAlerts />
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button 
                onClick={() => window.location.href = '/carts'}
                className="w-full btn-primary text-sm py-2"
              >
                Create New Cart
              </button>
              <button 
                onClick={() => window.location.href = '/alerts'}
                className="w-full btn-secondary text-sm py-2"
              >
                View All Alerts
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};