import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { 
  PlusIcon,
  ShareIcon,
  CheckIcon,
  ListBulletIcon
} from '@heroicons/react/24/outline';

const GroceryPage: React.FC = () => {
  const [activeList, setActiveList] = useState('main');
  
  const groceryLists = [
    {
      id: 'main',
      name: 'Weekly Groceries',
      itemCount: 12,
      completedCount: 3,
      shared: false,
    },
    {
      id: 'costco',
      name: 'Costco Run',
      itemCount: 8,
      completedCount: 0,
      shared: true,
    },
  ];

  const sampleItems = [
    { id: 1, name: 'Milk (2%)', category: 'Dairy', completed: false, urgent: true },
    { id: 2, name: 'Bread (Whole Wheat)', category: 'Grains', completed: true, urgent: false },
    { id: 3, name: 'Bananas', category: 'Produce', completed: false, urgent: false },
    { id: 4, name: 'Chicken Breast', category: 'Proteins', completed: true, urgent: false },
    { id: 5, name: 'Greek Yogurt', category: 'Dairy', completed: false, urgent: true },
    { id: 6, name: 'Spinach', category: 'Produce', completed: true, urgent: false },
  ];

  const currentList = groceryLists.find(list => list.id === activeList);
  const progress = currentList ? (currentList.completedCount / currentList.itemCount) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Grocery Lists
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Organize your shopping and share with family
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            leftIcon={<ShareIcon className="w-4 h-4" />}
          >
            Share
          </Button>
          <Button
            variant="primary"
            leftIcon={<PlusIcon className="w-4 h-4" />}
          >
            New List
          </Button>
        </div>
      </div>

      {/* List Selector */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {groceryLists.map((list) => (
          <Card
            key={list.id}
            interactive
            onClick={() => setActiveList(list.id)}
            className={`flex-shrink-0 min-w-[200px] ${
              activeList === list.id ? 'ring-2 ring-primary-500' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {list.name}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {list.completedCount}/{list.itemCount} items
                  {list.shared && ' • Shared'}
                </div>
              </div>
              <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                <ListBulletIcon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Progress Bar */}
      <Card>
        <div className="flex items-center justify-between mb-2">
          <div className="font-medium text-gray-900 dark:text-white">
            Progress
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {currentList?.completedCount}/{currentList?.itemCount} completed
          </div>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </Card>

      {/* Add Item */}
      <Card>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Add an item..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
          <Button variant="primary">
            Add
          </Button>
        </div>
      </Card>

      {/* Items List */}
      <Card>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Shopping List
        </h3>
        
        <div className="space-y-2">
          {sampleItems.map((item) => (
            <div
              key={item.id}
              className={`flex items-center space-x-3 p-3 rounded-lg border ${
                item.completed 
                  ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700' 
                  : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700'
              }`}
            >
              <button
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  item.completed
                    ? 'bg-success-500 border-success-500'
                    : 'border-gray-300 dark:border-gray-600 hover:border-primary-500'
                }`}
              >
                {item.completed && <CheckIcon className="w-3 h-3 text-white" />}
              </button>
              
              <div className="flex-1">
                <div className={`font-medium ${
                  item.completed 
                    ? 'text-gray-500 dark:text-gray-400 line-through' 
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {item.name}
                  {item.urgent && (
                    <span className="ml-2 text-xs bg-error-100 text-error-700 px-2 py-0.5 rounded-full">
                      Urgent
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {item.category}
                </div>
              </div>
              
              <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" size="sm" fullWidth>
            Add from Pantry
          </Button>
          <Button variant="outline" size="sm" fullWidth>
            Add from Recipe
          </Button>
          <Button variant="outline" size="sm" fullWidth>
            Suggest Items
          </Button>
          <Button variant="outline" size="sm" fullWidth>
            Clear Completed
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default GroceryPage;