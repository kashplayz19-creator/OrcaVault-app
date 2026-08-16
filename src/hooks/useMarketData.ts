import { useState, useEffect, useCallback } from 'react';

export interface MarketIndicator {
  symbol: string;
  price: number;
  rsi: number;
  support_level: number;
  updated_at: string;
}

export interface UseMarketDataResult {
  data: MarketIndicator[];
  isLoading: boolean;
  isSyncing: boolean;
  isOffline: boolean;
  error: string | null;
  lastUpdated: string | null;
  refetch: () => Promise<void>;
}

// Low-level Native IndexedDB Utilities
const DB_NAME = 'OrcaVaultOfflineDB';
const DB_VERSION = 1;
const STORE_NAME = 'market_indicators';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('IndexedDB is not supported by this browser.'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'symbol' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Failed to open IndexedDB'));
  });
}

async function getCachedMarketData(): Promise<MarketIndicator[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error || new Error('IndexedDB getAll failed'));
    });
  } catch (err) {
    console.warn('[useMarketData] IndexedDB cache read failed:', err);
    return [];
  }
}

async function setCachedMarketData(records: MarketIndicator[]): Promise<void> {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    records.forEach((record) => {
      store.put(record);
    });

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (err) {
    console.warn('[useMarketData] IndexedDB cache write failed:', err);
  }
}

/**
 * Custom React Hook for Offline-First Market Indicator Data
 * 1. Hydrates instantly from IndexedDB (isLoading: false if cache exists).
 * 2. Fetches fresh rows in background (isSyncing: true).
 * 3. Fallback to cache on network error/offline (isOffline: true).
 */
export function useMarketData(): UseMarketDataResult {
  const [data, setData] = useState<MarketIndicator[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchRemoteData = useCallback(async (currentCache: MarketIndicator[]) => {
    setIsSyncing(true);
    setError(null);

    const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

    try {
      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase credentials missing in environment.');
      }

      // Direct REST API fetch to Supabase to keep client bundle lightweight
      const endpoint = `${supabaseUrl}/rest/v1/market_indicators?select=*&order=updated_at.desc`;
      const res = await fetch(endpoint, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        throw new Error(`Supabase REST Error: ${res.status} ${res.statusText}`);
      }

      const freshRows: MarketIndicator[] = await res.json();

      if (Array.isArray(freshRows) && freshRows.length > 0) {
        setData(freshRows);
        setLastUpdated(freshRows[0]?.updated_at || new Date().toISOString());
        setIsOffline(false);
        // Persist to IndexedDB in background
        await setCachedMarketData(freshRows);
      } else if (currentCache.length === 0) {
        // Fallback default structure if DB table empty
        setData([]);
      }
    } catch (err: any) {
      console.warn('[useMarketData] Fetch failed, relying on IndexedDB cache:', err);
      setIsOffline(true);
      setError(err.message || 'Failed to sync live market data.');

      // If network failed but cache exists, we keep cached data and suppress white screens
      if (currentCache.length > 0) {
        setData(currentCache);
      }
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  }, []);

  const refreshData = useCallback(async () => {
    const cached = await getCachedMarketData();
    await fetchRemoteData(cached);
  }, [fetchRemoteData]);

  useEffect(() => {
    let isMounted = true;

    async function initHydration() {
      // 1. Instant Hydration from IndexedDB
      const cached = await getCachedMarketData();
      
      if (!isMounted) return;

      if (cached.length > 0) {
        setData(cached);
        setLastUpdated(cached[0]?.updated_at || null);
        setIsLoading(false); // Immediate unblock for UI rendering
      } else {
        setIsLoading(true); // Show skeleton until first network fetch resolves
      }

      // 2. Fetch fresh rows in background
      await fetchRemoteData(cached);
    }

    initHydration();

    // Online/Offline Event Listeners
    const handleOnline = () => {
      setIsOffline(false);
      refreshData();
    };
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      isMounted = false;
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [fetchRemoteData, refreshData]);

  return {
    data,
    isLoading,
    isSyncing,
    isOffline,
    error,
    lastUpdated,
    refetch: refreshData,
  };
}
