import React from 'react';
import { clsx } from 'clsx';
import { WifiIcon, SignalSlashIcon } from '@heroicons/react/24/outline';

interface OfflineIndicatorProps {
  isOnline: boolean;
  className?: string;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  isOnline,
  className,
}) => {
  if (isOnline) {
    return null;
  }

  return (
    <div
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 bg-warning-500 text-white px-4 py-2 text-sm font-medium',
        'flex items-center justify-center space-x-2 shadow-lg',
        'animate-slide-in-left',
        className
      )}
      role="alert"
      aria-live="polite"
    >
      <SignalSlashIcon className="w-4 h-4" />
      <span>You're offline. Changes will sync when reconnected.</span>
    </div>
  );
};