import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

import App from './App';
import { ErrorFallback } from './components/common/ErrorFallback';
import { initializeServices } from './services';
import { registerSW } from './utils/serviceWorker';
import reportWebVitals from './reportWebVitals';

import './styles/index.css';

// Initialize app services
initializeServices();

// Register service worker
registerSW();

// Hide loading screen
const loadingScreen = document.getElementById('loading-screen');
if (loadingScreen) {
  loadingScreen.style.display = 'none';
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        console.error('Application Error:', error, errorInfo);
        // Send to error tracking service
        if (window.gtag) {
          window.gtag('event', 'exception', {
            description: error.message,
            fatal: false,
          });
        }
      }}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals((metric) => {
  // Send to analytics
  if (window.gtag) {
    window.gtag('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_category: 'Web Vitals',
      event_label: metric.id,
      non_interaction: true,
    });
  }
});