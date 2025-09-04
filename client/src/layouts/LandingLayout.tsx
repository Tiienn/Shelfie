import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '../components/common/Button';
import { InstallPrompt } from '../components/common/InstallPrompt';

interface LandingLayoutProps {
  /** Child components (page content) */
  children: React.ReactNode;
  /** Whether to show a sticky header */
  stickyHeader?: boolean;
  /** Custom header content */
  headerContent?: React.ReactNode;
  /** Whether to show the install prompt */
  showInstallPrompt?: boolean;
}

export const LandingLayout: React.FC<LandingLayoutProps> = ({
  children,
  stickyHeader = false,
  headerContent,
  showInstallPrompt = true,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showInstall, setShowInstall] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const location = useLocation();

  // Handle PWA install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (showInstallPrompt) {
        setShowInstall(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, [showInstallPrompt]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      }
      
      setDeferredPrompt(null);
      setShowInstall(false);
    } catch (error) {
      console.error('Error installing PWA:', error);
    }
  };

  const handleSkipToContent = () => {
    const main = document.getElementById('main-content');
    main?.focus();
  };

  const navigationLinks = [
    { name: 'Features', href: '/#features' },
    { name: 'How it Works', href: '/#how-it-works' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'About', href: '/about' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        onClick={handleSkipToContent}
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-primary-600 text-white px-4 py-2 rounded-lg z-100"
      >
        Skip to content
      </a>

      {/* Header */}
      <header
        className={clsx(
          'relative z-50 bg-white/95 dark:bg-gray-900/95 border-b border-gray-100 dark:border-gray-800',
          stickyHeader && 'sticky top-0',
          'backdrop-blur-sm'
        )}
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-2">
              <Link
                to="/"
                className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg p-1"
                aria-label="Shelfie - Home"
              >
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-soft">
                  <span className="text-white font-bold text-lg lg:text-xl">S</span>
                </div>
                <span className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                  Shelfie
                </span>
              </Link>
              {headerContent && (
                <div className="ml-4 hidden sm:block">
                  {headerContent}
                </div>
              )}
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8" role="navigation" aria-label="Primary navigation">
              {navigationLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded px-2 py-1"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="hidden sm:inline-flex text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded px-3 py-2"
              >
                Log In
              </Link>
              <Link to="/register">
                <Button
                  variant="primary"
                  size="sm"
                  className="hidden sm:inline-flex"
                >
                  Sign Up
                </Button>
              </Link>

              {/* Mobile menu button */}
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden tap-target p-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg"
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
                aria-label="Toggle navigation menu"
              >
                {isMenuOpen ? (
                  <XMarkIcon className="w-6 h-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="w-6 h-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div
              id="mobile-menu"
              className="md:hidden py-4 border-t border-gray-100 dark:border-gray-800 animate-fade-in"
            >
              <div className="flex flex-col space-y-4">
                {navigationLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-base font-medium text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded px-3 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}
                
                {/* Mobile Auth Buttons */}
                <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-col space-y-3">
                  <Link
                    to="/login"
                    className="text-base font-medium text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded px-3 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button
                      variant="primary"
                      size="md"
                      fullWidth
                    >
                      Sign Up
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main 
        id="main-content" 
        className="flex-1" 
        role="main"
        tabIndex={-1}
      >
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="col-span-1 md:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-soft">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  Shelfie
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Smart pantry management for busy families. Save time, reduce waste, and simplify grocery planning.
              </p>
              <p className="text-xs text-primary-600 dark:text-primary-400 font-medium">
                Made for busy families ❤️
              </p>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                Product
              </h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a 
                    href="/#features" 
                    className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a 
                    href="/#how-it-works" 
                    className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
                  >
                    How it Works
                  </a>
                </li>
                <li>
                  <a 
                    href="/pricing" 
                    className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a 
                    href="/download" 
                    className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
                  >
                    Download App
                  </a>
                </li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                Company
              </h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a 
                    href="/about" 
                    className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a 
                    href="/blog" 
                    className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a 
                    href="/contact" 
                    className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a 
                    href="/careers" 
                    className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
                  >
                    Careers
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal & Support Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                Support
              </h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a 
                    href="/help" 
                    className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a 
                    href="/privacy" 
                    className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a 
                    href="/terms" 
                    className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a 
                    href="mailto:support@shelfie.app" 
                    className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
                  >
                    Contact Support
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © 2025 Shelfie. All rights reserved.
            </p>
            
            {/* Social Media Links (Placeholder) */}
            <div className="flex items-center space-x-4">
              <a
                href="https://twitter.com/ShelfieApp"
                className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                aria-label="Follow us on Twitter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              
              <a
                href="https://facebook.com/ShelfieApp"
                className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                aria-label="Follow us on Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
                </svg>
              </a>

              <a
                href="https://instagram.com/ShelfieApp"
                className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                aria-label="Follow us on Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 0C7.284 0 6.944.012 5.877.06 2.246.227.227 2.246.06 5.877.012 6.944 0 7.284 0 10s.012 3.056.06 4.123C.227 17.754 2.246 19.773 5.877 19.94 6.944 19.988 7.284 20 10 20s3.056-.012 4.123-.06c3.631-.167 5.65-2.186 5.817-5.817C19.988 13.056 20 12.716 20 10s-.012-3.056-.06-4.123C19.773 2.246 17.754.227 14.123.06 13.056.012 12.716 0 10 0zm0 1.802c2.67 0 2.987.01 4.042.059 2.71.123 3.975 1.409 4.099 4.099.048 1.054.057 1.37.057 4.04 0 2.672-.01 2.988-.057 4.042-.124 2.687-1.387 3.975-4.1 4.099-1.054.048-1.37.058-4.041.058-2.67 0-2.987-.01-4.04-.058-2.717-.124-3.977-1.416-4.1-4.1-.048-1.054-.058-1.37-.058-4.041 0-2.67.01-2.986.058-4.04.124-2.69 1.387-3.977 4.1-4.1 1.054-.048 1.37-.058 4.04-.058zM10 4.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Install Prompt */}
      {showInstall && (
        <InstallPrompt
          onInstall={handleInstallClick}
          onDismiss={() => setShowInstall(false)}
        />
      )}
    </div>
  );
};

