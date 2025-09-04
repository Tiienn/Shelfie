import React from 'react';
import { useAppStore } from '../../store/slices/appSlice';
import { useAuthStore } from '../../store/slices/authSlice';
import { Button } from '../common/Button';
import { 
  BellIcon, 
  MoonIcon, 
  SunIcon,
  Bars3Icon,
  WifiIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

export const TopBar: React.FC = () => {
  const { theme, isOnline, toggleTheme, pendingSyncCount } = useAppStore();
  const { user } = useAuthStore();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 lg:pl-64">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button variant="ghost" size="sm">
              <Bars3Icon className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Page title - will be dynamically set by pages */}
          <div className="flex-1 lg:flex-none">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white lg:hidden">
              Shelfie
            </h1>
          </div>
          
          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            {/* Sync status indicator */}
            <div className="flex items-center space-x-1">
              {!isOnline && (
                <div className="flex items-center text-warning-600 dark:text-warning-400">
                  <ExclamationTriangleIcon className="w-4 h-4" />
                </div>
              )}
              {pendingSyncCount > 0 && (
                <div className="flex items-center text-primary-600 dark:text-primary-400">
                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                  <span className="ml-1 text-xs font-medium">{pendingSyncCount}</span>
                </div>
              )}
              {isOnline && pendingSyncCount === 0 && (
                <WifiIcon className="w-4 h-4 text-success-500" />
              )}
            </div>
            
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <BellIcon className="w-5 h-5" />
              {/* Notification badge */}
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-error-500 rounded-full flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
              </span>
            </Button>
            
            {/* Theme toggle */}
            <Button variant="ghost" size="sm" onClick={toggleTheme}>
              {theme === 'dark' ? (
                <SunIcon className="w-5 h-5" />
              ) : (
                <MoonIcon className="w-5 h-5" />
              )}
            </Button>
            
            {/* User menu */}
            <div className="flex items-center">
              <Button variant="ghost" className="flex items-center space-x-2 px-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user?.name || 'User'}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};