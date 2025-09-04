import { useState, useEffect } from 'react';
import { useAppStore } from '../store/slices/appSlice';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const useInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const { installPromptDismissed, dismissInstallPrompt } = useAppStore();

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      
      // Save the event so we can trigger it later
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      // Clean up the deferredPrompt
      setDeferredPrompt(null);
      console.log('PWA was installed');
    };

    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    // Listen for the appinstalled event
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check if app is already installed
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      // App is already installed
      setDeferredPrompt(null);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const showPrompt = async () => {
    if (!deferredPrompt) {
      console.log('No install prompt available');
      return;
    }

    try {
      // Show the install prompt
      await deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      
      console.log(`User response to install prompt: ${outcome}`);
      
      // Clear the deferredPrompt
      setDeferredPrompt(null);
      
      // If user dismissed, mark as dismissed in storage
      if (outcome === 'dismissed') {
        dismissInstallPrompt();
      }
    } catch (error) {
      console.error('Error showing install prompt:', error);
    }
  };

  const hidePrompt = () => {
    dismissInstallPrompt();
  };

  const isInstallable = !!(
    deferredPrompt && 
    !installPromptDismissed &&
    !window.matchMedia?.('(display-mode: standalone)').matches
  );

  return {
    isInstallable,
    showPrompt,
    hidePrompt,
    canInstall: !!deferredPrompt,
  };
};