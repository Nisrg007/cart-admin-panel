import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';

export const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <SettingsIcon className="w-8 h-8 text-hocco-primary" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Coming soon</h1>
          <p className="mt-1 text-sm text-gray-600">
            Configure system preferences and monitoring settings
          </p>
        </div>
      </div>
    </div>
  );
};