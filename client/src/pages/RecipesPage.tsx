import React from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { 
  HeartIcon,
  ClockIcon,
  UserGroupIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

const RecipesPage: React.FC = () => {
  const sampleRecipes = [
    {
      id: 1,
      title: 'One-Pot Pasta Primavera',
      description: 'Fresh vegetables and pasta in a creamy sauce',
      prepTime: '15 min',
      servings: 4,
      matchPercentage: 95,
      image: '/api/placeholder/recipe1.jpg',
      isFavorite: true,
      availableIngredients: ['pasta', 'bell peppers', 'onion', 'garlic'],
      missingIngredients: ['cream', 'parmesan'],
    },
    {
      id: 2,
      title: 'Asian Stir-Fry Bowl',
      description: 'Quick and healthy vegetable stir-fry',
      prepTime: '20 min',
      servings: 2,
      matchPercentage: 87,
      image: '/api/placeholder/recipe2.jpg',
      isFavorite: false,
      availableIngredients: ['broccoli', 'carrots', 'soy sauce'],
      missingIngredients: ['rice', 'sesame oil'],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Recipe Suggestions
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover recipes based on your pantry items
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<SparklesIcon className="w-4 h-4" />}
        >
          Get Suggestions
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Button variant="ghost" size="sm" className="border">
          All Recipes
        </Button>
        <Button variant="ghost" size="sm">
          High Match (90%+)
        </Button>
        <Button variant="ghost" size="sm">
          Quick (Under 30min)
        </Button>
        <Button variant="ghost" size="sm">
          Vegetarian
        </Button>
        <Button variant="ghost" size="sm">
          Family Friendly
        </Button>
      </div>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleRecipes.map((recipe) => (
          <Card key={recipe.id} className="overflow-hidden p-0">
            {/* Recipe Image */}
            <div className="relative h-48 bg-gradient-to-br from-orange-400 to-pink-400">
              <div className="absolute top-3 right-3 flex space-x-2">
                <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                  <span className="text-xs font-medium text-gray-700">
                    {recipe.matchPercentage}% match
                  </span>
                </div>
                <button className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                  {recipe.isFavorite ? (
                    <HeartIconSolid className="w-4 h-4 text-error-500" />
                  ) : (
                    <HeartIcon className="w-4 h-4 text-gray-600" />
                  )}
                </button>
              </div>
            </div>
            
            {/* Recipe Content */}
            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {recipe.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {recipe.description}
                </p>
              </div>
              
              {/* Recipe Meta */}
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <ClockIcon className="w-4 h-4" />
                  <span>{recipe.prepTime}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <UserGroupIcon className="w-4 h-4" />
                  <span>{recipe.servings} servings</span>
                </div>
              </div>
              
              {/* Ingredients Status */}
              <div className="space-y-2">
                <div>
                  <div className="text-xs font-medium text-success-600 dark:text-success-400 mb-1">
                    You have: {recipe.availableIngredients.join(', ')}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Missing: {recipe.missingIngredients.join(', ')}
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex space-x-2 pt-2">
                <Button variant="primary" size="sm" className="flex-1">
                  View Recipe
                </Button>
                <Button variant="outline" size="sm">
                  Add Missing Items
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State (if no recipes) */}
      {sampleRecipes.length === 0 && (
        <Card className="text-center py-12">
          <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <SparklesIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No recipe suggestions yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Add some items to your pantry to get personalized recipe recommendations
          </p>
          <Button variant="primary">
            Add Pantry Items
          </Button>
        </Card>
      )}

      {/* Recipe Categories */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Browse by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Desserts', 'Vegetarian', 'Quick Meals', 'Family'].map((category) => (
            <Card key={category} interactive className="text-center p-4">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {category}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecipesPage;