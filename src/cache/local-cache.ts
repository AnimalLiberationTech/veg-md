import {cacheTtlMsMap} from "@/constants";

export type LocalCacheEntry<T> = {
  timestamp: number;
  value: T;
};

function isBrowserStorageAvailable() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function readLocalCache<T>(key: string): T | null {
  if (!isBrowserStorageAvailable()) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<LocalCacheEntry<T>>;
    if (typeof parsed.timestamp !== "number") {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`[local-cache] ${key} has no valid timestamp`);
      }
      return null;
    }

    const age = Date.now() - parsed.timestamp;
    const ttlMs = cacheTtlMsMap[key];
    if (age > ttlMs) {
      if (process.env.NODE_ENV !== "production") {
        console.log(`[local-cache] ${key} is stale (age: ${age}ms, ttl: ${ttlMs}ms)`);
      }
      return null;
    }

    if (!Object.prototype.hasOwnProperty.call(parsed, "value")) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`[local-cache] ${key} has no value property`);
      }
      return null;
    }

    console.log(`[local-cache] ${key} hit (age: ${age}ms)`);
    return parsed.value as T;
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.error(`[local-cache] error reading ${key}`, err);
    }
    return null;
  }
}

export function writeLocalCache<T>(key: string, value: T) {
  if (!isBrowserStorageAvailable()) {
    return;
  }

  if (process.env.NODE_ENV !== "production") {
    console.log(`[local-cache] writing to ${key}`, value);
  }

  try {
    const payload: LocalCacheEntry<T> = {
      timestamp: Date.now(),
      value,
    };

    const serialized = JSON.stringify(payload);
    window.localStorage.setItem(key, serialized);
    if (process.env.NODE_ENV !== "production") {
      console.log(`[local-cache] successfully wrote ${key}, length: ${serialized.length}`);
    }
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.error(`[local-cache] failed to write to ${key}`, err);
    }
    // Ignore storage quota / serialization failures.
  }
}

export async function getOrFetchLocalCache<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const cached = readLocalCache<T>(key);
  if (cached !== null) {
    return cached;
  }

  const next = await fetcher();
  writeLocalCache(key, next);
  return next;
}
