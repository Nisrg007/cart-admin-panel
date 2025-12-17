import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Copy, Check, X } from 'lucide-react';
import type { Cart, AssignCartRequest } from '../../types/cart';
import { useCarts } from '../../contexts/CartContext';
import { validatePhone } from '../../utils/validation';
import { generateQRCodeData } from '../../utils/helpers';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface AssignCartModalProps {
  cart: Cart;
  onClose: () => void;
  onAssign: (assignmentData: any) => void;
}

export const AssignCartModal: React.FC<AssignCartModalProps> = ({ 
  cart, 
  onClose, 
  onAssign 
}) => {
  const { assignCart } = useCarts();
  const [formData, setFormData] = useState({
    renter_phone: '',
    duration_hours: 24
  });
  const [assignmentResult, setAssignmentResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validatePhone(formData.renter_phone)) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    try {
      const assignmentData: AssignCartRequest = {
        cart_id: cart.cart_id,
        renter_phone: formData.renter_phone,
        duration_hours: formData.duration_hours
      };

      const result = await assignCart(assignmentData);
      setAssignmentResult(result);
      // Don't call onAssign here - let the user see the QR code first
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const downloadQRCode = () => {
    if (!assignmentResult) return;

    const svg = document.getElementById('qrcode-svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `hocco-assignment-${cart.cart_id}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const handleClose = () => {
    // Only call onAssign when actually closing the modal after QR is shown
    if (assignmentResult) {
      onAssign(assignmentResult);
    }
    onClose();
  };

  if (assignmentResult) {
    const qrData = generateQRCodeData(
      assignmentResult.assignment_token,
      formData.renter_phone
    );

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-6 border w-96 shadow-lg rounded-md bg-white">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Assignment Created Successfully
            </h3>

            {/* QR Code */}
            <div className="flex justify-center mb-4">
              <div className="border-2 border-gray-200 p-4 rounded-lg bg-white">
                <QRCodeSVG
                  id="qrcode-svg"
                  value={qrData}
                  size={200}
                  level="H"
                  includeMargin
                />
              </div>
            </div>

            {/* Assignment Details */}
            <div className="text-left space-y-2 mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Cart ID:</span>
                <span className="text-sm font-medium">{cart.cart_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Renter Phone:</span>
                <span className="text-sm font-medium">{formData.renter_phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Expires:</span>
                <span className="text-sm font-medium">
                  {new Date(assignmentResult.expires_at).toLocaleString()}
                </span>
              </div>
            </div>

            {/* QR Code URL */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">QR Code URL:</p>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={qrData}
                  readOnly
                  className="flex-1 input-field text-sm"
                />
                <button
                  onClick={() => copyToClipboard(qrData)}
                  className="btn-primary flex items-center space-x-1 text-sm px-3 py-2"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={downloadQRCode}
                className="flex-1 btn-secondary flex items-center justify-center space-x-1 text-sm"
              >
                <Download className="w-4 h-4" />
                <span>Download QR</span>
              </button>
              <button
                onClick={handleClose}
                className="flex-1 btn-primary text-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-6 border w-96 shadow-lg rounded-md bg-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Assign Cart {cart.cart_id}
          </h3>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleAssign} className="space-y-4">
            <div>
              <label htmlFor="renter_phone" className="block text-sm font-medium text-gray-700">
                Renter Phone Number *
              </label>
              <input
                type="tel"
                id="renter_phone"
                value={formData.renter_phone}
                onChange={(e) => setFormData(prev => ({ ...prev, renter_phone: e.target.value }))}
                className="mt-1 input-field"
                placeholder="+1234567890"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Format: +1234567890 or 1234567890
              </p>
            </div>

            <div>
              <label htmlFor="duration_hours" className="block text-sm font-medium text-gray-700">
                Assignment Duration
              </label>
              <select
                id="duration_hours"
                value={formData.duration_hours}
                onChange={(e) => setFormData(prev => ({ ...prev, duration_hours: parseInt(e.target.value) }))}
                className="mt-1 input-field"
              >
                <option value={1}>1 Hour</option>
                <option value={6}>6 Hours</option>
                <option value={24}>24 Hours</option>
                <option value={72}>3 Days</option>
                <option value={168}>7 Days</option>
              </select>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 btn-secondary"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? <LoadingSpinner size="sm" /> : 'Generate QR Code'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};