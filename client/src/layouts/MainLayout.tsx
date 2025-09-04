import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navigation } from '../components/navigation/Navigation';
import { TopBar } from '../components/navigation/TopBar';

export const MainLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Desktop sidebar - hidden on mobile */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <Navigation />
      </div>
      
      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top bar */}
        <TopBar />
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto focus:outline-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Outlet />
          </div>
        </main>
        
        {/* Mobile navigation - shown at bottom on mobile */}
        <div className="lg:hidden">
          <Navigation />
        </div>
      </div>
    </div>
  );
};