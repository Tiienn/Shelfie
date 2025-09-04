import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// Layout and sections
import { LandingLayout } from '../layouts/LandingLayout';
import { HeroSection } from '../components/landing/HeroSection';
import { FeaturesSection } from '../components/landing/FeaturesSection';
import { SocialProofSection } from '../components/landing/SocialProofSection';
import { CTASection } from '../components/landing/CTASection';

// Modals and common components
import { Modal } from '../components/common/Modal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

interface LandingPageProps {
  /** Optional CSS class for additional styling */
  className?: string;
}

/**
 * Main landing page component that showcases Shelfie's value proposition
 * and guides potential users through the conversion funnel.
 * 
 * Features:
 * - Hero section with primary value proposition
 * - Features showcase highlighting key benefits
 * - Social proof and testimonials
 * - Final call-to-action section
 * - PWA installation functionality
 * - Demo video modal
 * - SEO optimized meta tags
 */
export const LandingPage: React.FC<LandingPageProps> = ({ className }) => {
  const navigate = useNavigate();
  
  // State management
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Handle PWA installation prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  // Smooth scroll to sections
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, []);

  // Navigation handlers
  const handleGetStarted = useCallback(() => {
    navigate('/register');
  }, [navigate]);

  const handleLogin = useCallback(() => {
    navigate('/login');
  }, [navigate]);

  // Demo modal handlers
  const handleWatchDemo = useCallback(() => {
    setShowDemoModal(true);
    
    // Analytics event (if implemented)
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'video_play', {
        video_title: 'Shelfie Demo',
        engagement_time_msec: 0
      });
    }
  }, []);

  const handleCloseDemoModal = useCallback(() => {
    setShowDemoModal(false);
  }, []);

  // PWA installation handler
  const handleInstallApp = useCallback(async () => {
    if (!deferredPrompt) {
      // If no install prompt available, show fallback instructions
      alert('To install Shelfie:\n\n1. Open the browser menu\n2. Select "Install App" or "Add to Home Screen"\n3. Follow the prompts');
      return;
    }

    setIsInstalling(true);

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('PWA installation accepted');
        
        // Analytics event
        if (typeof window !== 'undefined' && 'gtag' in window) {
          (window as any).gtag('event', 'pwa_install', {
            method: 'install_prompt'
          });
        }
      }
      
      setDeferredPrompt(null);
    } catch (error) {
      console.error('Error installing PWA:', error);
    } finally {
      setIsInstalling(false);
    }
  }, [deferredPrompt]);

  // Support contact handler
  const handleContactSupport = useCallback(() => {
    const email = 'support@shelfie.app';
    const subject = 'Question about Shelfie';
    const body = 'Hi Shelfie team,\n\nI have a question about getting started with Shelfie:\n\n';
    
    const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    
    // Analytics event
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'contact_support', {
        method: 'email'
      });
    }
  }, []);

  // Keyboard navigation for accessibility
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Close demo modal on Escape
      if (event.key === 'Escape' && showDemoModal) {
        handleCloseDemoModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showDemoModal, handleCloseDemoModal]);

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>Shelfie - Smart Pantry Management for Busy Families</title>
        <meta 
          name="description" 
          content="Save time and reduce food waste with Shelfie's AI-powered pantry management. Receipt scanning, smart notifications, and recipe suggestions. Always free for busy families." 
        />
        <meta 
          name="keywords" 
          content="pantry management, food waste reduction, grocery list, receipt scanning, meal planning, family organization, PWA" 
        />
        
        {/* Open Graph tags for social sharing */}
        <meta property="og:title" content="Shelfie - Smart Pantry Management for Busy Families" />
        <meta 
          property="og:description" 
          content="Save 2+ hours per week and reduce food waste by 30% with AI-powered pantry management. Join 1000+ families already using Shelfie." 
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://shelfie.app" />
        <meta property="og:image" content="https://shelfie.app/images/og-image.png" />
        <meta property="og:site_name" content="Shelfie" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@ShelfieApp" />
        <meta name="twitter:title" content="Shelfie - Smart Pantry Management for Busy Families" />
        <meta 
          name="twitter:description" 
          content="Save time and reduce food waste with AI-powered pantry management. Always free." 
        />
        <meta name="twitter:image" content="https://shelfie.app/images/twitter-card.png" />
        
        {/* Additional SEO tags */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Shelfie Team" />
        <meta name="theme-color" content="#10b981" />
        <link rel="canonical" href="https://shelfie.app" />
        
        {/* Structured data for rich snippets */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Shelfie",
            "description": "Smart pantry management app for busy families to save time and reduce food waste",
            "url": "https://shelfie.app",
            "applicationCategory": "LifestyleApplication",
            "operatingSystem": "Any",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "ratingCount": "1000"
            }
          })}
        </script>
      </Helmet>

      <LandingLayout 
        stickyHeader 
        showInstallPrompt
      >
        {/* Hero Section - Above the fold content */}
        <HeroSection
          onGetStarted={handleGetStarted}
          onWatchDemo={handleWatchDemo}
        />

        {/* Features Section - Core value propositions */}
        <FeaturesSection />

        {/* Social Proof Section - Build trust and credibility */}
        <SocialProofSection />

        {/* Final CTA Section - Conversion-focused */}
        <CTASection
          onGetStarted={handleGetStarted}
          onInstallApp={handleInstallApp}
          onContactSupport={handleContactSupport}
        />

        {/* Demo Video Modal */}
        {showDemoModal && (
          <Modal
            isOpen={showDemoModal}
            onClose={handleCloseDemoModal}
            title="Shelfie Demo"
            size="large"
            className="max-w-4xl"
          >
            <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
              {/* Demo video placeholder - replace with actual video */}
              <div className="flex items-center justify-center h-full text-white">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Coming Soon!</h3>
                    <p className="text-gray-300">
                      Our demo video is being prepared. In the meantime, 
                      <br />
                      <button
                        onClick={handleGetStarted}
                        className="text-primary-400 hover:text-primary-300 underline font-medium mt-2 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
                      >
                        sign up for free
                      </button>
                      {' '}to experience Shelfie firsthand!
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Modal actions */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
              <button
                onClick={handleCloseDemoModal}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Close
              </button>
              <button
                onClick={handleGetStarted}
                className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                Get Started Free
              </button>
            </div>
          </Modal>
        )}

        {/* Installation Loading Overlay */}
        {isInstalling && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-sm mx-4 text-center shadow-2xl">
              <LoadingSpinner size="large" className="mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Installing Shelfie
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Please follow the installation prompts in your browser
              </p>
            </div>
          </div>
        )}
      </LandingLayout>
    </>
  );
};

export default LandingPage;