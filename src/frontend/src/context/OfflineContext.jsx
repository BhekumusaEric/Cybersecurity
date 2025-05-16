import { createContext, useContext, useState, useEffect } from 'react';
import indexedDBService from '../services/indexedDBService';

const OfflineContext = createContext();

export const useOffline = () => useContext(OfflineContext);

export const OfflineProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineContent, setOfflineContent] = useState({
    courses: [],
    modules: [],
    labs: [],
    assessments: []
  });
  const [hasUpdate, setHasUpdate] = useState(false);
  const [pendingActions, setPendingActions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Sync data when coming back online
      syncOfflineData();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    // Listen for service worker updates
    const handleSwUpdate = (event) => {
      setHasUpdate(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('swUpdate', handleSwUpdate);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('swUpdate', handleSwUpdate);
    };
  }, []);

  // Load cached content from IndexedDB
  useEffect(() => {
    const loadCachedContent = async () => {
      setIsLoading(true);
      try {
        // Load data from IndexedDB
        const courses = await indexedDBService.getAllData(indexedDBService.STORES.COURSES);
        const modules = await indexedDBService.getAllData(indexedDBService.STORES.MODULES);
        const labs = await indexedDBService.getAllData(indexedDBService.STORES.LABS);
        const assessments = await indexedDBService.getAllData(indexedDBService.STORES.ASSESSMENTS);
        const actions = await indexedDBService.getAllData(indexedDBService.STORES.OFFLINE_ACTIONS);

        setOfflineContent({
          courses: courses || [],
          modules: modules || [],
          labs: labs || [],
          assessments: assessments || []
        });

        setPendingActions(actions?.filter(action => action.status === 'pending') || []);
      } catch (error) {
        console.error('Error loading cached content:', error);

        // Fallback to localStorage if IndexedDB fails
        try {
          const cachedCourses = localStorage.getItem('offlineCourses');
          const cachedModules = localStorage.getItem('offlineModules');
          const cachedLabs = localStorage.getItem('offlineLabs');
          const cachedAssessments = localStorage.getItem('offlineAssessments');

          setOfflineContent({
            courses: cachedCourses ? JSON.parse(cachedCourses) : [],
            modules: cachedModules ? JSON.parse(cachedModules) : [],
            labs: cachedLabs ? JSON.parse(cachedLabs) : [],
            assessments: cachedAssessments ? JSON.parse(cachedAssessments) : []
          });
        } catch (localStorageError) {
          console.error('Error loading from localStorage:', localStorageError);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadCachedContent();
  }, []);

  // Cache content for offline use
  const cacheContent = async (type, content) => {
    try {
      // Store in memory
      setOfflineContent(prev => ({
        ...prev,
        [type]: Array.isArray(content) ? content : [content]
      }));

      // Store in IndexedDB
      await indexedDBService.addData(
        indexedDBService.STORES[type.toUpperCase()],
        content
      );

      // Store in localStorage as fallback
      localStorage.setItem(
        `offline${type.charAt(0).toUpperCase() + type.slice(1)}`,
        JSON.stringify(content)
      );

      return true;
    } catch (error) {
      console.error(`Error caching ${type}:`, error);
      return false;
    }
  };

  // Add an offline action to be synced later
  const addOfflineAction = async (action) => {
    try {
      const newAction = {
        ...action,
        timestamp: new Date().toISOString(),
        status: 'pending'
      };

      // Store in IndexedDB
      const savedAction = await indexedDBService.addData(
        indexedDBService.STORES.OFFLINE_ACTIONS,
        newAction
      );

      // Update state
      setPendingActions(prev => [...prev, savedAction]);

      return savedAction;
    } catch (error) {
      console.error('Error adding offline action:', error);
      return null;
    }
  };

  // Sync offline data when coming back online
  const syncOfflineData = async () => {
    if (!isOnline || pendingActions.length === 0) return;

    try {
      // Process each pending action
      for (const action of pendingActions) {
        try {
          // Attempt to sync the action with the server
          // This would be an API call in a real implementation
          console.log(`Syncing action: ${action.type} - ${action.id}`);

          // Mark action as completed
          await indexedDBService.addData(
            indexedDBService.STORES.OFFLINE_ACTIONS,
            { ...action, status: 'completed', syncedAt: new Date().toISOString() }
          );
        } catch (error) {
          console.error(`Error syncing action ${action.id}:`, error);

          // Mark action as failed
          await indexedDBService.addData(
            indexedDBService.STORES.OFFLINE_ACTIONS,
            { ...action, status: 'failed', error: error.message }
          );
        }
      }

      // Refresh pending actions
      const actions = await indexedDBService.getAllData(indexedDBService.STORES.OFFLINE_ACTIONS);
      setPendingActions(actions?.filter(action => action.status === 'pending') || []);
    } catch (error) {
      console.error('Error syncing offline data:', error);
    }
  };

  // Clear offline data
  const clearOfflineData = async (types = ['courses', 'modules', 'labs', 'assessments']) => {
    try {
      for (const type of types) {
        const storeKey = type.toUpperCase();
        if (indexedDBService.STORES[storeKey]) {
          await indexedDBService.clearStore(indexedDBService.STORES[storeKey]);
          localStorage.removeItem(`offline${type.charAt(0).toUpperCase() + type.slice(1)}`);
        }
      }

      // Update state
      const newContent = { ...offlineContent };
      types.forEach(type => {
        newContent[type] = [];
      });
      setOfflineContent(newContent);

      return true;
    } catch (error) {
      console.error('Error clearing offline data:', error);
      return false;
    }
  };

  // Update the service worker
  const updateServiceWorker = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
      });
      setHasUpdate(false);
      window.location.reload();
    }
  };

  const value = {
    isOnline,
    offlineContent,
    hasUpdate,
    isLoading,
    pendingActions,
    cacheContent,
    addOfflineAction,
    syncOfflineData,
    clearOfflineData,
    updateServiceWorker
  };

  return (
    <OfflineContext.Provider value={value}>
      {children}
    </OfflineContext.Provider>
  );
};

export default OfflineProvider;
