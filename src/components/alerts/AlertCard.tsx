import React, { useState } from 'react';
import { 
  AlertTriangle, 
  MapPin, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye,
  MoreVertical
} from 'lucide-react';
import type { Alert } from '../../types/alert';
import { formatRelativeTime, getSeverityColor } from '../../utils/helpers';

interface AlertCardProps {
  alert: Alert;
  onAcknowledge: (alertId: string) => void;
  onDismiss: (alertId: string, reason?: string) => void;
  onResolve: (alertId: string) => void;
}

export const AlertCard: React.FC<AlertCardProps> = ({ 
  alert, 
  onAcknowledge, 
  onDismiss, 
  onResolve 
}) => {
  const [showActions, setShowActions] = useState(false);
  const [showDismissReason, setShowDismissReason] = useState(false);
  const [dismissReason, setDismissReason] = useState('');

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'proximity':
        return <Users className="w-5 h-5 text-orange-500" />;
      case 'fraud':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'offline':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'battery_low':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleDismiss = () => {
    if (showDismissReason) {
      onDismiss(alert._id, dismissReason);
      setShowDismissReason(false);
      setDismissReason('');
    } else {
      setShowDismissReason(true);
    }
  };

  const handleAction = (action: 'acknowledge' | 'resolve') => {
    setShowActions(false);
    if (action === 'acknowledge') {
      onAcknowledge(alert._id);
    } else {
      onResolve(alert._id);
    }
  };

  return (
    <div className={`card p-4 ${getSeverityColor(alert.severity)}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          {/* Alert Icon */}
          <div className="flex-shrink-0 mt-1">
            {getAlertIcon(alert.alert_type)}
          </div>

          {/* Alert Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-sm font-medium text-gray-900">{alert.message}</h3>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${
                alert.severity === 'high' ? 'bg-red-100 text-red-800' :
                alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {alert.severity}
              </span>
            </div>

            {/* Alert Details */}
            <div className="flex items-center space-x-4 text-xs text-gray-600">
              <div className="flex items-center space-x-1">
                <MapPin className="w-3 h-3" />
                <span>Carts: {alert.cart_ids.join(', ')}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{formatRelativeTime(alert.created_at)}</span>
              </div>
              {alert.acknowledged_by && (
                <div className="flex items-center space-x-1">
                  <Eye className="w-3 h-3" />
                  <span>Acknowledged by {alert.acknowledged_by}</span>
                </div>
              )}
            </div>

            {/* Additional Details */}
            {alert.details && Object.keys(alert.details).length > 0 && (
              <div className="mt-2 text-xs text-gray-500">
                {alert.alert_type === 'proximity' && (
                  <span>Distance: {alert.details.distance}m (Threshold: {alert.details.threshold}m)</span>
                )}
                {alert.alert_type === 'fraud' && (
                  <span>Type: {alert.details.fraud_type}</span>
                )}
                {alert.alert_type === 'offline' && (
                  <span>Offline for: {alert.details.offlineMinutes} minutes</span>
                )}
                {alert.alert_type === 'battery_low' && (
                  <span>Battery level: {alert.details.batteryLevel}%</span>
                )}
              </div>
            )}

            {/* Dismiss Reason Input */}
            {showDismissReason && (
              <div className="mt-3">
                <input
                  type="text"
                  value={dismissReason}
                  onChange={(e) => setDismissReason(e.target.value)}
                  placeholder="Enter reason for dismissal..."
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={handleDismiss}
                    disabled={!dismissReason.trim()}
                    className="btn-primary text-sm px-3 py-1 disabled:opacity-50"
                  >
                    Confirm Dismiss
                  </button>
                  <button
                    onClick={() => setShowDismissReason(false)}
                    className="btn-secondary text-sm px-3 py-1"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Menu */}
        <div className="relative">
          {alert.status === 'active' && (
            <>
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showActions && (
                <div className="absolute right-0 top-8 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                  <div className="py-1">
                    <button
                      onClick={() => handleAction('acknowledge')}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Acknowledge</span>
                    </button>
                    <button
                      onClick={() => handleAction('resolve')}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Resolve</span>
                    </button>
                    <button
                      onClick={handleDismiss}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Dismiss</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {alert.status !== 'active' && (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              alert.status === 'acknowledged' ? 'bg-blue-100 text-blue-800' :
              alert.status === 'resolved' ? 'bg-green-100 text-green-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {alert.status}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};