// utils/generationCache.js - Caching layer for generated websites
// Uses both localStorage (for persistence) and in-memory (for speed)

const CACHE_KEY_PREFIX = "gen_cache_";
const CACHE_INDEX_KEY = "gen_cache_index";
const MAX_CACHE_SIZE = 20; // Max number of cached generations
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days in ms

// In-memory cache for fastest access
const memoryCache = new Map();

/**
 * Create a deterministic hash from prompt + selections
 * This ensures the same inputs always produce the same cache key
 */
function createCacheKey(prompt, selections = {}, persistentOptions = {}) {
  // Normalize and sort to ensure consistent hashing
  const normalizedPrompt = prompt.trim().toLowerCase();

  // Only include non-null, non-empty selections
  const relevantSelections = {};
  Object.entries(selections).forEach(([key, value]) => {
    if (
      value !== null &&
      value !== undefined &&
      value !== "" &&
      !(Array.isArray(value) && value.length === 0)
    ) {
      relevantSelections[key] = value;
    }
  });

  // Include relevant persistent options (brand name, etc.)
  const relevantPersistent = {};
  if (persistentOptions.branding?.brandName) {
    relevantPersistent.brandName = persistentOptions.branding.brandName;
  }
  if (persistentOptions.business?.description) {
    relevantPersistent.businessDesc = persistentOptions.business.description;
  }

  const dataToHash = JSON.stringify({
    p: normalizedPrompt,
    s: relevantSelections,
    o: relevantPersistent,
  });

  // Simple hash function
  let hash = 0;
  for (let i = 0; i < dataToHash.length; i++) {
    const char = dataToHash.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  return CACHE_KEY_PREFIX + Math.abs(hash).toString(36);
}

/**
 * Get cache index (list of cached items with metadata)
 */
function getCacheIndex() {
  try {
    const index = localStorage.getItem(CACHE_INDEX_KEY);
    return index ? JSON.parse(index) : [];
  } catch {
    return [];
  }
}

/**
 * Update cache index
 */
function updateCacheIndex(index) {
  try {
    localStorage.setItem(CACHE_INDEX_KEY, JSON.stringify(index));
  } catch (e) {
    console.warn("Failed to update cache index:", e);
  }
}

/**
 * Evict oldest entries if cache is too large
 */
function evictOldEntries() {
  const index = getCacheIndex();

  if (index.length <= MAX_CACHE_SIZE) return;

  // Sort by timestamp (oldest first)
  index.sort((a, b) => a.timestamp - b.timestamp);

  // Remove oldest entries
  const toRemove = index.slice(0, index.length - MAX_CACHE_SIZE);
  toRemove.forEach((entry) => {
    try {
      localStorage.removeItem(entry.key);
      memoryCache.delete(entry.key);
    } catch {}
  });

  // Update index
  const remaining = index.slice(index.length - MAX_CACHE_SIZE);
  updateCacheIndex(remaining);
}

/**
 * Check if a cached entry is still valid
 */
function isEntryValid(entry) {
  if (!entry) return false;
  const age = Date.now() - entry.timestamp;
  return age < CACHE_TTL;
}

/**
 * Get cached generation if available
 * @returns {Object|null} Cached result or null
 */
export function getCachedGeneration(
  prompt,
  selections = {},
  persistentOptions = {}
) {
  const key = createCacheKey(prompt, selections, persistentOptions);

  // Check memory cache first (fastest)
  if (memoryCache.has(key)) {
    const entry = memoryCache.get(key);
    if (isEntryValid(entry)) {
      console.log("[Cache] Memory hit:", key);
      return entry.data;
    }
    memoryCache.delete(key);
  }

  // Check localStorage
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      const entry = JSON.parse(stored);
      if (isEntryValid(entry)) {
        // Restore to memory cache
        memoryCache.set(key, entry);
        console.log("[Cache] Storage hit:", key);
        return entry.data;
      }
      // Expired - remove it
      localStorage.removeItem(key);
    }
  } catch (e) {
    console.warn("Cache read error:", e);
  }

  console.log("[Cache] Miss:", key);
  return null;
}

/**
 * Store a generation in cache
 */
export function cacheGeneration(
  prompt,
  selections = {},
  persistentOptions = {},
  result
) {
  const key = createCacheKey(prompt, selections, persistentOptions);

  const entry = {
    timestamp: Date.now(),
    data: {
      html: result.html || result.code,
      files: result.files || null,
      tokensUsed: result.tokensUsed,
    },
  };

  // Store in memory cache
  memoryCache.set(key, entry);

  // Store in localStorage
  try {
    localStorage.setItem(key, JSON.stringify(entry));

    // Update index
    const index = getCacheIndex();
    const existingIndex = index.findIndex((i) => i.key === key);
    if (existingIndex >= 0) {
      index[existingIndex].timestamp = entry.timestamp;
    } else {
      index.push({ key, timestamp: entry.timestamp });
    }
    updateCacheIndex(index);

    // Evict old entries if needed
    evictOldEntries();

    console.log("[Cache] Stored:", key);
  } catch (e) {
    console.warn("Cache write error:", e);
  }
}

/**
 * Clear a specific cache entry
 */
export function clearCacheEntry(
  prompt,
  selections = {},
  persistentOptions = {}
) {
  const key = createCacheKey(prompt, selections, persistentOptions);

  memoryCache.delete(key);

  try {
    localStorage.removeItem(key);
    const index = getCacheIndex().filter((i) => i.key !== key);
    updateCacheIndex(index);
  } catch {}
}

/**
 * Clear all cached generations
 */
export function clearAllCache() {
  memoryCache.clear();

  try {
    const index = getCacheIndex();
    index.forEach((entry) => {
      try {
        localStorage.removeItem(entry.key);
      } catch {}
    });
    localStorage.removeItem(CACHE_INDEX_KEY);
  } catch {}

  console.log("[Cache] Cleared all");
}

/**
 * Get cache stats
 */
export function getCacheStats() {
  const index = getCacheIndex();
  const validEntries = index.filter((entry) => {
    try {
      const stored = localStorage.getItem(entry.key);
      return stored && isEntryValid(JSON.parse(stored));
    } catch {
      return false;
    }
  });

  return {
    totalEntries: index.length,
    validEntries: validEntries.length,
    memoryEntries: memoryCache.size,
    maxSize: MAX_CACHE_SIZE,
  };
}

/**
 * Check if we should use cache for this request
 * Refinements should NOT be cached as they depend on current state
 */
export function shouldUseCache(isRefinement = false) {
  return !isRefinement;
}

export default {
  get: getCachedGeneration,
  set: cacheGeneration,
  clear: clearCacheEntry,
  clearAll: clearAllCache,
  stats: getCacheStats,
  shouldUse: shouldUseCache,
};
