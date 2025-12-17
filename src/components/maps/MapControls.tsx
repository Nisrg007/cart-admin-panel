import React from 'react';
import { ZoomIn, ZoomOut, Navigation, Filter } from 'lucide-react';
import type { Cart } from '../../types/cart';

interface MapControlsProps {
  carts: Cart[];
  onFitToBounds: () => void;
  onFilterChange?: (filter: string) => void;
}

export const MapControls: React.FC<MapControlsProps> = ({ 
  carts, 
  onFitToBounds,
  onFilterChange 
}) => {
  const statusCounts = {
    active: carts.filter(c => c.status === 'active').length,
    maintenance: carts.filter(c => c.status === 'maintenance').length,
    retired: carts.filter(c => c.status === 'retired').length
  };

  return (
    <div className="absolute top-4 left-4 space-y-2">
      {/* Zoom Controls */}
      <div className="card p-2 space-y-1">
        <button 
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
          onClick={() => {/* Implement zoom in */}}
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button 
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
          onClick={() => {/* Implement zoom out */}}
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div>

      {/* Fit to Bounds */}
      <button
        className="card p-2 hover:bg-gray-50 transition-colors"
        onClick={onFitToBounds}
        title="Fit to all carts"
      >
        <Navigation className="w-4 h-4" />
      </button>

      {/* Status Filter */}
      <div className="card p-3">
        <div className="flex items-center space-x-2 mb-2">
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">Filter</span>
        </div>
        
        <div className="space-y-1 text-xs">
          <button 
            className="flex items-center justify-between w-full px-2 py-1 rounded hover:bg-gray-100"
            onClick={() => onFilterChange?.('all')}
          >
            <span>All Carts</span>
            <span className="text-gray-500">{carts.length}</span>
          </button>
          <button 
            className="flex items-center justify-between w-full px-2 py-1 rounded hover:bg-gray-100"
            onClick={() => onFilterChange?.('active')}
          >
            <span className="text-green-600">Active</span>
            <span className="text-gray-500">{statusCounts.active}</span>
          </button>
          <button 
            className="flex items-center justify-between w-full px-2 py-1 rounded hover:bg-gray-100"
            onClick={() => onFilterChange?.('maintenance')}
          >
            <span className="text-yellow-600">Maintenance</span>
            <span className="text-gray-500">{statusCounts.maintenance}</span>
          </button>
          <button 
            className="flex items-center justify-between w-full px-2 py-1 rounded hover:bg-gray-100"
            onClick={() => onFilterChange?.('retired')}
          >
            <span className="text-red-600">Retired</span>
            <span className="text-gray-500">{statusCounts.retired}</span>
          </button>
        </div>
      </div>
    </div>
  );
};