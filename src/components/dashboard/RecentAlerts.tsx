import React from 'react';
import { AlertTriangle, Clock, MapPin } from 'lucide-react';
import { useAlerts } from '../../contexts/AlertContext';
import { formatRelativeTime, getSeverityColor } from '../../utils/helpers';

export const RecentAlerts: React.FC = () => {
  const { alerts } = useAlerts();

  const recentAlerts = alerts
    .filter(alert => alert.status === 'active')
    .slice(0, 5)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  if (recentAlerts.length === 0) {
    return (
      <div className="card p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Alerts</h3>
        <div className="text-center py-8">
          <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No active alerts</h3>
          <p className="mt-1 text-sm text-gray-500">
            All systems are running smoothly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Alerts</h3>
      <div className="space-y-4">
        {recentAlerts.map((alert) => (
          <div
            key={alert._id}
            className={`flex items-start space-x-3 p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}
          >
            <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{alert.message}</p>
              <div className="flex items-center space-x-4 mt-1 text-xs text-gray-600">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span>Carts: {alert.cart_ids.join(', ')}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{formatRelativeTime(alert.created_at)}</span>
                </div>
              </div>
            </div>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${
              alert.severity === 'high' ? 'bg-red-100 text-red-800' :
              alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {alert.severity}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};