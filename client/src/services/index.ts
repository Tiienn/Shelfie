// Initialize application services
export const initializeServices = async () => {
  console.log('🚀 Initializing Shelfie services...');
  
  // Initialize authentication check
  try {
    // Check for existing auth state on app start
    const { useAuthStore } = await import('../store/slices/authSlice');
    const authState = useAuthStore.getState();
    
    if (authState.token && authState.refreshToken) {
      // Attempt to refresh token on app start
      await authState.refreshAuth();
    } else {
      // Set loading to false if no stored auth
      authState.setLoading(false);
    }
  } catch (error) {
    console.error('Failed to initialize auth service:', error);
  }
  
  // Initialize IndexedDB
  try {
    if ('indexedDB' in window) {
      console.log('📦 IndexedDB available');
      // TODO: Initialize database with Dexie
    }
  } catch (error) {
    console.error('Failed to initialize IndexedDB:', error);
  }
  
  // Initialize notification permissions (if supported)
  if ('Notification' in window && 'serviceWorker' in navigator) {
    if (Notification.permission === 'default') {
      // Don't request permissions on first load, wait for user action
      console.log('🔔 Notification permissions not yet requested');
    } else if (Notification.permission === 'granted') {
      console.log('🔔 Notification permissions granted');
    }
  }
  
  console.log('✅ Services initialized successfully');
};