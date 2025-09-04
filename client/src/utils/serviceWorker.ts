// Register service worker for PWA functionality
export const registerSW = () => {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
          
          // Update available
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                    // New content available; please refresh
                    console.log('New content available, please refresh.');
                    
                    // Show update notification
                    if (window.confirm('New version available! Click OK to refresh.')) {
                      window.location.reload();
                    }
                  } else {
                    // Content cached for first time
                    console.log('Content is cached for offline use.');
                  }
                }
              });
            }
          });
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  } else if (process.env.NODE_ENV === 'development') {
    console.log('Service worker registration skipped in development');
  }
};