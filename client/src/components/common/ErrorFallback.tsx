import React from 'react';
import { Button } from './Button';
import { Card } from './Card';
import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center">
        <div className="mx-auto w-16 h-16 bg-error-100 dark:bg-error-900 rounded-full flex items-center justify-center mb-4">
          <ExclamationTriangleIcon className="w-8 h-8 text-error-600 dark:text-error-400" />
        </div>
        
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Oops! Something went wrong
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          We encountered an unexpected error. Don't worry, we're working to fix it.
        </p>
        
        {process.env.NODE_ENV === 'development' && (
          <details className="text-left mb-6">
            <summary className="text-sm text-gray-500 cursor-pointer mb-2">
              Error Details (Development)
            </summary>
            <pre className="text-xs text-error-600 bg-error-50 dark:bg-error-900/20 p-3 rounded overflow-auto">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="primary"
            onClick={resetErrorBoundary}
            leftIcon={<ArrowPathIcon className="w-4 h-4" />}
            fullWidth
          >
            Try Again
          </Button>
          
          <Button
            variant="outline"
            onClick={() => window.location.href = '/'}
            fullWidth
          >
            Go Home
          </Button>
        </div>
      </Card>
    </div>
  );
};