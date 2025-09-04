import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { HeroSection } from '../HeroSection';

// Mock framer-motion to avoid animation complexities in tests
jest.mock('framer-motion', () => ({
  motion: {
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
}));

// Mock heroicons to avoid SVG import issues
jest.mock('@heroicons/react/24/outline', () => ({
  DevicePhoneMobileIcon: ({ className, ...props }: any) => (
    <div data-testid="device-mobile-icon" className={className} {...props} />
  ),
  CloudIcon: ({ className, ...props }: any) => (
    <div data-testid="cloud-icon" className={className} {...props} />
  ),
  ClockIcon: ({ className, ...props }: any) => (
    <div data-testid="clock-icon" className={className} {...props} />
  ),
  CurrencyDollarIcon: ({ className, ...props }: any) => (
    <div data-testid="currency-icon" className={className} {...props} />
  ),
  PlayIcon: ({ className, ...props }: any) => (
    <div data-testid="play-icon" className={className} {...props} />
  ),
  CheckCircleIcon: ({ className, ...props }: any) => (
    <div data-testid="check-circle-icon" className={className} {...props} />
  ),
}));

// Mock the Button component
jest.mock('../../common/Button', () => ({
  Button: ({ children, onClick, leftIcon, variant, size, className, ...props }: any) => (
    <button
      onClick={onClick}
      className={`btn btn-${variant} btn-${size} ${className}`}
      data-testid={`button-${children?.toString().toLowerCase().replace(/\s+/g, '-')}`}
      {...props}
    >
      {leftIcon && <span data-testid="button-left-icon">{leftIcon}</span>}
      {children}
    </button>
  ),
}));

describe('HeroSection', () => {
  // Clean up after each test
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<HeroSection />);
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      const customClass = 'custom-hero-class';
      render(<HeroSection className={customClass} />);
      const section = screen.getByRole('banner');
      expect(section).toHaveClass(customClass);
    });

    it('has proper semantic structure', () => {
      render(<HeroSection />);
      
      // Should be a section with proper labeling
      const section = screen.getByRole('banner');
      expect(section).toHaveAttribute('aria-labelledby', 'hero-heading');
    });
  });

  describe('Content Display', () => {
    beforeEach(() => {
      render(<HeroSection />);
    });

    it('displays the main headline correctly', () => {
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByText('Your Smart')).toBeInTheDocument();
      expect(screen.getByText('Pantry Manager')).toBeInTheDocument();
    });

    it('displays the subtitle/description', () => {
      expect(screen.getByText(/Stop throwing away food and save hours every week/)).toBeInTheDocument();
      expect(screen.getByText(/AI-powered pantry management designed for busy families/)).toBeInTheDocument();
    });

    it('displays the beta badge', () => {
      expect(screen.getByText('Now in Beta • Join 1000+ families')).toBeInTheDocument();
    });

    it('displays benefit statistics correctly', () => {
      expect(screen.getByText('2+ hours')).toBeInTheDocument();
      expect(screen.getByText('saved per week')).toBeInTheDocument();
      expect(screen.getByText('30%')).toBeInTheDocument();
      expect(screen.getByText('less food waste')).toBeInTheDocument();
    });
  });

  describe('Call-to-Action Buttons', () => {
    it('renders both CTA buttons', () => {
      render(<HeroSection />);
      
      const getStartedButton = screen.getByTestId('button-get-started-free');
      const watchDemoButton = screen.getByTestId('button-watch-demo');
      
      expect(getStartedButton).toBeInTheDocument();
      expect(watchDemoButton).toBeInTheDocument();
    });

    it('calls onGetStarted when Get Started button is clicked', () => {
      const mockGetStarted = jest.fn();
      render(<HeroSection onGetStarted={mockGetStarted} />);
      
      const button = screen.getByTestId('button-get-started-free');
      fireEvent.click(button);
      
      expect(mockGetStarted).toHaveBeenCalledTimes(1);
    });

    it('calls onWatchDemo when Watch Demo button is clicked', () => {
      const mockWatchDemo = jest.fn();
      render(<HeroSection onWatchDemo={mockWatchDemo} />);
      
      const button = screen.getByTestId('button-watch-demo');
      fireEvent.click(button);
      
      expect(mockWatchDemo).toHaveBeenCalledTimes(1);
    });

    it('renders Watch Demo button with play icon', () => {
      render(<HeroSection />);
      
      const button = screen.getByTestId('button-watch-demo');
      const playIcon = screen.getByTestId('play-icon');
      
      expect(button).toContainElement(playIcon);
    });

    it('applies correct button variants and sizes', () => {
      render(<HeroSection />);
      
      const getStartedButton = screen.getByTestId('button-get-started-free');
      const watchDemoButton = screen.getByTestId('button-watch-demo');
      
      expect(getStartedButton).toHaveClass('btn-primary', 'btn-xl');
      expect(watchDemoButton).toHaveClass('btn-outline', 'btn-xl');
    });
  });

  describe('Trust Indicators', () => {
    beforeEach(() => {
      render(<HeroSection />);
    });

    it('displays all trust indicators', () => {
      expect(screen.getByText('PWA Installable')).toBeInTheDocument();
      expect(screen.getByText('Install on any device')).toBeInTheDocument();
      
      expect(screen.getByText('Offline-First')).toBeInTheDocument();
      expect(screen.getByText('Works without internet')).toBeInTheDocument();
      
      expect(screen.getByText('Always Free')).toBeInTheDocument();
      expect(screen.getByText('No hidden costs')).toBeInTheDocument();
    });

    it('displays correct icons for trust indicators', () => {
      expect(screen.getByTestId('device-mobile-icon')).toBeInTheDocument();
      expect(screen.getByTestId('cloud-icon')).toBeInTheDocument();
      expect(screen.getByTestId('check-circle-icon')).toBeInTheDocument();
    });
  });

  describe('Benefit Statistics', () => {
    beforeEach(() => {
      render(<HeroSection />);
    });

    it('displays benefit icons correctly', () => {
      expect(screen.getByTestId('clock-icon')).toBeInTheDocument();
      expect(screen.getByTestId('currency-icon')).toBeInTheDocument();
    });

    it('ensures benefit icons have proper accessibility attributes', () => {
      const clockIcon = screen.getByTestId('clock-icon');
      const currencyIcon = screen.getByTestId('currency-icon');
      
      expect(clockIcon).toHaveAttribute('aria-hidden', 'true');
      expect(currencyIcon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('App Mockup Visual', () => {
    beforeEach(() => {
      render(<HeroSection />);
    });

    it('displays the app mockup with proper accessibility label', () => {
      const mockup = screen.getByRole('img');
      expect(mockup).toHaveAttribute(
        'aria-label', 
        'Shelfie app interface mockup showing pantry management features'
      );
    });

    it('renders app mockup structure elements', () => {
      // The mockup should contain the app brand name
      expect(screen.getByText('Shelfie')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      render(<HeroSection />);
    });

    it('has proper heading hierarchy', () => {
      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toHaveAttribute('id', 'hero-heading');
    });

    it('provides screen reader descriptions for buttons', () => {
      expect(screen.getByText('Sign up for free to start managing your pantry smartly')).toBeInTheDocument();
      expect(screen.getByText('View a demonstration video of Shelfie\'s features')).toBeInTheDocument();
    });

    it('has proper aria-describedby attributes on buttons', () => {
      const getStartedButton = screen.getByTestId('button-get-started-free');
      const watchDemoButton = screen.getByTestId('button-watch-demo');
      
      expect(getStartedButton).toHaveAttribute('aria-describedby', 'get-started-description');
      expect(watchDemoButton).toHaveAttribute('aria-describedby', 'watch-demo-description');
    });

    it('marks decorative icons with aria-hidden', () => {
      const icons = screen.getAllByTestId(/icon$/);
      icons.forEach(icon => {
        expect(icon).toHaveAttribute('aria-hidden', 'true');
      });
    });

    it('uses sr-only class for screen reader only content', () => {
      const srOnlyElements = document.querySelectorAll('.sr-only');
      expect(srOnlyElements.length).toBeGreaterThan(0);
    });
  });

  describe('Responsive Design Classes', () => {
    beforeEach(() => {
      render(<HeroSection />);
    });

    it('applies responsive typography classes', () => {
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveClass(
        'text-4xl', 
        'sm:text-5xl', 
        'lg:text-6xl'
      );
    });

    it('applies responsive grid layout classes', () => {
      const gridContainer = document.querySelector('.grid');
      expect(gridContainer).toHaveClass('lg:grid-cols-2');
    });

    it('applies responsive padding and spacing classes', () => {
      const section = screen.getByRole('banner');
      expect(section).toHaveClass('min-h-screen');
      
      const container = document.querySelector('.max-w-7xl');
      expect(container).toHaveClass('px-4', 'sm:px-6', 'lg:px-8');
    });
  });

  describe('Dark Mode Support', () => {
    beforeEach(() => {
      render(<HeroSection />);
    });

    it('includes dark mode classes for background', () => {
      const section = screen.getByRole('banner');
      expect(section.className).toMatch(/dark:/);
    });

    it('includes dark mode classes for text elements', () => {
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveClass('dark:text-white');
    });
  });

  describe('Background Elements', () => {
    beforeEach(() => {
      render(<HeroSection />);
    });

    it('includes decorative background elements with aria-hidden', () => {
      const decorativeElements = document.querySelectorAll('[aria-hidden="true"]');
      expect(decorativeElements.length).toBeGreaterThan(0);
    });

    it('applies gradient background classes', () => {
      const section = screen.getByRole('banner');
      expect(section).toHaveClass('bg-gradient-to-br');
    });
  });

  describe('Error Handling', () => {
    it('handles missing callback props gracefully', () => {
      render(<HeroSection />);
      
      const getStartedButton = screen.getByTestId('button-get-started-free');
      const watchDemoButton = screen.getByTestId('button-watch-demo');
      
      // Should not throw errors when clicked without callbacks
      expect(() => {
        fireEvent.click(getStartedButton);
        fireEvent.click(watchDemoButton);
      }).not.toThrow();
    });

    it('renders correctly with undefined callbacks', () => {
      render(<HeroSection onGetStarted={undefined} onWatchDemo={undefined} />);
      
      expect(screen.getByTestId('button-get-started-free')).toBeInTheDocument();
      expect(screen.getByTestId('button-watch-demo')).toBeInTheDocument();
    });
  });

  describe('Component Integration', () => {
    it('passes correct props to Button components', () => {
      const mockGetStarted = jest.fn();
      const mockWatchDemo = jest.fn();
      
      render(
        <HeroSection 
          onGetStarted={mockGetStarted} 
          onWatchDemo={mockWatchDemo} 
        />
      );
      
      const getStartedButton = screen.getByTestId('button-get-started-free');
      const watchDemoButton = screen.getByTestId('button-watch-demo');
      
      expect(getStartedButton).toHaveClass('btn-primary', 'btn-xl');
      expect(watchDemoButton).toHaveClass('btn-outline', 'btn-xl');
      
      fireEvent.click(getStartedButton);
      fireEvent.click(watchDemoButton);
      
      expect(mockGetStarted).toHaveBeenCalledTimes(1);
      expect(mockWatchDemo).toHaveBeenCalledTimes(1);
    });
  });

  describe('Performance Considerations', () => {
    it('renders efficiently without unnecessary re-renders', () => {
      const { rerender } = render(<HeroSection />);
      
      // Re-render with same props should not cause issues
      rerender(<HeroSection />);
      
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('handles prop changes correctly', () => {
      const mockCallback1 = jest.fn();
      const mockCallback2 = jest.fn();
      
      const { rerender } = render(<HeroSection onGetStarted={mockCallback1} />);
      
      fireEvent.click(screen.getByTestId('button-get-started-free'));
      expect(mockCallback1).toHaveBeenCalledTimes(1);
      
      rerender(<HeroSection onGetStarted={mockCallback2} />);
      
      fireEvent.click(screen.getByTestId('button-get-started-free'));
      expect(mockCallback2).toHaveBeenCalledTimes(1);
      expect(mockCallback1).toHaveBeenCalledTimes(1); // Should not be called again
    });
  });

  describe('Text Content Validation', () => {
    beforeEach(() => {
      render(<HeroSection />);
    });

    it('displays all expected text content', () => {
      // Main headlines
      expect(screen.getByText('Your Smart')).toBeInTheDocument();
      expect(screen.getByText('Pantry Manager')).toBeInTheDocument();
      
      // Description
      expect(screen.getByText(/Stop throwing away food and save hours every week/)).toBeInTheDocument();
      
      // Benefits
      expect(screen.getByText('2+ hours')).toBeInTheDocument();
      expect(screen.getByText('saved per week')).toBeInTheDocument();
      expect(screen.getByText('30%')).toBeInTheDocument();
      expect(screen.getByText('less food waste')).toBeInTheDocument();
      
      // Trust indicators
      expect(screen.getByText('PWA Installable')).toBeInTheDocument();
      expect(screen.getByText('Offline-First')).toBeInTheDocument();
      expect(screen.getByText('Always Free')).toBeInTheDocument();
      
      // Button text
      expect(screen.getByText('Get Started Free')).toBeInTheDocument();
      expect(screen.getByText('Watch Demo')).toBeInTheDocument();
    });
  });
});