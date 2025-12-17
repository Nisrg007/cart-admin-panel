import React from 'react';
import { ShoppingCart, AlertTriangle, MapPin, Battery } from 'lucide-react';
import { useCarts } from '../../contexts/CartContext';
import { useAlerts } from '../../contexts/AlertContext';

export const StatsCards: React.FC = () => {
  const { carts } = useCarts();
  const { alerts } = useAlerts();

  const activeCarts = carts.filter(cart => cart.status === 'active');
  const movingCarts = carts.filter(cart => cart.current_location?.is_moving);
  const activeAlerts = alerts.filter(alert => alert.status === 'active');
  const highAlerts = activeAlerts.filter(alert => alert.severity === 'high');

  const stats = [
    {
      name: 'Total Carts',
      value: carts.length.toString(),
      change: '+4.75%',
      changeType: 'positive' as const,
      icon: ShoppingCart,
      description: `${activeCarts.length} active, ${movingCarts.length} moving`
    },
    {
      name: 'Active Alerts',
      value: activeAlerts.length.toString(),
      change: `${highAlerts.length} critical`,
      changeType: highAlerts.length > 0 ? 'negative' as const : 'positive' as const,
      icon: AlertTriangle,
      description: `${highAlerts.length} high priority alerts`
    },
    {
      name: 'Online Carts',
      value: activeCarts.length.toString(),
      change: `${Math.round((activeCarts.length / carts.length) * 100)}%`,
      changeType: 'positive' as const,
      icon: MapPin,
      description: 'Currently tracking locations'
    },
    {
      name: 'System Health',
      value: '100%',
      change: 'All systems operational',
      changeType: 'positive' as const,
      icon: Battery,
      description: 'Backend services running normally'
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const changeColor = stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600';
        
        return (
          <div key={stat.name} className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Icon className="w-8 h-8 text-hocco-primary" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </div>
                    <div className={`ml-2 flex items-baseline text-sm font-semibold ${changeColor}`}>
                      {stat.change}
                    </div>
                  </dd>
                  <dd className="text-sm text-gray-500 mt-1">
                    {stat.description}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};