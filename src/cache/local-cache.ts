export type LocalCacheEntry<T> = {
  timestamp: number;
  value: T;
};

function isBrowserStorageAvailable() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function readLocalCache<T>(key: string, ttlMs: number): T | null {
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
      return null;
    }

    if (Date.now() - parsed.timestamp > ttlMs) {
      return null;
    }

    if (!Object.prototype.hasOwnProperty.call(parsed, "value")) {
      return null;
    }

    return parsed.value as T;
  } catch {
    return null;
  }
}

export function writeLocalCache<T>(key: string, value: T) {
  if (!isBrowserStorageAvailable()) {
    return;
  }

  try {
    const payload: LocalCacheEntry<T> = {
      timestamp: Date.now(),
      value,
    };

    window.localStorage.setItem(key, JSON.stringify(payload));
  } catch {
    // Ignore storage quota / serialization failures.
  }
}

export async function getOrFetchLocalCache<T>(
  key: string,
  ttlMs: number,
  fetcher: () => Promise<T>,
): Promise<T> {
  const cached = readLocalCache<T>(key, ttlMs);
  if (cached !== null) {
    return cached;
  }

  const next = await fetcher();
  writeLocalCache(key, next);
  return next;
}
