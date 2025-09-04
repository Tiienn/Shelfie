import React from 'react';
import { Outlet } from 'react-router-dom';
import { Card } from '../components/common/Card';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and branding */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
            <svg
              className="w-8 h-8 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L2 7V17L12 22L22 17V7L12 2ZM12 4.14L19.25 8L12 11.86L4.75 8L12 4.14ZM4 9.86L11 13.14V20.14L4 16.86V9.86ZM13 20.14V13.14L20 9.86V16.86L13 20.14Z" />
            </svg>
          </div>
          <h1 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Shelfie
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Smart pantry management for busy families
          </p>
        </div>

        {/* Auth forms */}
        <Card className="w-full" padding="lg" shadow="lg">
          <Outlet />
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © 2025 Shelfie. Built with ❤️ for busy parents everywhere.
          </p>
        </div>
      </div>
    </div>
  );
};