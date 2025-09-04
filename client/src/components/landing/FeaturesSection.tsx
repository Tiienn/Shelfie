import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { Card } from '../common/Card';
import {
  CameraIcon,
  SparklesIcon,
  CloudIcon,
  BellIcon,
  UsersIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

interface FeaturesSectionProps {
  /** Optional CSS class for additional styling */
  className?: string;
}

interface Feature {
  /** Feature identifier */
  id: string;
  /** Feature icon component */
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  /** Feature title */
  title: string;
  /** Feature description highlighting benefits */
  description: string;
  /** Key benefit/value proposition */
  benefit: string;
  /** Category color theme */
  color: 'emerald' | 'blue' | 'purple' | 'amber' | 'rose' | 'cyan';
}

/**
 * Features showcase section for the Shelfie landing page.
 * Displays 6 core features in a responsive grid layout,
 * highlighting time and money savings for busy families.
 */
export const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  className,
}) => {
  const features: Feature[] = [
    {
      id: 'receipt-scanning',
      icon: CameraIcon,
      title: 'Receipt Scanning',
      description: 'Simply snap a photo of your receipt and watch as our advanced OCR technology instantly extracts all items, prices, and quantities.',
      benefit: 'Add groceries in seconds',
      color: 'emerald',
    },
    {
      id: 'ai-recipes',
      icon: SparklesIcon,
      title: 'AI Recipe Suggestions',
      description: 'Get personalized recipe recommendations based on your available ingredients, dietary preferences, and family size.',
      benefit: 'Never wonder "what\'s for dinner?" again',
      color: 'purple',
    },
    {
      id: 'offline-first',
      icon: CloudIcon,
      title: 'Offline-First Design',
      description: 'Manage your pantry anywhere, anytime. All features work without internet and sync seamlessly when you\'re connected.',
      benefit: 'Works in the basement or on vacation',
      color: 'blue',
    },
    {
      id: 'smart-notifications',
      icon: BellIcon,
      title: 'Smart Notifications',
      description: 'Receive intelligent alerts for expiring items, low stock levels, and restocking reminders tailored to your shopping habits.',
      benefit: 'Reduce food waste by 30%',
      color: 'amber',
    },
    {
      id: 'family-sharing',
      icon: UsersIcon,
      title: 'Family Sharing',
      description: 'Multiple family members can access and update the same pantry in real-time. Perfect for coordinating grocery runs.',
      benefit: 'Everyone stays in sync',
      color: 'rose',
    },
    {
      id: 'analytics-dashboard',
      icon: ChartBarIcon,
      title: 'Analytics Dashboard',
      description: 'Track your savings, monitor food waste reduction, and see detailed insights into your family\'s consumption patterns.',
      benefit: 'Save $200+ monthly on groceries',
      color: 'cyan',
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 40,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.645, 0.045, 0.355, 1],
      },
    },
  };

  const hoverVariants = {
    hover: {
      y: -8,
      transition: {
        duration: 0.3,
        ease: [0.645, 0.045, 0.355, 1],
      },
    },
  };

  // Color mappings for each feature theme
  const colorClasses = {
    emerald: {
      icon: 'text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/50',
      benefit: 'text-emerald-700 dark:text-emerald-300',
    },
    blue: {
      icon: 'text-blue-600 dark:text-blue-400',
      iconBg: 'bg-blue-100 dark:bg-blue-900/50',
      benefit: 'text-blue-700 dark:text-blue-300',
    },
    purple: {
      icon: 'text-purple-600 dark:text-purple-400',
      iconBg: 'bg-purple-100 dark:bg-purple-900/50',
      benefit: 'text-purple-700 dark:text-purple-300',
    },
    amber: {
      icon: 'text-amber-600 dark:text-amber-400',
      iconBg: 'bg-amber-100 dark:bg-amber-900/50',
      benefit: 'text-amber-700 dark:text-amber-300',
    },
    rose: {
      icon: 'text-rose-600 dark:text-rose-400',
      iconBg: 'bg-rose-100 dark:bg-rose-900/50',
      benefit: 'text-rose-700 dark:text-rose-300',
    },
    cyan: {
      icon: 'text-cyan-600 dark:text-cyan-400',
      iconBg: 'bg-cyan-100 dark:bg-cyan-900/50',
      benefit: 'text-cyan-700 dark:text-cyan-300',
    },
  };

  return (
    <section
      id="features"
      className={clsx(
        'relative py-16 sm:py-20 lg:py-24',
        'bg-white dark:bg-gray-900',
        className
      )}
      aria-labelledby="features-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          className="text-center mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.645, 0.045, 0.355, 1] }}
        >
          <h2
            id="features-heading"
            className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl dark:text-white"
          >
            Everything you need to{' '}
            <span className="text-primary-600 dark:text-primary-400">
              manage your pantry
            </span>
          </h2>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Powerful features designed to save you time and money while reducing food waste.
            Perfect for busy families who want to stay organized without the hassle.
          </p>
        </motion.div>

        {/* Features grid */}
        <motion.div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {features.map((feature, index) => {
            const colors = colorClasses[feature.color];
            const IconComponent = feature.icon;

            return (
              <motion.div
                key={feature.id}
                variants={cardVariants}
                whileHover="hover"
                custom={index}
              >
                <Card
                  className="h-full group cursor-default"
                  padding="lg"
                  shadow="md"
                >
                  <motion.div
                    className="flex flex-col h-full"
                    variants={hoverVariants}
                  >
                    {/* Icon */}
                    <div className="flex-shrink-0 mb-4">
                      <div
                        className={clsx(
                          'inline-flex items-center justify-center',
                          'h-12 w-12 rounded-xl',
                          colors.iconBg,
                          'group-hover:scale-110 transition-transform duration-300'
                        )}
                      >
                        <IconComponent
                          className={clsx('h-6 w-6', colors.icon)}
                          aria-hidden="true"
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {feature.title}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-4 flex-1 leading-relaxed">
                        {feature.description}
                      </p>
                      
                      {/* Benefit highlight */}
                      <div
                        className={clsx(
                          'inline-flex items-center px-3 py-1.5 rounded-full',
                          'text-sm font-medium',
                          'bg-gray-50 dark:bg-gray-800/50',
                          colors.benefit
                        )}
                      >
                        <span className="mr-2 h-1.5 w-1.5 rounded-full bg-current opacity-75" />
                        {feature.benefit}
                      </div>
                    </div>
                  </motion.div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA section */}
        <motion.div
          className="mt-12 lg:mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="inline-flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <span>Join thousands of families already saving time and money</span>
            <span className="h-1 w-1 rounded-full bg-primary-500" />
            <span className="font-medium text-primary-600 dark:text-primary-400">
              Free forever
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};