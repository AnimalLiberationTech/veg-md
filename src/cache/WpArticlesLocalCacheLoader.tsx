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

function collectIds(map: Record<string, Record<string, number | string>>): number[] {
  const ids = new Set<number>();
  Object.values(map).forEach((entry) => {
    Object.values(entry).forEach((id) => {
      const n = typeof id === "number" ? id : Number(id);
      if (!Number.isNaN(n)) ids.add(n);
    });
  });
  return Array.from(ids);
}

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

export default function WpArticlesLocalCacheLoader(): null {
  useEffect(() => {
    localCacheLoader({
      cacheKey: wpArticlesCacheKey,
      buildUrl: () => {
        const ids = collectIds(wpArticleIdsMap);
        if (ids.length === 0) {
          debugLog("No IDs found, skipping fetch");
          throw new Error("No WP article IDs configured");
        }
        return buildWpApiPostsUrl(uvmSite, ids, ["id", "title", "content"]);
      },
      collectRequiredIds: () => collectIds(wpArticleIdsMap),
      collectCachedIds,
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