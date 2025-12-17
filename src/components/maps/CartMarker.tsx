import React from 'react';
import { ShoppingCart, AlertTriangle } from 'lucide-react';
import type { Cart } from '../../types/cart';
import { getStatusColor } from '../../utils/helpers';

interface CartMarkerProps {
  cart: Cart;
  onClick: () => void;
}

export const CartMarker: React.FC<CartMarkerProps> = ({ cart, onClick }) => {
  const hasFraud = cart.current_location?.fraud_flags && 
    Object.values(cart.current_location.fraud_flags).some(Boolean);
  
  const isMoving = cart.current_location?.is_moving;
  const statusColor = getStatusColor(cart.status);

  return (
    <div 
      className="relative cursor-pointer transform hover:scale-110 transition-transform"
      onClick={onClick}
      title={`Cart ${cart.cart_id} - ${cart.status}`}
    >
      {/* Main Marker */}
      <div className={`
        relative rounded-full p-2 shadow-lg border-2 border-white
        ${isMoving ? 'animate-pulse' : ''}
        ${statusColor.includes('green') ? 'bg-green-500' : 
          statusColor.includes('yellow') ? 'bg-yellow-500' : 
          'bg-red-500'}
      `}>
        <ShoppingCart className="w-4 h-4 text-white" />
        
        {/* Fraud Indicator */}
        {hasFraud && (
          <div className="absolute -top-1 -right-1">
            <AlertTriangle className="w-3 h-3 text-red-600 fill-red-600" />
          </div>
        )}
      </div>

      {/* Moving Indicator */}
      {isMoving && (
        <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75"></div>
      )}
    </div>
  );
};