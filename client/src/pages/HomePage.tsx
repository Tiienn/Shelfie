import React from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { 
  PlusIcon,
  CameraIcon,
  ChartBarIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

const HomePage: React.FC = () => {
  const quickActions = [
    {
      name: 'Add Item',
      description: 'Quickly add items to your pantry',
      icon: PlusIcon,
      href: '/pantry/add',
      color: 'bg-primary-500',
    },
    {
      name: 'Scan Receipt',
      description: 'Upload a receipt to auto-add items',
      icon: CameraIcon,
      href: '/scanner',
      color: 'bg-secondary-500',
    },
    {
      name: 'View Analytics',
      description: 'See your savings and usage patterns',
      icon: ChartBarIcon,
      href: '/analytics',
      color: 'bg-success-500',
    },
  ];

  const expiringItems = [
    { name: 'Milk', expiresIn: '2 days', category: 'Dairy' },
    { name: 'Bread', expiresIn: '3 days', category: 'Grains' },
    { name: 'Bananas', expiresIn: '4 days', category: 'Produce' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back!
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Let's keep your pantry organized and reduce food waste
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickActions.map((action) => (
          <Card
            key={action.name}
            interactive
            onClick={() => console.log(`Navigate to ${action.href}`)}
            className="hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {action.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {action.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="text-center">
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            24
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Items in Pantry
          </div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-warning-600 dark:text-warning-400">
            3
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Expiring Soon
          </div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-success-600 dark:text-success-400">
            $47
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Monthly Savings
          </div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-error-600 dark:text-error-400">
            2
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Items Wasted
          </div>
        </Card>
      </div>

      {/* Expiring Items */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <ClockIcon className="w-5 h-5 text-warning-500" />
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Expiring Soon
            </h2>
          </div>
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </div>
        
        <div className="space-y-3">
          {expiringItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {item.name}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {item.category}
                </div>
              </div>
              <div className="text-sm font-medium text-warning-600 dark:text-warning-400">
                {item.expiresIn}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Activity placeholder */}
      <Card>
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Recent Activity
        </h2>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>No recent activity to show</p>
          <p className="text-sm mt-2">Start by adding items to your pantry!</p>
        </div>
      </Card>
    </div>
  );
};

export default HomePage;