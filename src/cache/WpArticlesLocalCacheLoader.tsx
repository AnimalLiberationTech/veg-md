"use client";

import {useEffect} from "react";
import {localCacheLoader} from "@/cache/local-cache-loader";
import {uvmSite, wpArticlesCacheKey} from "@/constants";
import {wpArticleIdsMap} from "@/pages";
import {buildWpApiPostsUrl} from "@/utils/wp-api-url";

const debugLog = (...args: any[]) => {
  if (process.env.NODE_ENV !== "production") {
    console.log("[WpArticlesLocalCacheLoader]", ...args);
  }
};

export default function WpArticlesLocalCacheLoader(): null {

  // Extract all required IDs from the WP articles map
  function collectRequiredIds(): number[] {
    const ids = new Set<number>();
    Object.values(wpArticleIdsMap).forEach((entry) => {
      Object.values(entry).forEach((id) => {
        const n = typeof id === "number" ? id : Number(id);
        if (!Number.isNaN(n)) ids.add(n);
      });
    });
    return Array.from(ids);
  }

  // Extract IDs from cached data
  function collectCachedIds(data: unknown): Set<number> {
    const ids = new Set<number>();

    if (!Array.isArray(data)) {
      return ids;
    }

    data.forEach((post) => {
      if (post && typeof post.id === "number") {
        ids.add(post.id);
      }
    });

    return ids;
  }

  useEffect(() => {
    const requiredIds = collectRequiredIds();

    localCacheLoader({
      cacheKey: wpArticlesCacheKey,
      buildUrl: () => {
        const ids = requiredIds;
        if (ids.length === 0) {
          debugLog("No IDs found, skipping fetch");
          throw new Error("No WP article IDs configured");
        }
        return buildWpApiPostsUrl(uvmSite, ids, ["id", "title", "content"]);
      },
      validateContent: (data: unknown) => {
        const cachedIds = collectCachedIds(data);
        return requiredIds.every((id) => cachedIds.has(id));
      },
      debugLog,
      eventName: "wpArticlesUpdated",
      onError: (err) => {
        console.error("[WpArticlesLocalCacheLoader] Failed to fetch WP articles:", err);
      },
    }).catch((err) => {
      debugLog("Unexpected error:", err);
    });
  }, []);

  return null;
}