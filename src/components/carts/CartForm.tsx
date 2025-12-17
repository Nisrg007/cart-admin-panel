import React, { useState, useEffect } from 'react';
import type { Cart, CreateCartRequest } from '../../types/cart';
import { validateCartId } from '../../utils/validation';

interface CartFormProps {
  cart?: Cart;
  onSubmit: (data: CreateCartRequest) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const CartForm: React.FC<CartFormProps> = ({ 
  cart, 
  onSubmit, 
  onCancel, 
  loading = false 
}) => {
  const [formData, setFormData] = useState<CreateCartRequest>({
    cart_id: '',
    vendor_id: '',
    cart_model: '',
    serial_number: '',
    status: 'active'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (cart) {
      setFormData({
        cart_id: cart.cart_id,
        vendor_id: cart.vendor_id,
        cart_model: cart.cart_model,
        serial_number: cart.serial_number || '',
        status: cart.status
      });
    }
  }, [cart]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.cart_id.trim()) {
      newErrors.cart_id = 'Cart ID is required';
    } else if (!validateCartId(formData.cart_id)) {
      newErrors.cart_id = 'Cart ID must be 3-50 characters and contain only letters, numbers, underscores, and hyphens';
    }

    if (!formData.vendor_id.trim()) {
      newErrors.vendor_id = 'Vendor ID is required';
    }

    if (!formData.cart_model.trim()) {
      newErrors.cart_model = 'Cart model is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await onSubmit(formData);
    } catch (error: any) {
      setErrors({ submit: error.message });
    }
  };

  const handleChange = (field: keyof CreateCartRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {errors.submit}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Cart ID */}
        <div>
          <label htmlFor="cart_id" className="block text-sm font-medium text-gray-700">
            Cart ID *
          </label>
          <input
            type="text"
            id="cart_id"
            value={formData.cart_id}
            onChange={(e) => handleChange('cart_id', e.target.value)}
            disabled={!!cart} // Can't change cart ID when editing
            className={`mt-1 input-field ${errors.cart_id ? 'border-red-300' : ''}`}
            placeholder="e.g., CART_001"
          />
          {errors.cart_id && (
            <p className="mt-1 text-sm text-red-600">{errors.cart_id}</p>
          )}
        </div>

        {/* Vendor ID */}
        <div>
          <label htmlFor="vendor_id" className="block text-sm font-medium text-gray-700">
            Vendor ID *
          </label>
          <input
            type="text"
            id="vendor_id"
            value={formData.vendor_id}
            onChange={(e) => handleChange('vendor_id', e.target.value)}
            className={`mt-1 input-field ${errors.vendor_id ? 'border-red-300' : ''}`}
            placeholder="e.g., Vendor name"
          />
          {errors.vendor_id && (
            <p className="mt-1 text-sm text-red-600">{errors.vendor_id}</p>
          )}
        </div>

        {/* Cart Model */}
        <div className="sm:col-span-2">
          <label htmlFor="cart_model" className="block text-sm font-medium text-gray-700">
            Cart Model *
          </label>
          <input
            type="text"
            id="cart_model"
            value={formData.cart_model}
            onChange={(e) => handleChange('cart_model', e.target.value)}
            className={`mt-1 input-field ${errors.cart_model ? 'border-red-300' : ''}`}
            placeholder="e.g., Standard Shopping Cart v2"
          />
          {errors.cart_model && (
            <p className="mt-1 text-sm text-red-600">{errors.cart_model}</p>
          )}
        </div>

        {/* Serial Number */}
        <div className="sm:col-span-2">
          <label htmlFor="serial_number" className="block text-sm font-medium text-gray-700">
            Serial Number (Optional)
          </label>
          <input
            type="text"
            id="serial_number"
            value={formData.serial_number}
            onChange={(e) => handleChange('serial_number', e.target.value)}
            className="mt-1 input-field"
            placeholder="e.g., SN123456789"
          />
        </div>

        {/* Status */}
        <div className="sm:col-span-2">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="mt-1 input-field"
          >
            <option value="active">Active</option>
            <option value="maintenance">Maintenance</option>
            <option value="retired">Retired</option>
          </select>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : cart ? 'Update Cart' : 'Create Cart'}
        </button>
      </div>
    </form>
  );
};