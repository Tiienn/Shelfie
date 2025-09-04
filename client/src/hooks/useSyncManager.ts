import { useEffect } from 'react';
import { useAppStore } from '../store/slices/appSlice';
import { useAuthStore } from '../store/slices/authSlice';

interface SyncOperation {
  id: string;
  type: 'create' | 'update' | 'delete';
  resource: string;
  data: any;
  timestamp: number;
}

export const useSyncManager = () => {
  const { isOnline, setPendingSyncCount, setLastSyncAt } = useAppStore();
  const { isAuthenticated, token } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || !token) return;

    // Initialize sync when coming online
    if (isOnline) {
      performSync();
    }

    // Set up periodic sync when online
    const syncInterval = isOnline ? setInterval(performSync, 30000) : null; // Sync every 30 seconds

    return () => {
      if (syncInterval) clearInterval(syncInterval);
    };
  }, [isOnline, isAuthenticated, token]);

  const performSync = async () => {
    try {
      // Get pending operations from IndexedDB
      const pendingOps = await getPendingOperations();
      
      if (pendingOps.length === 0) {
        setPendingSyncCount(0);
        return;
      }

      setPendingSyncCount(pendingOps.length);

      // Process each operation
      for (const operation of pendingOps) {
        await syncOperation(operation);
      }

      // Clear processed operations
      await clearProcessedOperations(pendingOps);
      
      setPendingSyncCount(0);
      setLastSyncAt(new Date());
      
    } catch (error) {
      console.error('Sync failed:', error);
      // Keep pending count as is, will retry on next sync
    }
  };

  const getPendingOperations = async (): Promise<SyncOperation[]> => {
    // TODO: Implement IndexedDB operations
    // For now, return empty array
    return [];
  };

  const syncOperation = async (operation: SyncOperation): Promise<void> => {
    const { type, resource, data } = operation;
    
    try {
      let response: Response;
      
      switch (type) {
        case 'create':
          response = await fetch(`/api/${resource}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
          });
          break;
          
        case 'update':
          response = await fetch(`/api/${resource}/${data.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
          });
          break;
          
        case 'delete':
          response = await fetch(`/api/${resource}/${data.id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          break;
          
        default:
          throw new Error(`Unknown operation type: ${type}`);
      }

      if (!response.ok) {
        throw new Error(`Sync failed: ${response.statusText}`);
      }
      
    } catch (error) {
      console.error(`Failed to sync operation ${operation.id}:`, error);
      throw error;
    }
  };

  const clearProcessedOperations = async (operations: SyncOperation[]): Promise<void> => {
    // TODO: Implement IndexedDB cleanup
    console.log('Cleared processed operations:', operations.length);
  };

  return {
    performSync,
    isOnline,
  };
};