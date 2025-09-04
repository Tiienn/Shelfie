import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { Button } from '../common/Button';
import { 
  DevicePhoneMobileIcon,
  CloudIcon,
  ClockIcon,
  CurrencyDollarIcon,
  PlayIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface HeroSectionProps {
  /** Optional CSS class for additional styling */
  className?: string;
  /** Callback for primary CTA button click */
  onGetStarted?: () => void;
  /** Callback for secondary CTA button click */
  onWatchDemo?: () => void;
}

/**
 * Hero section component for the Shelfie landing page.
 * Features a compelling headline, trust indicators, and dual CTAs
 * targeting busy parents who want to save time and reduce food waste.
 */
export const HeroSection: React.FC<HeroSectionProps> = ({
  className,
  onGetStarted,
  onWatchDemo,
}) => {
  // Animation variants for staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
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

  const floatingVariants = {
    float: {
      y: [-10, 10, -10],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const trustIndicators = [
    {
      icon: DevicePhoneMobileIcon,
      label: "PWA Installable",
      description: "Install on any device"
    },
    {
      icon: CloudIcon,
      label: "Offline-First",
      description: "Works without internet"
    },
    {
      icon: CheckCircleIcon,
      label: "Always Free",
      description: "No hidden costs"
    }
  ];

  const benefits = [
    {
      icon: ClockIcon,
      stat: "2+ hours",
      label: "saved per week"
    },
    {
      icon: CurrencyDollarIcon,
      stat: "30%",
      label: "less food waste"
    }
  ];

  return (
    <section
      className={clsx(
        // Base styles with gradient background
        "relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50",
        // Dark mode support
        "dark:from-gray-900 dark:via-emerald-900/20 dark:to-teal-900/20",
        className
      )}
      aria-labelledby="hero-heading"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 -right-32 h-80 w-80 rounded-full bg-primary-100/50 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-teal-100/50 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-screen items-center py-12 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
            {/* Content Section */}
            <motion.div
              className="flex flex-col justify-center space-y-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Badge */}
              <motion.div
                variants={itemVariants}
                className="flex justify-center lg:justify-start"
              >
                <div className="inline-flex items-center rounded-full bg-primary-100 px-4 py-2 text-sm font-medium text-primary-800 dark:bg-primary-900/50 dark:text-primary-200">
                  <span className="mr-2 h-2 w-2 rounded-full bg-primary-500"></span>
                  Now in Beta • Join 1000+ families
                </div>
              </motion.div>

              {/* Headline */}
              <motion.div variants={itemVariants} className="space-y-4">
                <h1 
                  id="hero-heading"
                  className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl dark:text-white"
                >
                  <span className="block">Your Smart</span>
                  <span className="block text-primary-600 dark:text-primary-400">
                    Pantry Manager
                  </span>
                </h1>
                
                <p className="text-xl text-gray-600 sm:text-2xl lg:max-w-lg dark:text-gray-300">
                  Stop throwing away food and save hours every week with AI-powered 
                  pantry management designed for busy families.
                </p>
              </motion.div>

              {/* Benefits */}
              <motion.div 
                variants={itemVariants}
                className="flex flex-wrap gap-6"
              >
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/50">
                        <benefit.icon className="h-5 w-5 text-primary-600 dark:text-primary-400" aria-hidden="true" />
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {benefit.stat}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {benefit.label}
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div 
                variants={itemVariants}
                className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0"
              >
                <Button
                  size="xl"
                  variant="primary"
                  onClick={onGetStarted}
                  className="w-full sm:w-auto shadow-lg hover:shadow-xl"
                  aria-describedby="get-started-description"
                >
                  Get Started Free
                </Button>
                <Button
                  size="xl"
                  variant="outline"
                  onClick={onWatchDemo}
                  leftIcon={<PlayIcon className="h-5 w-5" />}
                  className="w-full sm:w-auto"
                  aria-describedby="watch-demo-description"
                >
                  Watch Demo
                </Button>
              </motion.div>

              {/* Hidden descriptions for screen readers */}
              <div className="sr-only">
                <p id="get-started-description">
                  Sign up for free to start managing your pantry smartly
                </p>
                <p id="watch-demo-description">
                  View a demonstration video of Shelfie's features
                </p>
              </div>

              {/* Trust Indicators */}
              <motion.div 
                variants={itemVariants}
                className="pt-6 border-t border-gray-200 dark:border-gray-700"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {trustIndicators.map((indicator, index) => (
                    <div 
                      key={index} 
                      className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-300"
                    >
                      <indicator.icon 
                        className="h-5 w-5 text-primary-600 dark:text-primary-400 flex-shrink-0" 
                        aria-hidden="true" 
                      />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {indicator.label}
                        </div>
                        <div className="text-xs">
                          {indicator.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Visual Section */}
            <motion.div
              className="flex items-center justify-center lg:justify-end"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="relative">
                {/* Floating animation wrapper */}
                <motion.div
                  variants={floatingVariants}
                  animate="float"
                  className="relative z-10"
                >
                  {/* Hero illustration placeholder */}
                  <div 
                    className="relative h-80 w-80 sm:h-96 sm:w-96 lg:h-[500px] lg:w-[500px] rounded-2xl bg-gradient-to-br from-primary-100 to-teal-100 shadow-2xl overflow-hidden"
                    role="img"
                    aria-label="Shelfie app interface mockup showing pantry management features"
                  >
                    {/* Mock app interface */}
                    <div className="absolute inset-4 rounded-xl bg-white shadow-lg overflow-hidden">
                      {/* Mock header */}
                      <div className="h-12 bg-primary-600 flex items-center justify-center">
                        <div className="text-white font-semibold">Shelfie</div>
                      </div>
                      
                      {/* Mock content */}
                      <div className="p-4 space-y-3">
                        {/* Mock pantry items */}
                        {[1, 2, 3, 4].map((item) => (
                          <div key={item} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="h-8 w-8 rounded-full bg-primary-200"></div>
                            <div className="flex-1 space-y-1">
                              <div className="h-3 bg-gray-300 rounded w-20"></div>
                              <div className="h-2 bg-gray-200 rounded w-16"></div>
                            </div>
                            <div className="h-6 w-12 bg-emerald-200 rounded"></div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Mock bottom navigation */}
                      <div className="absolute bottom-0 inset-x-0 h-12 bg-gray-100 flex items-center justify-around">
                        {[1, 2, 3, 4].map((nav) => (
                          <div key={nav} className="h-6 w-6 rounded bg-gray-300"></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-primary-200/50 dark:bg-primary-800/50" aria-hidden="true" />
                <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-teal-200/50 dark:bg-teal-800/50" aria-hidden="true" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        aria-hidden="true"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="h-6 w-1 bg-primary-600 rounded-full dark:bg-primary-400"
        />
      </motion.div>
    </section>
  );
};