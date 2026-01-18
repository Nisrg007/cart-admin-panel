import React from 'react';
import { Bell, LogOut, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useAlerts } from '../../contexts/AlertContext';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { alerts } = useAlerts();

  const activeAlerts = alerts.filter(alert => alert.status === 'active');
  const highSeverityAlerts = activeAlerts.filter(alert => alert.severity === 'high');

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-hocco-primary">CART</h1>
            <span className="ml-2 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
              Admin Panel
            </span>
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            {/* Alerts Indicator */}
            <div className="relative">
              <Bell className="w-6 h-6 text-gray-600" />
              {activeAlerts.length > 0 && (
                <>
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {activeAlerts.length}
                  </span>
                  {highSeverityAlerts.length > 0 && (
                    <span className="absolute -top-1 -right-1 animate-ping bg-red-500 rounded-full w-5 h-5"></span>
                  )}
                </>
              )}
            </div>

            {/* User Info */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-600" />
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};