import { useState, useEffect } from 'react';

import { initDB, saveLog } from '../utils/indexedDB.js';

export function useIndexedDB(
  storeName,
  keyPath = 'date',
  legacyStorageKey = null,
) {
  const [data, setData] = useState(() => {
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
        req.onerror = () => {
          console.error(
            `Failed to read ${storeName} from IndexedDB:`,
            req.error,
          );
        };
        req.onsuccess = () => {
          const dict = {};
          req.result.forEach((row) => {
            dict[row[keyPath]] = row;
          });
          setData((prev) => {
            const merged = { ...prev, ...dict };
            if (legacyStorageKey) {
              const legacyDataStr = localStorage.getItem(legacyStorageKey);
              if (legacyDataStr) {
                const legacyData = JSON.parse(legacyDataStr);
                Object.keys(legacyData).forEach((key) => {
                  if (!dict[key]) {
                    saveLog(storeName, {
                      [keyPath]: key,
                      ...legacyData[key],
                    }).catch(console.error);
                  }
                });
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
  const syncData = (updater) => {
    setData((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      Object.keys(next).forEach((key) => {
        if (prev[key] !== next[key]) {
          saveLog(storeName, { [keyPath]: key, ...next[key] }).catch((err) =>
            console.error(`Failed to sync ${key} to ${storeName}:`, err),
          );
        }
      });
      return next;
    });
  };
  return [data, syncData];
}
