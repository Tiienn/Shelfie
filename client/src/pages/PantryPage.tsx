import React from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const PantryPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Pantry
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your inventory and track expiration dates
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<PlusIcon className="w-4 h-4" />}
        >
          Add Item
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search items..."
              className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>
        <select className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white">
          <option>All Categories</option>
          <option>Produce</option>
          <option>Dairy</option>
          <option>Grains</option>
          <option>Proteins</option>
        </select>
      </div>

      {/* Empty State */}
      <Card className="text-center py-12">
        <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
          <PlusIcon className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Your pantry is empty
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Get started by adding your first item or scanning a receipt
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="primary">
            Add Item Manually
          </Button>
          <Button variant="outline">
            Scan Receipt
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PantryPage;