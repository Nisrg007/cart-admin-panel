import React, { useEffect } from 'react';
import { useCarts } from '../../contexts/CartContext';
import { CartMap } from '../maps/CartMap';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const MapView: React.FC = () => {
  const { carts, loading, fetchCarts } = useCarts();

  useEffect(() => {
    fetchCarts();
  }, [fetchCarts]);

  if (loading) {
    return (
      <div className="card p-6">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  const cartsWithLocations = carts.filter(cart => cart.current_location);

  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Live Cart Locations</h3>
        <div className="text-sm text-gray-500">
          {cartsWithLocations.length} carts with locations
        </div>
      </div>
      <div className="h-96 rounded-lg overflow-hidden">
        <CartMap carts={cartsWithLocations} />
      </div>
    </div>
  );
};