import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useAlerts } from '../contexts/AlertContext';
import { AlertList } from '../components/alerts/AlertList';

export const Alerts: React.FC = () => {
  const { acknowledgeAlert, dismissAlert, resolveAlert } = useAlerts();

  const handleAcknowledge = async (alertId: string) => {
    try {
      await acknowledgeAlert(alertId);
    } catch (error) {
      console.error('Failed to acknowledge alert:', error);
      alert('Failed to acknowledge alert. Please try again.');
    }
  };

  const handleDismiss = async (alertId: string, reason?: string) => {
    try {
      await dismissAlert(alertId, reason);
    } catch (error) {
      console.error('Failed to dismiss alert:', error);
      alert('Failed to dismiss alert. Please try again.');
    }
  };

  const handleResolve = async (alertId: string) => {
    try {
      await resolveAlert(alertId);
    } catch (error) {
      console.error('Failed to resolve alert:', error);
      alert('Failed to resolve alert. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <AlertTriangle className="w-8 h-8 text-orange-500" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Alert Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Monitor and manage system alerts in real-time
          </p>
        </div>
      </div>

      {/* Alert List */}
      <AlertList
        onAcknowledge={handleAcknowledge}
        onDismiss={handleDismiss}
        onResolve={handleResolve}
      />
    </div>
  );
};