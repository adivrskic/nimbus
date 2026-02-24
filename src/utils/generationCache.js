const CACHE_KEY_PREFIX = "gen_cache_";
const CACHE_INDEX_KEY = "gen_cache_index";
const MAX_CACHE_SIZE = 20;
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000;

const memoryCache = new Map();

function createCacheKey(prompt, selections = {}, persistentOptions = {}) {
  const normalizedPrompt = prompt.trim().toLowerCase();

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

  let hash = 0;
  for (let i = 0; i < dataToHash.length; i++) {
    const char = dataToHash.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  return CACHE_KEY_PREFIX + Math.abs(hash).toString(36);
}

function getCacheIndex() {
  try {
    const index = localStorage.getItem(CACHE_INDEX_KEY);
    return index ? JSON.parse(index) : [];
  } catch {
    return [];
  }
}

function updateCacheIndex(index) {
  try {
    localStorage.setItem(CACHE_INDEX_KEY, JSON.stringify(index));
  } catch (e) {
    console.warn("Failed to update cache index:", e);
  }
}

function evictOldEntries() {
  const index = getCacheIndex();

  if (index.length <= MAX_CACHE_SIZE) return;

  index.sort((a, b) => a.timestamp - b.timestamp);

  const toRemove = index.slice(0, index.length - MAX_CACHE_SIZE);
  toRemove.forEach((entry) => {
    try {
      localStorage.removeItem(entry.key);
      memoryCache.delete(entry.key);
    } catch {}
  });

  const remaining = index.slice(index.length - MAX_CACHE_SIZE);
  updateCacheIndex(remaining);
}

function isEntryValid(entry) {
  if (!entry) return false;
  const age = Date.now() - entry.timestamp;
  return age < CACHE_TTL;
}

export function getCachedGeneration(
  prompt,
  selections = {},
  persistentOptions = {}
) {
  const key = createCacheKey(prompt, selections, persistentOptions);

  if (memoryCache.has(key)) {
    const entry = memoryCache.get(key);
    if (isEntryValid(entry)) {
      return entry.data;
    }
    memoryCache.delete(key);
  }

  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      const entry = JSON.parse(stored);
      if (isEntryValid(entry)) {
        memoryCache.set(key, entry);
        return entry.data;
      }
      localStorage.removeItem(key);
    }
  } catch (e) {
    console.warn("Cache read error:", e);
  }

  return null;
}

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

  memoryCache.set(key, entry);

  try {
    localStorage.setItem(key, JSON.stringify(entry));

    const index = getCacheIndex();
    const existingIndex = index.findIndex((i) => i.key === key);
    if (existingIndex >= 0) {
      index[existingIndex].timestamp = entry.timestamp;
    } else {
      index.push({ key, timestamp: entry.timestamp });
    }
    updateCacheIndex(index);

    evictOldEntries();
  } catch (e) {
    console.warn("Cache write error:", e);
  }
}

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
}

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
