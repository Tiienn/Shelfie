import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  // UI State
  theme: 'light' | 'dark' | 'system';
  sidebarOpen: boolean;
  
  // Network & Sync State
  isOnline: boolean;
  pendingSyncCount: number;
  lastSyncAt: Date | null;
  
  // App State
  installPromptDismissed: boolean;
  onboardingCompleted: boolean;
  
  // Actions
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setOnlineStatus: (online: boolean) => void;
  setPendingSyncCount: (count: number) => void;
  setLastSyncAt: (date: Date) => void;
  dismissInstallPrompt: () => void;
  completeOnboarding: () => void;
  reset: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      theme: 'system',
      sidebarOpen: true,
      isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
      pendingSyncCount: 0,
      lastSyncAt: null,
      installPromptDismissed: false,
      onboardingCompleted: false,

      // Actions
      toggleTheme: () => {
        const { theme } = get();
        const newTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
        set({ theme: newTheme });
      },

      setTheme: (theme) => set({ theme }),

      toggleSidebar: () => {
        const { sidebarOpen } = get();
        set({ sidebarOpen: !sidebarOpen });
      },

      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      setOnlineStatus: (online) => set({ isOnline: online }),

      setPendingSyncCount: (count) => set({ pendingSyncCount: count }),

      setLastSyncAt: (date) => set({ lastSyncAt: date }),

      dismissInstallPrompt: () => set({ installPromptDismissed: true }),

      completeOnboarding: () => set({ onboardingCompleted: true }),

      reset: () => set({
        theme: 'system',
        sidebarOpen: true,
        isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
        pendingSyncCount: 0,
        lastSyncAt: null,
        installPromptDismissed: false,
        onboardingCompleted: false,
      }),
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
        installPromptDismissed: state.installPromptDismissed,
        onboardingCompleted: state.onboardingCompleted,
      }),
    }
  )
);

// Set up online/offline listeners
if (typeof window !== 'undefined') {
  const updateOnlineStatus = () => {
    useAppStore.getState().setOnlineStatus(navigator.onLine);
  };

  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
}