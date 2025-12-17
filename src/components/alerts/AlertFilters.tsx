import React from 'react';
import { Filter } from 'lucide-react';

interface AlertFiltersProps {
  filters: {
    status: string;
    alert_type: string;
    severity: string;
  };
  onFilterChange: (filters: any) => void;
}

export const AlertFilters: React.FC<AlertFiltersProps> = ({ filters, onFilterChange }) => {
  const handleFilterChange = (key: string, value: string) => {
    onFilterChange({ [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({ status: 'active', alert_type: '', severity: '' });
  };

  const hasActiveFilters = filters.alert_type || filters.severity || filters.status !== 'active';

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-600" />
          <h3 className="text-sm font-medium text-gray-900">Filter Alerts</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-hocco-primary hover:text-hocco-secondary"
          >
            Clear Filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full input-field text-sm"
          >
            <option value="active">Active</option>
            <option value="acknowledged">Acknowledged</option>
            <option value="resolved">Resolved</option>
            <option value="dismissed">Dismissed</option>
            <option value="">All Status</option>
          </select>
        </div>

        {/* Alert Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Alert Type
          </label>
          <select
            value={filters.alert_type}
            onChange={(e) => handleFilterChange('alert_type', e.target.value)}
            className="w-full input-field text-sm"
          >
            <option value="">All Types</option>
            <option value="proximity">Proximity</option>
            <option value="fraud">Fraud</option>
            <option value="offline">Offline</option>
            <option value="battery_low">Low Battery</option>
          </select>
        </div>

        {/* Severity Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Severity
          </label>
          <select
            value={filters.severity}
            onChange={(e) => handleFilterChange('severity', e.target.value)}
            className="w-full input-field text-sm"
          >
            <option value="">All Severities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>
    </div>
  );
};