/**
 * IndexedDB Service for offline data storage
 * 
 * This service provides methods for storing and retrieving data from IndexedDB,
 * which allows for larger and more structured offline storage than localStorage.
 */

const DB_NAME = 'ethical_hacking_lms';
const DB_VERSION = 1;

// Store names
const STORES = {
  COURSES: 'courses',
  MODULES: 'modules',
  LABS: 'labs',
  ASSESSMENTS: 'assessments',
  USER_PROGRESS: 'userProgress',
  SUBMISSIONS: 'submissions',
  OFFLINE_ACTIONS: 'offlineActions'
};

// Initialize the database
const initDB = () => {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('Your browser doesn\'t support IndexedDB'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      reject(new Error('Error opening IndexedDB'));
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Create object stores with indexes
      if (!db.objectStoreNames.contains(STORES.COURSES)) {
        const courseStore = db.createObjectStore(STORES.COURSES, { keyPath: 'id' });
        courseStore.createIndex('title', 'title', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.MODULES)) {
        const moduleStore = db.createObjectStore(STORES.MODULES, { keyPath: 'id' });
        moduleStore.createIndex('courseId', 'courseId', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.LABS)) {
        const labStore = db.createObjectStore(STORES.LABS, { keyPath: 'id' });
        labStore.createIndex('moduleId', 'moduleId', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.ASSESSMENTS)) {
        const assessmentStore = db.createObjectStore(STORES.ASSESSMENTS, { keyPath: 'id' });
        assessmentStore.createIndex('moduleId', 'moduleId', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.USER_PROGRESS)) {
        const progressStore = db.createObjectStore(STORES.USER_PROGRESS, { keyPath: 'id' });
        progressStore.createIndex('userId', 'userId', { unique: false });
        progressStore.createIndex('courseId', 'courseId', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.SUBMISSIONS)) {
        const submissionStore = db.createObjectStore(STORES.SUBMISSIONS, { keyPath: 'id', autoIncrement: true });
        submissionStore.createIndex('userId', 'userId', { unique: false });
        submissionStore.createIndex('itemId', 'itemId', { unique: false });
        submissionStore.createIndex('type', 'type', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.OFFLINE_ACTIONS)) {
        const actionsStore = db.createObjectStore(STORES.OFFLINE_ACTIONS, { keyPath: 'id', autoIncrement: true });
        actionsStore.createIndex('timestamp', 'timestamp', { unique: false });
        actionsStore.createIndex('type', 'type', { unique: false });
        actionsStore.createIndex('status', 'status', { unique: false });
      }
    };
  });
};

// Generic function to add data to a store
const addData = async (storeName, data) => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      
      // Handle both single item and array of items
      const items = Array.isArray(data) ? data : [data];
      let completed = 0;
      let errors = [];

      items.forEach(item => {
        const request = store.put(item);
        
        request.onsuccess = () => {
          completed++;
          if (completed === items.length) {
            if (errors.length > 0) {
              reject(new Error(`Some items failed to save: ${errors.join(', ')}`));
            } else {
              resolve(Array.isArray(data) ? items : items[0]);
            }
          }
        };
        
        request.onerror = (event) => {
          completed++;
          errors.push(`Error saving item ${item.id}: ${event.target.error}`);
          if (completed === items.length) {
            reject(new Error(`Some items failed to save: ${errors.join(', ')}`));
          }
        };
      });

      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('IndexedDB error:', error);
    throw error;
  }
};

// Generic function to get all data from a store
const getAllData = async (storeName) => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      
      request.onsuccess = () => {
        resolve(request.result);
      };
      
      request.onerror = (event) => {
        reject(new Error(`Error getting data from ${storeName}: ${event.target.error}`));
      };

      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('IndexedDB error:', error);
    throw error;
  }
};

// Generic function to get data by ID
const getDataById = async (storeName, id) => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);
      
      request.onsuccess = () => {
        resolve(request.result);
      };
      
      request.onerror = (event) => {
        reject(new Error(`Error getting item ${id} from ${storeName}: ${event.target.error}`));
      };

      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('IndexedDB error:', error);
    throw error;
  }
};

// Generic function to delete data by ID
const deleteDataById = async (storeName, id) => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);
      
      request.onsuccess = () => {
        resolve(true);
      };
      
      request.onerror = (event) => {
        reject(new Error(`Error deleting item ${id} from ${storeName}: ${event.target.error}`));
      };

      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('IndexedDB error:', error);
    throw error;
  }
};

// Generic function to clear a store
const clearStore = async (storeName) => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();
      
      request.onsuccess = () => {
        resolve(true);
      };
      
      request.onerror = (event) => {
        reject(new Error(`Error clearing ${storeName}: ${event.target.error}`));
      };

      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('IndexedDB error:', error);
    throw error;
  }
};

// Export the service
const indexedDBService = {
  STORES,
  addData,
  getAllData,
  getDataById,
  deleteDataById,
  clearStore
};

export default indexedDBService;
