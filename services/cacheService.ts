import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { SongInputs, AnalysisResponse } from '../types';

// IndexedDB schema
interface CacheDB extends DBSchema {
  'analysis-cache': {
    key: string; // Cache key based on inputs
    value: {
      cacheKey: string;
      timestamp: number;
      inputs: SongInputs;
      response: AnalysisResponse;
      partialCacheInfo: {
        canPartialUpdate: boolean;
        unchangedFields: string[];
      };
    };
    indexes: { 'by-timestamp': number };
  };
}

const DB_NAME = 'suno-architect-cache';
const DB_VERSION = 1;
const STORE_NAME = 'analysis-cache';
const CACHE_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

let dbPromise: Promise<IDBPDatabase<CacheDB>> | null = null;

// Initialize database
async function getDB(): Promise<IDBPDatabase<CacheDB>> {
  if (!dbPromise) {
    dbPromise = openDB<CacheDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'cacheKey' });
          store.createIndex('by-timestamp', 'timestamp');
        }
      },
    });
  }
  return dbPromise;
}

// Generate cache key from inputs
function generateCacheKey(inputs: SongInputs): string {
  // Exclude fields that don't affect analysis
  const cacheableInputs = {
    topic: inputs.topic,
    mood: inputs.mood,
    genre: inputs.genre || 'none',
    vocals: inputs.vocals,
    instrumental: inputs.instrumental,
    genreProfile: inputs.genreProfile || 'none',
    // Include personalization if present
    personalization: inputs.personalization ? JSON.stringify(inputs.personalization) : 'none'
  };
  
  // Create a stable hash
  return btoa(JSON.stringify(cacheableInputs)).substring(0, 64);
}

// Check if inputs match for partial caching
function canUseCachedAnalysis(
  cachedInputs: SongInputs,
  newInputs: SongInputs
): { canUse: boolean; isPartial: boolean; unchangedFields: string[] } {
  // Check if core analysis parameters are the same
  const coreFieldsMatch = 
    cachedInputs.topic === newInputs.topic &&
    cachedInputs.mood === newInputs.mood &&
    cachedInputs.genre === newInputs.genre &&
    cachedInputs.vocals === newInputs.vocals &&
    cachedInputs.instrumental === newInputs.instrumental &&
    cachedInputs.genreProfile === newInputs.genreProfile;

  if (!coreFieldsMatch) {
    return { canUse: false, isPartial: false, unchangedFields: [] };
  }

  // Check personalization context
  const personalizationMatch = 
    JSON.stringify(cachedInputs.personalization) === JSON.stringify(newInputs.personalization);

  if (!personalizationMatch) {
    return { canUse: false, isPartial: false, unchangedFields: [] };
  }

  // Full match - can use cached analysis
  return { 
    canUse: true, 
    isPartial: false, 
    unchangedFields: ['all'] 
  };
}

// Get cached analysis if available
export async function getCachedAnalysis(inputs: SongInputs): Promise<AnalysisResponse | null> {
  try {
    const db = await getDB();
    const cacheKey = generateCacheKey(inputs);
    const cached = await db.get(STORE_NAME, cacheKey);

    if (!cached) {
      console.log('[Cache] MISS - No cached analysis found');
      return null;
    }

    // Check if cache is expired
    const age = Date.now() - cached.timestamp;
    if (age > CACHE_DURATION_MS) {
      console.log('[Cache] EXPIRED - Cache is older than 30 days, removing');
      await db.delete(STORE_NAME, cacheKey);
      return null;
    }

    // Check if inputs match for partial caching
    const cacheCheck = canUseCachedAnalysis(cached.inputs, inputs);
    
    if (!cacheCheck.canUse) {
      console.log('[Cache] MISS - Inputs changed significantly');
      return null;
    }

    console.log('[Cache] HIT - Using cached analysis', {
      age: Math.round(age / (1000 * 60 * 60 * 24)) + ' days',
      isPartial: cacheCheck.isPartial,
      unchangedFields: cacheCheck.unchangedFields
    });

    return cached.response;
  } catch (error) {
    console.error('[Cache] Error retrieving cached analysis:', error);
    return null;
  }
}

// Store analysis in cache
export async function setCachedAnalysis(
  inputs: SongInputs,
  response: AnalysisResponse
): Promise<void> {
  try {
    const db = await getDB();
    const cacheKey = generateCacheKey(inputs);

    await db.put(STORE_NAME, {
      cacheKey,
      timestamp: Date.now(),
      inputs,
      response,
      partialCacheInfo: {
        canPartialUpdate: false,
        unchangedFields: []
      }
    });

    console.log('[Cache] Stored analysis in cache');
  } catch (error) {
    console.error('[Cache] Error storing analysis:', error);
  }
}

// Clear expired cache entries
export async function clearExpiredCache(): Promise<number> {
  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const index = store.index('by-timestamp');
    
    const cutoffTime = Date.now() - CACHE_DURATION_MS;
    const expiredKeys: string[] = [];

    let cursor = await index.openCursor();
    while (cursor) {
      if (cursor.value.timestamp < cutoffTime) {
        expiredKeys.push(cursor.value.cacheKey);
      }
      cursor = await cursor.continue();
    }

    await Promise.all(expiredKeys.map(key => store.delete(key)));
    await tx.done;

    console.log(`[Cache] Cleared ${expiredKeys.length} expired entries`);
    return expiredKeys.length;
  } catch (error) {
    console.error('[Cache] Error clearing expired cache:', error);
    return 0;
  }
}

// Get cache statistics
export async function getCacheStats(): Promise<{
  totalEntries: number;
  oldestEntry: number | null;
  newestEntry: number | null;
  totalSizeEstimate: number;
}> {
  try {
    const db = await getDB();
    const allEntries = await db.getAll(STORE_NAME);

    if (allEntries.length === 0) {
      return {
        totalEntries: 0,
        oldestEntry: null,
        newestEntry: null,
        totalSizeEstimate: 0
      };
    }

    const timestamps = allEntries.map(e => e.timestamp);
    const totalSize = allEntries.reduce((sum, entry) => {
      // Rough estimate of entry size
      return sum + JSON.stringify(entry).length;
    }, 0);

    return {
      totalEntries: allEntries.length,
      oldestEntry: Math.min(...timestamps),
      newestEntry: Math.max(...timestamps),
      totalSizeEstimate: totalSize
    };
  } catch (error) {
    console.error('[Cache] Error getting cache stats:', error);
    return {
      totalEntries: 0,
      oldestEntry: null,
      newestEntry: null,
      totalSizeEstimate: 0
    };
  }
}

// Clear all cache
export async function clearAllCache(): Promise<void> {
  try {
    const db = await getDB();
    await db.clear(STORE_NAME);
    console.log('[Cache] Cleared all cache entries');
  } catch (error) {
    console.error('[Cache] Error clearing all cache:', error);
  }
}

// Invalidate cache for specific inputs
export async function invalidateCache(inputs: SongInputs): Promise<void> {
  try {
    const db = await getDB();
    const cacheKey = generateCacheKey(inputs);
    await db.delete(STORE_NAME, cacheKey);
    console.log('[Cache] Invalidated cache for inputs');
  } catch (error) {
    console.error('[Cache] Error invalidating cache:', error);
  }
}
