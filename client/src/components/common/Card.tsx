import React from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onClick?: () => void;
  shadow?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  padding = 'md',
  interactive = false,
  onClick,
  shadow = 'sm',
}) => {
  const Component = onClick ? 'button' : 'div';

  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-soft',
    md: 'shadow-medium',
    lg: 'shadow-large',
  };

  return (
    <Component
      className={clsx(
        'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl',
        paddingClasses[padding],
        shadowClasses[shadow],
        interactive && 'cursor-pointer transition-all duration-200 hover:shadow-medium hover:-translate-y-0.5 active:translate-y-0',
        onClick && 'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        className
      )}
      onClick={onClick}
    >
      {children}
    </Component>
  );
};