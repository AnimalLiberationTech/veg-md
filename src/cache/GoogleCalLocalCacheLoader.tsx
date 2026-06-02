"use client";

import {useEffect} from "react";
import {localCacheLoader} from "@/cache/local-cache-loader";
import {gCalUrl, gCalCacheKey} from "@/constants";

const debugLog = (...args: any[]) => {
  if (process.env.NODE_ENV !== "production") {
    console.log("[GoogleCalLocalCacheLoader]", ...args);
  }
};

const calendarFeedUrl = `${gCalUrl}?cal=community&days=30`;

function collectCachedIds(data: unknown): Set<string> {
  const ids = new Set<string>();

  if (!Array.isArray(data)) {
    return ids;
  }

  data.forEach((event) => {
    if (event && typeof event.start_iso === "string" && typeof event.summary === "string") {
      // Use the same composite ID logic as in the page
      ids.add(`${event.start_iso}-${event.summary}`);
    }
  });

  return ids;
}

export default function GoogleCalLocalCacheLoader(): null {
  useEffect(() => {
    localCacheLoader({
      cacheKey: gCalCacheKey,
      buildUrl: () => {
        // Defensively resolve the URL against the current origin. This ensures
        // that even if `gCalUrl` is a relative path (like /api/...), it becomes
        // an absolute, same-origin URL for the fetch call, preventing any
        // accidental cross-origin requests from the browser.
        const resolvedUrl = new URL(calendarFeedUrl, window.location.origin).toString();
        debugLog("Resolved calendar fetch URL:", resolvedUrl);

        // Skip fetch attempts if the browser reports it is offline.
        if (typeof navigator !== "undefined" && !navigator.onLine) {
          throw new Error("Browser is offline, skipping calendar fetch.");
        }

        return resolvedUrl;
      },
      // For calendar, we don't have a static list of required IDs before fetch,
      // so we return empty to bypass completeness check and rely on TTL.
      collectRequiredIds: () => [],
      collectCachedIds,
      debugLog,
      eventName: "googleCalendarUpdated",
      onError: (err) => {
        console.warn("[GoogleCalLocalCacheLoader] Failed to fetch Google Calendar events; keeping any existing cache:", err);
      },
    }).catch((err) => {
      debugLog("Unexpected error:", err);
    });
  }, []);

  return null;
}
