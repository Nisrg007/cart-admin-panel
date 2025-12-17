import React, { useState } from 'react';
import { ShoppingCart, MapPin, Edit2, Trash2, QrCode } from 'lucide-react';
import type { Cart } from '../../types/cart';
import { useCarts } from '../../contexts/CartContext';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { formatDate, getStatusColor } from '../../utils/helpers';

interface CartListProps {
  onEdit: (cart: Cart) => void;
  onAssign: (cart: Cart) => void;
  onDelete: (cartId: string) => void;
}

export const CartList: React.FC<CartListProps> = ({ onEdit, onAssign, onDelete }) => {
  const { carts, loading, fetchCarts } = useCarts();
  const [filter, setFilter] = useState<'all' | 'active' | 'maintenance' | 'retired'>('all');

  React.useEffect(() => {
    fetchCarts();
  }, [fetchCarts]);

  const filteredCarts = carts.filter(cart => 
    filter === 'all' || cart.status === filter
  );

  const statusCounts = {
    all: carts.length,
    active: carts.filter(c => c.status === 'active').length,
    maintenance: carts.filter(c => c.status === 'maintenance').length,
    retired: carts.filter(c => c.status === 'retired').length
  };

  if (loading) {
    return <LoadingSpinner size="lg" className="py-8" />;
  }

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'all' as const, label: 'All Carts', count: statusCounts.all },
            { key: 'active' as const, label: 'Active', count: statusCounts.active },
            { key: 'maintenance' as const, label: 'Maintenance', count: statusCounts.maintenance },
            { key: 'retired' as const, label: 'Retired', count: statusCounts.retired }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${filter === tab.key
                  ? 'border-hocco-primary text-hocco-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </nav>
      </div>

      {/* Cart Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCarts.map((cart) => (
          <div key={cart.cart_id} className="card p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <ShoppingCart className="w-6 h-6 text-hocco-primary" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {cart.cart_id}
                  </h3>
                  <p className="text-sm text-gray-500">{cart.cart_model}</p>
                </div>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(cart.status)}`}>
                {cart.status}
              </span>
            </div>

            {/* Cart Details */}
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Vendor:</span>
                <span className="font-medium">{cart.vendor_id}</span>
              </div>
              {cart.serial_number && (
                <div className="flex justify-between">
                  <span>Serial:</span>
                  <span className="font-medium">{cart.serial_number}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Created:</span>
                <span>{formatDate(cart.created_at)}</span>
              </div>
            </div>

            {/* Location Status */}
            {cart.current_location && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="w-4 h-4 text-green-600" />
                  <span className="text-green-600 font-medium">Online</span>
                  {cart.current_location.is_moving && (
                    <span className="text-orange-600">• Moving</span>
                  )}
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  Updated {formatDate(cart.current_location.timestamp)}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => onEdit(cart)}
                className="flex-1 btn-secondary flex items-center justify-center space-x-1 text-sm"
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => onAssign(cart)}
                className="flex-1 btn-primary flex items-center justify-center space-x-1 text-sm"
              >
                <QrCode className="w-4 h-4" />
                <span>Assign</span>
              </button>
              <button
                onClick={() => onDelete(cart.cart_id)}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete Cart"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCarts.length === 0 && (
        <div className="text-center py-12">
          <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No carts found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {filter === 'all' 
              ? 'Get started by creating a new cart.'
              : `No ${filter} carts found.`
            }
          </p>
        </div>
      )}
    </div>
  );
};