import React from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { 
  CameraIcon,
  PencilIcon,
  ChartBarIcon,
  TrophyIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';

const ProfilePage: React.FC = () => {
  const stats = [
    { label: 'Items Tracked', value: '247', change: '+12 this week' },
    { label: 'Money Saved', value: '$340', change: '+$47 this month' },
    { label: 'Food Waste Prevented', value: '15 lbs', change: '23% reduction' },
    { label: 'Recipes Tried', value: '28', change: '+3 new favorites' },
  ];

  const achievements = [
    { name: 'First Scanner', description: 'Scanned your first receipt', earned: true },
    { name: 'Week Warrior', description: '7 days without food waste', earned: true },
    { name: 'Recipe Explorer', description: 'Tried 10 different recipes', earned: false },
    { name: 'Savings Star', description: 'Saved $100 in one month', earned: false },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Profile
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Your journey towards zero food waste
        </p>
      </div>

      {/* Profile Header */}
      <Card>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">SM</span>
            </div>
            <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg border border-gray-200 dark:border-gray-600">
              <CameraIcon className="w-3 h-3 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Sarah Miller
              </h2>
              <Button variant="ghost" size="sm">
                <PencilIcon className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-gray-500 dark:text-gray-400">sarah.miller@example.com</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Member since March 2025 • Family of 4
            </p>
          </div>
        </div>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="text-center">
            <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {stat.value}
            </div>
            <div className="text-sm font-medium text-gray-900 dark:text-white mt-1">
              {stat.label}
            </div>
            <div className="text-xs text-success-600 dark:text-success-400 mt-1">
              {stat.change}
            </div>
          </Card>
        ))}
      </div>

      {/* Achievements */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <TrophyIcon className="w-5 h-5 text-warning-500" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Achievements
            </h3>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            2 of 4 earned
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className={`flex items-center space-x-3 p-3 rounded-lg border ${
                achievement.earned
                  ? 'bg-success-50 border-success-200 dark:bg-success-900/20 dark:border-success-800'
                  : 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                achievement.earned
                  ? 'bg-success-500 text-white'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
              }`}>
                <TrophyIcon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className={`font-medium ${
                  achievement.earned
                    ? 'text-success-900 dark:text-success-100'
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {achievement.name}
                </div>
                <div className={`text-sm ${
                  achievement.earned
                    ? 'text-success-700 dark:text-success-300'
                    : 'text-gray-500 dark:text-gray-500'
                }`}>
                  {achievement.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Activity Chart Placeholder */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <ChartBarIcon className="w-5 h-5 text-primary-500" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Activity Overview
            </h3>
          </div>
          <Button variant="ghost" size="sm">
            View Details
          </Button>
        </div>
        
        <div className="h-48 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <ChartBarIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Activity chart will appear here</p>
            <p className="text-sm">Track your pantry management over time</p>
          </div>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <CalendarDaysIcon className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Recent Activity
            </h3>
          </div>
        </div>
        
        <div className="space-y-3">
          {[
            { action: 'Added 12 items', description: 'From Walmart receipt', time: '2 hours ago' },
            { action: 'Tried new recipe', description: 'One-Pot Pasta Primavera', time: 'Yesterday' },
            { action: 'Used expiring items', description: 'Bananas in smoothie', time: '2 days ago' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {activity.action}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {activity.description}
                </div>
              </div>
              <div className="text-sm text-gray-400">
                {activity.time}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Account Actions */}
      <Card>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Account Settings
        </h3>
        <div className="space-y-2">
          <Button variant="ghost" fullWidth className="justify-start">
            Edit Profile
          </Button>
          <Button variant="ghost" fullWidth className="justify-start">
            Notification Preferences
          </Button>
          <Button variant="ghost" fullWidth className="justify-start">
            Privacy Settings
          </Button>
          <Button variant="ghost" fullWidth className="justify-start">
            Export Data
          </Button>
          <Button variant="ghost" fullWidth className="justify-start text-error-600">
            Sign Out
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;