import React from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helper,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className,
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const inputClasses = clsx(
    'block w-full px-3 py-2.5 text-sm bg-white border rounded-lg transition-colors duration-200',
    'placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0',
    'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
    'dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500',
    {
      'border-gray-300 focus:ring-primary-500 focus:border-primary-500': !error,
      'border-error-300 focus:ring-error-500 focus:border-error-500': error,
      'pl-10': leftIcon,
      'pr-10': rightIcon,
    },
    className
  );

  return (
    <div className={clsx('space-y-1', fullWidth && 'w-full')}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <div className="text-gray-400 dark:text-gray-500">
              {leftIcon}
            </div>
          </div>
        )}
        
        <input
          id={inputId}
          className={inputClasses}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <div className="text-gray-400 dark:text-gray-500">
              {rightIcon}
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-error-600 dark:text-error-400" role="alert">
          {error}
        </p>
      )}
      
      {helper && !error && (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {helper}
        </p>
      )}
    </div>
  );
};