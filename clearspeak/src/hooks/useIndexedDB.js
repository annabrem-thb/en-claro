import { useState, useEffect } from 'react';
import { initDB, saveLog } from '../utils/indexedDB.js';

/**
 * Custom hook to seamlessly sync a dictionary state object with IndexedDB.
 * 
 * @param {string} storeName - The name of the IndexedDB object store.
 * @param {string} keyPath - The key path used in the object store (e.g., 'date').
 * @param {string|null} legacyStorageKey - Optional localStorage key to migrate data from.
 */
export function useIndexedDB(storeName, keyPath = 'date', legacyStorageKey = null) {
  const [data, setData] = useState(() => {
    // Optimistic synchronous load from legacy localStorage to prevent empty states on first render
    if (legacyStorageKey) {
      const saved = localStorage.getItem(legacyStorageKey);
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  useEffect(() => {
    const loadFromDB = async () => {
      try {
        const db = await initDB();
        const tx = db.transaction(storeName, 'readonly');
        const req = tx.objectStore(storeName).getAll();
        
        req.onsuccess = () => {
          const dict = {};
          req.result.forEach(row => {
            dict[row[keyPath]] = row;
          });
          
          setData(prev => {
            const merged = { ...prev, ...dict };
            // Migrate legacy localStorage items to IndexedDB if they are missing
            if (legacyStorageKey) {
              const legacyDataStr = localStorage.getItem(legacyStorageKey);
              if (legacyDataStr) {
                const legacyData = JSON.parse(legacyDataStr);
                Object.keys(legacyData).forEach(key => {
                  if (!dict[key]) {
                    saveLog(storeName, { [keyPath]: key, ...legacyData[key] }).catch(console.error);
                  }
                });
                // Clean up legacy storage after migration
                localStorage.removeItem(legacyStorageKey);
              }
            }
            return merged;
          });
        };
      } catch (error) {
        console.error(`Failed to load ${storeName} from IndexedDB:`, error);
      }
    };
    
    loadFromDB();
  }, [storeName, keyPath, legacyStorageKey]);

  // Wrapper for setState that automatically syncs changes to IndexedDB
  const syncData = (updater) => {
    setData(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      
      // Detect changes and save only the updated items to IDB
      Object.keys(next).forEach(key => {
        if (prev[key] !== next[key]) {
          saveLog(storeName, { [keyPath]: key, ...next[key] }).catch(err => 
            console.error(`Failed to sync ${key} to ${storeName}:`, err)
          );
        }
      });
      
      return next;
    });
  };

  return [data, syncData];
}
