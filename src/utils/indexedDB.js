const DB_NAME = 'ContextMasterDB';
const DB_VERSION = 1;

// A single shared connection, opened once and reused by every caller
// (saveLog/getAllLogs/useIndexedDB all call initDB()), instead of a fresh
// `indexedDB.open()` handshake — and an unclosed connection — on every
// single read/write. Per MDN's own IndexedDB guidance, keeping one open
// connection for the page's lifetime rather than one per operation is the
// recommended pattern; the previous version also meant that if this app's
// DB_VERSION is ever bumped, the upgrade would hang behind however many
// stale connections had piled up over the session, since none were ever
// closed.
let dbPromise = null;

export const initDB = () => {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
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
    request.onsuccess = (event) => {
      const db = event.target.result;
      // Another tab running a newer build wants to upgrade the schema —
      // release this connection instead of leaving it open, which would
      // otherwise block that upgrade indefinitely (IndexedDB's documented
      // multi-tab "blocked" scenario). The next call to initDB() here
      // reopens fresh.
      db.onversionchange = () => {
        db.close();
        dbPromise = null;
      };
      resolve(db);
    };
    request.onerror = (event) => {
      dbPromise = null; // don't cache a permanent failure — allow retry
      reject(event.target.error);
    };
  });

  return dbPromise;
};

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
