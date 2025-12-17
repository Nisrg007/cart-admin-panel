import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useAlerts } from '../../contexts/AlertContext';
import { AlertCard } from './AlertCard';
import { AlertFilters } from './AlertFilters';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface AlertListProps {
  onAcknowledge: (alertId: string) => void;
  onDismiss: (alertId: string, reason?: string) => void;
  onResolve: (alertId: string) => void;
}

export const AlertList: React.FC<AlertListProps> = ({ 
  onAcknowledge, 
  onDismiss, 
  onResolve 
}) => {
  const { alerts, loading, fetchAlerts } = useAlerts();
  const [filters, setFilters] = useState({
    status: 'active' as string,
    alert_type: '' as string,
    severity: '' as string
  });

  React.useEffect(() => {
    fetchAlerts(filters);
  }, [fetchAlerts, filters]);

  const handleFilterChange = (newFilters: any) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const alertStats = {
    total: alerts.length,
    active: alerts.filter(a => a.status === 'active').length,
    acknowledged: alerts.filter(a => a.status === 'acknowledged').length,
    resolved: alerts.filter(a => a.status === 'resolved').length,
    dismissed: alerts.filter(a => a.status === 'dismissed').length
  };

  if (loading) {
    return <LoadingSpinner size="lg" className="py-8" />;
  }

  return (
    <div className="space-y-6">
      {/* Alert Statistics */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="card p-4 text-center">
          <div className="flex items-center justify-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <span className="text-2xl font-bold text-gray-900">{alertStats.total}</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">Total Alerts</p>
        </div>
        <div className="card p-4 text-center">
          <div className="flex items-center justify-center space-x-2">
            <Clock className="w-5 h-5 text-red-500" />
            <span className="text-2xl font-bold text-gray-900">{alertStats.active}</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">Active</p>
        </div>
        <div className="card p-4 text-center">
          <div className="flex items-center justify-center space-x-2">
            <CheckCircle className="w-5 h-5 text-blue-500" />
            <span className="text-2xl font-bold text-gray-900">{alertStats.acknowledged}</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">Acknowledged</p>
        </div>
        <div className="card p-4 text-center">
          <div className="flex items-center justify-center space-x-2">
            <XCircle className="w-5 h-5 text-green-500" />
            <span className="text-2xl font-bold text-gray-900">{alertStats.resolved + alertStats.dismissed}</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">Closed</p>
        </div>
      </div>

      {/* Filters */}
      <AlertFilters filters={filters} onFilterChange={handleFilterChange} />

      {/* Alert List */}
      <div className="space-y-4">
        {alerts.length === 0 ? (
          <div className="text-center py-12">
            <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No alerts found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filters.status === 'active' 
                ? 'No active alerts at the moment.'
                : 'No alerts match the current filters.'
              }
            </p>
          </div>
        ) : (
          alerts.map((alert) => (
            <AlertCard
              key={alert._id}
              alert={alert}
              onAcknowledge={onAcknowledge}
              onDismiss={onDismiss}
              onResolve={onResolve}
            />
          ))
        )}
      </div>
    </div>
  );
};