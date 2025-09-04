import React from 'react';
import { XMarkIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { Button } from './Button';
import { Card } from './Card';

interface InstallPromptProps {
  onInstall: () => void;
  onDismiss: () => void;
}

export const InstallPrompt: React.FC<InstallPromptProps> = ({
  onInstall,
  onDismiss,
}) => {
  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-slide-up">
      <Card className="relative" padding="md" shadow="lg">
        <button
          onClick={onDismiss}
          className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
          aria-label="Dismiss install prompt"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
        
        <div className="pr-8">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                <ArrowDownTrayIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Install Shelfie App
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Add Shelfie to your home screen for quick access and better performance.
              </p>
              
              <div className="flex space-x-3 mt-3">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onInstall}
                  leftIcon={<ArrowDownTrayIcon className="w-4 h-4" />}
                >
                  Install
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDismiss}
                >
                  Later
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};