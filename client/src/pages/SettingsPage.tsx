import React from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useAppStore } from '../store/slices/appSlice';

const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useAppStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Customize your Shelfie experience
        </p>
      </div>

      {/* Appearance */}
      <Card>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Appearance
        </h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Theme
            </label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Coming Soon placeholders */}
      <Card>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>More settings coming soon!</p>
        </div>
      </Card>
    </div>
  );
};

export default SettingsPage;