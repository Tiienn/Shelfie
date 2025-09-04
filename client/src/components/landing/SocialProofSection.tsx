import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { 
  StarIcon,
  UserGroupIcon,
  ChartBarIcon,
  TrophyIcon,
  ChatBubbleLeftRightIcon as QuoteIcon
} from '@heroicons/react/24/solid';
import { 
  HeartIcon,
  ClockIcon,
  CurrencyDollarIcon 
} from '@heroicons/react/24/outline';

interface SocialProofSectionProps {
  /** Optional CSS class for additional styling */
  className?: string;
}

interface TestimonialData {
  id: string;
  name: string;
  role: string;
  location: string;
  avatar: string;
  rating: number;
  quote: string;
  highlight: string;
  timeUsed: string;
}

interface StatisticData {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
  description: string;
  trend?: string;
}

/**
 * Social Proof/Testimonials section component for the Shelfie landing page.
 * Features user testimonials, usage statistics, and credibility indicators
 * to build trust with potential users through social validation.
 */
export const SocialProofSection: React.FC<SocialProofSectionProps> = ({
  className,
}) => {
  // Animation variants for staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.645, 0.045, 0.355, 1],
      },
    },
  };

  // Usage statistics data
  const statistics: StatisticData[] = [
    {
      id: 'families',
      icon: UserGroupIcon,
      value: '1,000+',
      label: 'Families Trust Shelfie',
      description: 'Active beta users',
      trend: '+150% this month'
    },
    {
      id: 'items',
      icon: ChartBarIcon,
      value: '50,000+',
      label: 'Items Tracked',
      description: 'Food items managed',
      trend: 'Growing daily'
    },
    {
      id: 'waste-reduction',
      icon: TrophyIcon,
      value: '30%',
      label: 'Average Food Waste Reduction',
      description: 'Proven results',
      trend: 'Typical in first month'
    }
  ];

  // User testimonials data
  const testimonials: TestimonialData[] = [
    {
      id: 'sarah-m',
      name: 'Sarah Martinez',
      role: 'Working Mom of 3',
      location: 'Austin, TX',
      avatar: 'SM',
      rating: 5,
      quote: 'Shelfie has completely transformed how I manage our family groceries. I save 2+ hours every week on meal planning and we\'ve cut our food waste by almost half!',
      highlight: 'Saves 2+ hours weekly',
      timeUsed: '3 months'
    },
    {
      id: 'david-k',
      name: 'David Kim',
      role: 'Father & Budget-Conscious',
      location: 'Seattle, WA', 
      avatar: 'DK',
      rating: 5,
      quote: 'The receipt scanning feature is incredible. It automatically tracks everything and alerts us before food expires. We\'ve saved over $200 in the first month alone.',
      highlight: 'Saved $200+ monthly',
      timeUsed: '2 months'
    },
    {
      id: 'jennifer-w',
      name: 'Jennifer Wilson',
      role: 'Busy Parent & Teacher',
      location: 'Denver, CO',
      avatar: 'JW',
      rating: 5,
      quote: 'Even when I\'m offline at school, Shelfie works perfectly. The whole family can update our pantry inventory, and everything syncs when I get home. It\'s a game-changer!',
      highlight: 'Works offline perfectly',
      timeUsed: '4 months'
    },
    {
      id: 'michael-r',
      name: 'Michael Rodriguez',
      role: 'Single Dad of 2',
      location: 'Phoenix, AZ',
      avatar: 'MR',
      rating: 5,
      quote: 'The AI recipe suggestions using ingredients I already have are brilliant. My kids love trying new meals, and I love not wasting food or money.',
      highlight: 'Kids love new recipes',
      timeUsed: '1 month'
    }
  ];

  // Star rating component
  const StarRating: React.FC<{ rating: number; size?: 'sm' | 'md' }> = ({ 
    rating, 
    size = 'sm' 
  }) => {
    const starSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
    
    return (
      <div className="flex items-center space-x-1" aria-label={`${rating} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            className={clsx(
              starSize,
              star <= rating 
                ? 'text-yellow-400' 
                : 'text-gray-200 dark:text-gray-600'
            )}
            aria-hidden="true"
          />
        ))}
      </div>
    );
  };

  // Avatar component
  const Avatar: React.FC<{ initials: string; className?: string }> = ({ 
    initials, 
    className 
  }) => (
    <div 
      className={clsx(
        'flex items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-teal-600 text-white font-semibold',
        className
      )}
      aria-hidden="true"
    >
      {initials}
    </div>
  );

  return (
    <section
      className={clsx(
        // Base styles
        "relative py-16 bg-white sm:py-20 lg:py-24",
        // Dark mode
        "dark:bg-gray-900",
        className
      )}
      aria-labelledby="social-proof-heading"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="h-64 w-64 rounded-full bg-primary-100/30 blur-3xl dark:bg-primary-900/20" />
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Section header */}
          <motion.div 
            variants={itemVariants}
            className="text-center mb-16"
          >
            {/* Beta badge */}
            <div className="inline-flex items-center mb-6">
              <div className="inline-flex items-center rounded-full bg-primary-100 px-4 py-2 text-sm font-medium text-primary-800 dark:bg-primary-900/50 dark:text-primary-200">
                <TrophyIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                Beta Success Stories
              </div>
            </div>

            <h2 
              id="social-proof-heading"
              className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl dark:text-white mb-4"
            >
              Trusted by{' '}
              <span className="text-primary-600 dark:text-primary-400">
                Busy Families
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Join thousands of families already saving time, money, and reducing food waste 
              with Shelfie's smart pantry management.
            </p>
          </motion.div>

          {/* Statistics section */}
          <motion.div 
            variants={itemVariants}
            className="mb-20"
          >
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              {statistics.map((stat, index) => (
                <motion.div
                  key={stat.id}
                  variants={itemVariants}
                  className="relative"
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center mb-4">
                      <div className="flex-shrink-0">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/50">
                          <stat.icon 
                            className="h-6 w-6 text-primary-600 dark:text-primary-400" 
                            aria-hidden="true" 
                          />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">
                          {stat.value}
                        </div>
                        {stat.trend && (
                          <div className="text-xs text-primary-600 dark:text-primary-400 font-medium">
                            {stat.trend}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {stat.label}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {stat.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Testimonials grid */}
          <motion.div variants={itemVariants}>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  variants={itemVariants}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                  className="relative"
                >
                  <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                    {/* Quote icon */}
                    <div className="absolute -top-2 -left-2">
                      <div className="h-8 w-8 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center">
                        <QuoteIcon 
                          className="h-4 w-4 text-primary-600 dark:text-primary-400" 
                          aria-hidden="true" 
                        />
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="mb-4">
                      <StarRating rating={testimonial.rating} />
                    </div>

                    {/* Quote */}
                    <blockquote className="mb-6">
                      <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                        "{testimonial.quote}"
                      </p>
                    </blockquote>

                    {/* Highlight badge */}
                    <div className="mb-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200">
                        <HeartIcon className="h-3 w-3 mr-1" aria-hidden="true" />
                        {testimonial.highlight}
                      </span>
                    </div>

                    {/* Author info */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar 
                          initials={testimonial.avatar} 
                          className="h-10 w-10 text-sm"
                        />
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white text-sm">
                            {testimonial.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {testimonial.role} • {testimonial.location}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                          <ClockIcon className="h-3 w-3 mr-1" aria-hidden="true" />
                          Using for {testimonial.timeUsed}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Bottom CTA section */}
          <motion.div 
            variants={itemVariants}
            className="mt-16 text-center"
          >
            <div className="bg-gradient-to-r from-primary-50 to-teal-50 dark:from-primary-900/20 dark:to-teal-900/20 rounded-2xl p-8">
              <div className="flex justify-center mb-6">
                <StarRating rating={5} size="md" />
                <span className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
                  4.9/5 average rating
                </span>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Ready to Transform Your Pantry?
              </h3>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                Join the growing community of families who are saving time, reducing waste, 
                and enjoying stress-free meal planning with Shelfie.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <span className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200 text-sm font-medium">
                  <CurrencyDollarIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                  Always Free
                </span>
                <span className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-200 text-sm font-medium">
                  <UserGroupIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                  Beta Access Available
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};