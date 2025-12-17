import React from 'react';
import { BarChart3, TrendingUp, Users, MapPin } from 'lucide-react';

export const Analytics: React.FC = () => {
  // Placeholder data - in a real app, this would come from your backend
  const analyticsData = {
    totalDistance: '----',
    averageUsage: '----',
    activeUsers: '----',
    alertResolution: '----'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <BarChart3 className="w-8 h-8 text-hocco-primary" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports (coming soon)</h1>
          <p className="mt-1 text-sm text-gray-600">
            System performance metrics and usage statistics
          </p>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-6">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Distance</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.totalDistance}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Usage</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.averageUsage}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <MapPin className="w-8 h-8 text-orange-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.activeUsers}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <BarChart3 className="w-8 h-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Alert Resolution</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.alertResolution}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon Message */}
      <div className="card p-8 text-center">
        <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">Advanced Analytics Coming Soon</h3>
        <p className="mt-2 text-sm text-gray-600">
          We're working on comprehensive analytics features including:
        </p>
        <ul className="mt-4 text-sm text-gray-600 space-y-2">
          <li>• Detailed usage patterns and trends</li>
          <li>• Cart movement heatmaps</li>
          <li>• Performance metrics and KPIs</li>
          <li>• Custom report generation</li>
          <li>• Export to PDF/Excel functionality</li>
        </ul>
      </div>
    </div>
  );
};