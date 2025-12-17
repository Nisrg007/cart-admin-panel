import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import type { Cart, CreateCartRequest } from '../types/cart';
import { useCarts } from '../contexts/CartContext';
import { CartList } from '../components/carts/CartList';
import { CartForm } from '../components/carts/CartForm';
import { AssignCartModal } from '../components/carts/AssignCartModal';
import { CartDetails } from '../components/carts/CartDetails';

type ViewMode = 'list' | 'create' | 'edit' | 'details' | 'assign';

export const Carts: React.FC = () => {
  const { createCart, updateCart, deleteCart } = useCarts();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedCart, setSelectedCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCreateCart = async (cartData: CreateCartRequest) => {
    setLoading(true);
    try {
      await createCart(cartData);
      setViewMode('list');
    } catch (error) {
      console.error('Failed to create cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCart = async (cartData: CreateCartRequest) => {
    if (!selectedCart) return;
    
    setLoading(true);
    try {
      await updateCart(selectedCart.cart_id, cartData);
      setViewMode('list');
      setSelectedCart(null);
    } catch (error) {
      console.error('Failed to update cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCart = async (cartId: string) => {
    if (!confirm('Are you sure you want to delete this cart? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteCart(cartId);
    } catch (error) {
      console.error('Failed to delete cart:', error);
      alert('Failed to delete cart. Please try again.');
    }
  };

  const handleEdit = (cart: Cart) => {
    setSelectedCart(cart);
    setViewMode('edit');
  };

  const handleAssign = (cart: Cart) => {
  setSelectedCart(cart);
  setViewMode('assign');
};

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedCart(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cart Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Create, manage, and assign carts to renters
          </p>
        </div>

        {viewMode === 'list' && (
          <button
            onClick={() => setViewMode('create')}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Cart</span>
          </button>
        )}
      </div>

      {/* Create/Edit Form */}
      {(viewMode === 'create' || viewMode === 'edit') && (
        <div className="card p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">
            {viewMode === 'create' ? 'Create New Cart' : `Edit Cart ${selectedCart?.cart_id}`}
          </h2>
          <CartForm
            cart={viewMode === 'edit' ? selectedCart! : undefined}
            onSubmit={viewMode === 'create' ? handleCreateCart : handleUpdateCart}
            onCancel={handleBackToList}
            loading={loading}
          />
        </div>
      )}

      {/* Cart Details */}
      {viewMode === 'details' && selectedCart && (
        <div>
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={handleBackToList}
              className="btn-secondary"
            >
              ← Back to List
            </button>
            <h2 className="text-lg font-medium text-gray-900">
              Cart Details: {selectedCart.cart_id}
            </h2>
          </div>
          <CartDetails cart={selectedCart} />
        </div>
      )}

{viewMode === 'assign' && selectedCart && (
  <AssignCartModal
    cart={selectedCart}
    onClose={handleBackToList}
    onAssign={(assignmentData) => {
      console.log('Assignment created:', assignmentData);
    }}
  />
)}

      {/* Cart List */}
      {viewMode === 'list' && (
        <CartList
          onEdit={handleEdit}
          onAssign={handleAssign}
          onDelete={handleDeleteCart}
        />
      )}
    </div>
  );
};