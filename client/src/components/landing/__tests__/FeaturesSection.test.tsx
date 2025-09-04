import React from 'react';
import { render, screen } from '@testing-library/react';
import { FeaturesSection } from '../FeaturesSection';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
  },
}));

describe('FeaturesSection', () => {
  it('renders without crashing', () => {
    render(<FeaturesSection />);
    expect(screen.getByLabelledBy('features-heading')).toBeInTheDocument();
  });

  it('displays the main heading', () => {
    render(<FeaturesSection />);
    expect(
      screen.getByRole('heading', { level: 2, name: /everything you need to manage your pantry/i })
    ).toBeInTheDocument();
  });

  it('displays all 6 features', () => {
    render(<FeaturesSection />);
    
    // Check that all feature titles are present
    expect(screen.getByText('Receipt Scanning')).toBeInTheDocument();
    expect(screen.getByText('AI Recipe Suggestions')).toBeInTheDocument();
    expect(screen.getByText('Offline-First Design')).toBeInTheDocument();
    expect(screen.getByText('Smart Notifications')).toBeInTheDocument();
    expect(screen.getByText('Family Sharing')).toBeInTheDocument();
    expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
  });

  it('displays feature benefits', () => {
    render(<FeaturesSection />);
    
    // Check that key benefits are highlighted
    expect(screen.getByText('Add groceries in seconds')).toBeInTheDocument();
    expect(screen.getByText('Never wonder "what\'s for dinner?" again')).toBeInTheDocument();
    expect(screen.getByText('Reduce food waste by 30%')).toBeInTheDocument();
    expect(screen.getByText('Save $200+ monthly on groceries')).toBeInTheDocument();
  });

  it('displays the bottom CTA text', () => {
    render(<FeaturesSection />);
    expect(
      screen.getByText('Join thousands of families already saving time and money')
    ).toBeInTheDocument();
    expect(screen.getByText('Free forever')).toBeInTheDocument();
  });

  it('has proper accessibility structure', () => {
    render(<FeaturesSection />);
    
    // Check semantic structure
    const section = screen.getByRole('region', { name: /everything you need to manage your pantry/i });
    expect(section).toHaveAttribute('aria-labelledby', 'features-heading');
    
    // Check that all feature cards have headings
    const featureHeadings = screen.getAllByRole('heading', { level: 3 });
    expect(featureHeadings).toHaveLength(6);
  });

  it('applies custom className when provided', () => {
    render(<FeaturesSection className="custom-class" />);
    const section = screen.getByRole('region');
    expect(section).toHaveClass('custom-class');
  });

  it('has all required ARIA labels for icons', () => {
    render(<FeaturesSection />);
    
    // Icons should have aria-hidden="true" since they are decorative
    const icons = screen.getAllByRole('img', { hidden: true });
    expect(icons.length).toBeGreaterThan(0);
  });

  describe('Responsive Design', () => {
    it('has mobile-first grid classes', () => {
      render(<FeaturesSection />);
      const grid = screen.getByRole('region').querySelector('.grid');
      
      expect(grid).toHaveClass('grid-cols-1'); // Mobile
      expect(grid).toHaveClass('sm:grid-cols-2'); // Tablet
      expect(grid).toHaveClass('lg:grid-cols-3'); // Desktop
    });
  });

  describe('Dark Mode Support', () => {
    it('includes dark mode classes', () => {
      render(<FeaturesSection />);
      const section = screen.getByRole('region');
      expect(section).toHaveClass('dark:bg-gray-900');
    });
  });
});