const DB_NAME = 'ContextMasterDB';
const DB_VERSION = 1;
export const initDB = () =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('ux_logs')) {
        db.createObjectStore('ux_logs', { keyPath: 'timestamp' });
      }
      if (!db.objectStoreNames.contains('daily_progress')) {
        db.createObjectStore('daily_progress', { keyPath: 'date' });
      }
      if (!db.objectStoreNames.contains('exercise_history')) {
        const exerciseStore = db.createObjectStore('exercise_history', {
          keyPath: 'id',
          autoIncrement: true,
        });
        exerciseStore.createIndex('date', 'date', { unique: false });
        exerciseStore.createIndex('type', 'type', { unique: false });
      }
    };
    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
export const saveLog = async (storeName, data) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const request = tx.objectStore(storeName).put(data);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};
export const getAllLogs = async (storeName) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const request = db
      .transaction(storeName, 'readonly')
      .objectStore(storeName)
      .getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};
