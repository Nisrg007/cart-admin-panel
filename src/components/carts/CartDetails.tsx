import React from 'react';
import type { Cart } from '../../types/cart';
import { formatDate, getStatusColor } from '../../utils/helpers';
import { MapPin, Clock, Battery, AlertTriangle } from 'lucide-react';

interface CartDetailsProps {
  cart: Cart;
}

export const CartDetails: React.FC<CartDetailsProps> = ({ cart }) => {
  const hasFraud = cart.current_location?.fraud_flags && 
    Object.values(cart.current_location.fraud_flags).some(Boolean);

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Cart Information</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-gray-500">Cart ID</label>
            <p className="mt-1 text-sm text-gray-900">{cart.cart_id}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Vendor ID</label>
            <p className="mt-1 text-sm text-gray-900">{cart.vendor_id}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Model</label>
            <p className="mt-1 text-sm text-gray-900">{cart.cart_model}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Status</label>
            <span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(cart.status)}`}>
              {cart.status}
            </span>
          </div>
          {cart.serial_number && (
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-gray-500">Serial Number</label>
              <p className="mt-1 text-sm text-gray-900">{cart.serial_number}</p>
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-gray-500">Created</label>
            <p className="mt-1 text-sm text-gray-900">{formatDate(cart.created_at)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Last Updated</label>
            <p className="mt-1 text-sm text-gray-900">{formatDate(cart.updated_at)}</p>
          </div>
        </div>
      </div>

      {/* Current Location */}
      {cart.current_location && (
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Current Location</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-900">Coordinates</span>
              </div>
              <span className="text-sm text-gray-600">
                {cart.current_location.latitude.toFixed(6)}, {cart.current_location.longitude.toFixed(6)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-900">Last Update</span>
              </div>
              <span className="text-sm text-gray-600">
                {formatDate(cart.current_location.timestamp)}
              </span>
            </div>

            {cart.current_location.battery_level && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Battery className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium text-gray-900">Battery</span>
                </div>
                <span className={`text-sm font-medium ${
                  cart.current_location.battery_level < 20 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {cart.current_location.battery_level}%
                </span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">Movement</span>
              <span className={`text-sm font-medium ${
                cart.current_location.is_moving ? 'text-green-600' : 'text-gray-600'
              }`}>
                {cart.current_location.is_moving ? 'Moving' : 'Stationary'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">Accuracy</span>
              <span className="text-sm text-gray-600">
                ±{cart.current_location.accuracy.toFixed(1)}m
              </span>
            </div>

            {/* Fraud Detection */}
            {hasFraud && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium text-red-800">Fraud Detection</span>
                </div>
                <div className="mt-1 text-xs text-red-700">
                  {cart.current_location.fraud_flags?.mock_location && '• Mock location detected\n'}
                  {cart.current_location.fraud_flags?.unrealistic_speed && '• Unrealistic speed\n'}
                  {cart.current_location.fraud_flags?.timestamp_skew && '• Timestamp skew'}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Assignment Information */}
      {cart.assignment && (
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Current Assignment</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-900">Renter Phone</span>
              <span className="text-sm text-gray-600">{cart.assignment.renter_phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-900">Assigned At</span>
              <span className="text-sm text-gray-600">{formatDate(cart.assignment.assigned_at)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-900">Expires At</span>
              <span className="text-sm text-gray-600">{formatDate(cart.assignment.expires_at)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-900">Device</span>
              <span className="text-sm text-gray-600">
                {cart.assignment.device_fingerprint.substring(0, 8)}...
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};