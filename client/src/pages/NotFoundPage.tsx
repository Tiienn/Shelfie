import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="text-center max-w-md mx-auto">
        <div className="text-6xl font-bold text-primary-600 dark:text-primary-400 mb-4">
          404
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Page Not Found
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/">
            <Button variant="primary" leftIcon={<HomeIcon className="w-4 h-4" />}>
              Go Home
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            onClick={() => window.history.back()}
            leftIcon={<ArrowLeftIcon className="w-4 h-4" />}
          >
            Go Back
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default NotFoundPage;