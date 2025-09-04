import React from 'react';
import { clsx } from 'clsx';
import { Button } from '../common/Button';
import { CheckCircleIcon, DevicePhoneMobileIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

interface CTASectionProps {
  /** Optional custom CSS classes */
  className?: string;
  /** Callback for primary CTA button click */
  onGetStarted?: () => void;
  /** Callback for PWA installation */
  onInstallApp?: () => void;
  /** Callback for contact/support link */
  onContactSupport?: () => void;
}

/**
 * Final call-to-action section for the landing page
 * Encourages users to get started with Shelfie while emphasizing
 * free access, privacy, and beta program benefits
 */
export const CTASection: React.FC<CTASectionProps> = ({
  className,
  onGetStarted,
  onInstallApp,
  onContactSupport,
}) => {
  const trustElements = [
    {
      icon: CheckCircleIcon,
      text: 'Always Free - No Credit Card Required'
    },
    {
      icon: ShieldCheckIcon,
      text: 'Privacy-Focused - Your Data Stays Secure'
    },
    {
      icon: DevicePhoneMobileIcon,
      text: 'Works Offline - Install Like a Native App'
    }
  ];

  return (
    <section
      className={clsx(
        // Base styles with gradient background
        'relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-emerald-50',
        'py-16 px-4',
        'sm:py-20 sm:px-6',
        'lg:py-24 lg:px-8',
        className
      )}
      aria-labelledby="cta-heading"
    >
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-4xl text-center">
        {/* Beta Badge */}
        <div className="mb-6 inline-flex items-center rounded-full bg-primary-100 px-4 py-2 text-sm font-medium text-primary-700">
          <span className="mr-2 h-2 w-2 rounded-full bg-primary-500" aria-hidden="true" />
          Join Our Beta Program - Early Access Available
        </div>

        {/* Main Headline */}
        <h2
          id="cta-heading"
          className={clsx(
            'text-3xl font-bold tracking-tight text-gray-900',
            'sm:text-4xl',
            'lg:text-5xl'
          )}
        >
          Ready to Transform Your
          <span className="block text-primary-600">Pantry Management?</span>
        </h2>

        {/* Value Proposition */}
        <p className={clsx(
          'mx-auto mt-6 max-w-2xl text-lg text-gray-600',
          'sm:text-xl'
        )}>
          Join thousands of busy parents saving 2+ hours per week and reducing food waste by 30%. 
          Start organizing smarter, not harder.
        </p>

        {/* Pricing Emphasis */}
        <div className="mt-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-100 p-6 shadow-soft">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600">Always Free</div>
            <div className="text-sm text-gray-500 mt-1">No Credit Card • No Premium Tiers • No Ads</div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className={clsx(
          'mt-10 flex flex-col items-center justify-center gap-4',
          'sm:flex-row sm:gap-6'
        )}>
          <Button
            variant="primary"
            size="xl"
            onClick={onGetStarted}
            className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-shadow duration-200"
            aria-describedby="primary-cta-description"
          >
            Start Organizing Your Pantry
          </Button>

          <Button
            variant="outline"
            size="xl"
            onClick={onInstallApp}
            className="w-full sm:w-auto group"
            leftIcon={<DevicePhoneMobileIcon className="w-5 h-5" />}
          >
            <span className="group-hover:text-primary-600 transition-colors">
              Install App
            </span>
          </Button>
        </div>

        {/* Screen reader description for primary CTA */}
        <div id="primary-cta-description" className="sr-only">
          Get started with Shelfie's free pantry management app - no registration required
        </div>

        {/* Trust Elements */}
        <div className="mt-12">
          <div className={clsx(
            'mx-auto grid max-w-3xl gap-6',
            'sm:grid-cols-3 sm:gap-8'
          )}>
            {trustElements.map((element, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                  <element.icon 
                    className="h-6 w-6 text-primary-600" 
                    aria-hidden="true"
                  />
                </div>
                <p className="mt-3 text-sm font-medium text-gray-700">
                  {element.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Support Contact */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Have questions about getting started?{' '}
            <button
              onClick={onContactSupport}
              className={clsx(
                'font-medium text-primary-600 hover:text-primary-500',
                'underline underline-offset-2',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded'
              )}
            >
              Contact our support team
            </button>
            {' '}– we're here to help!
          </p>
        </div>

        {/* Final Trust Statement */}
        <div className="mt-6">
          <p className="text-xs text-gray-400">
            Privacy-first • No data tracking • Works offline • GDPR compliant
          </p>
        </div>
      </div>
    </section>
  );
};