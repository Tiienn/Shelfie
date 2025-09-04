import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import {
  HomeIcon,
  ArchiveBoxIcon,
  CameraIcon,
  BookOpenIcon,
  ShoppingBagIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  ArchiveBoxIcon as ArchiveBoxIconSolid,
  CameraIcon as CameraIconSolid,
  BookOpenIcon as BookOpenIconSolid,
  ShoppingBagIcon as ShoppingBagIconSolid,
  UserIcon as UserIconSolid,
} from '@heroicons/react/24/solid';

const navigationItems = [
  {
    name: 'Home',
    href: '/',
    icon: HomeIcon,
    iconActive: HomeIconSolid,
  },
  {
    name: 'Pantry',
    href: '/pantry',
    icon: ArchiveBoxIcon,
    iconActive: ArchiveBoxIconSolid,
  },
  {
    name: 'Scanner',
    href: '/scanner',
    icon: CameraIcon,
    iconActive: CameraIconSolid,
  },
  {
    name: 'Recipes',
    href: '/recipes',
    icon: BookOpenIcon,
    iconActive: BookOpenIconSolid,
  },
  {
    name: 'Grocery',
    href: '/grocery',
    icon: ShoppingBagIcon,
    iconActive: ShoppingBagIconSolid,
  },
  {
    name: 'Profile',
    href: '/profile',
    icon: UserIcon,
    iconActive: UserIconSolid,
  },
];

export const Navigation: React.FC = () => {
  const location = useLocation();

  return (
    <>
      {/* Desktop Navigation (Sidebar) */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:bg-white lg:dark:bg-gray-800 lg:shadow-lg">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 px-6">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7V17L12 22L22 17V7L12 2ZM12 4.14L19.25 8L12 11.86L4.75 8L12 4.14ZM4 9.86L11 13.14V20.14L4 16.86V9.86ZM13 20.14V13.14L20 9.86V16.86L13 20.14Z" />
              </svg>
            </div>
            <span className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
              Shelfie
            </span>
          </div>
          
          {/* Navigation Links */}
          <nav className="mt-8 flex-1 px-3 space-y-1">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href || 
                (item.href !== '/' && location.pathname.startsWith(item.href));
              const Icon = isActive ? item.iconActive : item.icon;
              
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={clsx(
                    'group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                  )}
                >
                  <Icon className="mr-3 w-5 h-5 flex-shrink-0" />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>
      
      {/* Mobile Navigation (Bottom Bar) */}
      <div className="lg:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <nav className="flex justify-around">
          {navigationItems.slice(0, 5).map((item) => { // Limit to 5 items for mobile
            const isActive = location.pathname === item.href || 
              (item.href !== '/' && location.pathname.startsWith(item.href));
            const Icon = isActive ? item.iconActive : item.icon;
            
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={clsx(
                  'flex flex-col items-center py-2 px-3 text-xs font-medium transition-colors',
                  'min-w-0 flex-1 touch-manipulation',
                  isActive
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                )}
              >
                <Icon className="w-6 h-6 mb-1" />
                <span className="truncate">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </>
  );
};