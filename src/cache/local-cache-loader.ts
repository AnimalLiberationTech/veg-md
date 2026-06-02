/**
 * Generic local cache loader for fetching and storing data in localStorage
 * with TTL and completeness checking.
 */

import {cacheTtlMsMap} from "@/constants";

export interface LocalCacheLoaderOptions<T> {
  /** localStorage key */
  cacheKey: keyof typeof cacheTtlMsMap;
  /** Function that returns the URL to fetch from */
  buildUrl: () => string;
  /** Function to validate if fetched data contains all required content */
  validateContent: (data: unknown) => boolean;
  /** Optional callback when fetch succeeds (before cache write) */
  onSuccess?: (data: T[]) => void;
  /** Optional callback when fetch fails */
  onError?: (error: Error) => void;
  /** Optional debug logging function */
  debugLog?: (...args: any[]) => void;
  /** Custom event name to dispatch after cache update. Default: 'localCacheUpdated' */
  eventName?: string;
}

/**
 * Loads data from a remote URL, validates cache freshness and completeness,
 * and stores in localStorage with a timestamp.
 *
 * @param options Configuration for the cache loader
 * @returns Promise that resolves when cache check/fetch is complete
 */
export async function localCacheLoader<T>(
  options: LocalCacheLoaderOptions<T>,
): Promise<void> {
  const {
    cacheKey,
    buildUrl,
    validateContent,
    onSuccess,
    onError,
    debugLog = () => {},
    eventName = "localCacheUpdated",
  } = options;
  const cacheTtlMs = cacheTtlMsMap[cacheKey];

  // Check if we're in a browser environment
  if (typeof window === "undefined") {
    debugLog("[localCacheLoader] window is undefined, skipping");
    return;
  }

  try {
    // Check existing cache
    const raw = localStorage.getItem(cacheKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      const age = Date.now() - (parsed?.timestamp || 0);
      const isContentValid = validateContent(parsed?.data);

      if (
        parsed?.timestamp &&
        age < cacheTtlMs &&
        isContentValid
      ) {
        debugLog(
          `[localCacheLoader] Cache is fresh (age: ${age}ms) and valid, skipping fetch`,
        );
        return; // Cached, fresh, and valid — nothing to do
      }

      debugLog(
        `[localCacheLoader] Cache is stale or invalid (age: ${age}ms)`,
      );
    }
  } catch (e) {
    debugLog("[localCacheLoader] Cache parse failed, will refetch:", e);
  }

  // Fetch and store
  let url: string;
  try {
    url = buildUrl();
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    debugLog(`[localCacheLoader] Failed to build URL:`, error);
    onError?.(error);
    return;
  }

  debugLog(`[localCacheLoader] Fetching from: ${url}`);

  try {
    const res = await fetch(url);
    if (!res.ok) {
      const error = new Error(`Fetch failed with status ${res.status}`);
      debugLog(`[localCacheLoader] Fetch failed:`, error);
      onError?.(error);
      return;
    }

    const data = (await res.json()) as T[];
    onSuccess?.(data);

    const payload = { timestamp: Date.now(), data };
    const serialized = JSON.stringify(payload);
    localStorage.setItem(cacheKey, serialized);
    debugLog(`[localCacheLoader] Cache updated with ${Array.isArray(data) ? data.length : 1} items`);

    window.dispatchEvent(new Event(eventName));
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    debugLog(`[localCacheLoader] Fetch failed:`, error);
    onError?.(error);
  }
}

