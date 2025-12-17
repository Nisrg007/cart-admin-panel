import React, { useEffect, useState } from 'react';
import { Filter } from 'lucide-react';

import { useCarts } from '../contexts/CartContext';
import { CartMap } from '../components/maps/CartMap';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const LiveMap: React.FC = () => {
  const { carts, loading, fetchCarts } = useCarts();
  const [filter, setFilter] = useState<'all' | 'active' | 'maintenance' | 'retired'>('all');
  const [mapStats, setMapStats] = useState({
    total: 0,
    online: 0,
    moving: 0,
    withLocations: 0
  });

  useEffect(() => {
    fetchCarts();
  }, [fetchCarts]);

  useEffect(() => {
    const onlineCarts = carts.filter(cart => cart.current_location);
    const movingCarts = carts.filter(cart => cart.current_location?.is_moving);
    
    setMapStats({
      total: carts.length,
      online: onlineCarts.length,
      moving: movingCarts.length,
      withLocations: onlineCarts.length
    });
  }, [carts]);

  const filteredCarts = carts.filter(cart => 
    filter === 'all' || cart.status === filter
  );

  const cartsWithLocations = filteredCarts.filter(cart => cart.current_location);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Map Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Live Cart Map</h1>
            <p className="text-sm text-gray-600 mt-1">
              Real-time tracking of all carts with live location updates
            </p>
          </div>
          
          {/* Map Stats */}
          <div className="flex items-center space-x-6 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{mapStats.total}</div>
              <div className="text-gray-500">Total Carts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{mapStats.online}</div>
              <div className="text-gray-500">Online</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{mapStats.moving}</div>
              <div className="text-gray-500">Moving</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4 mt-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filter:</span>
          </div>
          {[
            { key: 'all' as const, label: 'All Carts', count: carts.length },
            { key: 'active' as const, label: 'Active', count: carts.filter(c => c.status === 'active').length },
            { key: 'maintenance' as const, label: 'Maintenance', count: carts.filter(c => c.status === 'maintenance').length },
            { key: 'retired' as const, label: 'Retired', count: carts.filter(c => c.status === 'retired').length }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`
                px-3 py-1 rounded-full text-sm font-medium transition-colors
                ${filter === tab.key
                  ? 'bg-hocco-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Status Legend */}
        <div className="flex items-center space-x-6 mt-3 text-xs text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Active & Online</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Maintenance</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Retired</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span>Moving</span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        {cartsWithLocations.length > 0 ? (
          <CartMap carts={cartsWithLocations} />
        ) : (
          <div className="h-full flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="text-gray-400 text-6xl mb-4">🗺️</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Carts with Locations</h3>
              <p className="text-gray-600 max-w-md">
                {filter === 'all' 
                  ? 'No carts have reported their location yet. Locations will appear here when carts start sending GPS data.'
                  : `No ${filter} carts have reported their location.`
                }
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Real-time Status Bar */}
      <div className="bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>
              Showing <strong>{cartsWithLocations.length}</strong> of <strong>{filteredCarts.length}</strong> carts
            </span>
            <span className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live updates active</span>
            </span>
          </div>
          <div className="text-xs">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};