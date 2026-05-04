"use client";
import {useEffect} from "react";
import {uvmSite} from "@/constants";
import {wpArticleIdsMap} from "@/pages";
import {buildWpApiPostsUrl} from "@/utils/wp-api-url";
import {CACHE_KEY} from "@/utils/wp-article-cache";

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

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

function collectCachedIds(posts: unknown): Set<number> {
  const ids = new Set<number>();

  if (!Array.isArray(posts)) {
    return ids;
  }

  posts.forEach((post) => {
    if (post && typeof post.id === "number") {
      ids.add(post.id);
    }
  });

  return ids;
}

export default function WpArticlesCacheLoader(): null {
  useEffect(() => {
    if (typeof window === "undefined") {
      console.log("[FetchWpArticles] window is undefined, skipping");
      return;
    }

    console.log("[FetchWpArticles] Component mounted, checking cache...");


    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const age = Date.now() - (parsed?.timestamp || 0);
        const requiredIds = collectIds(wpArticleIdsMap);
        const cachedIds = collectCachedIds(parsed?.posts);
        const cacheCoversAllRequiredIds = requiredIds.every((id) => cachedIds.has(id));

        if (parsed?.timestamp && age < CACHE_TTL_MS && cacheCoversAllRequiredIds) {
          return;  // Cached, fresh, and complete — nothing to do
        }
      }
    } catch (e) {
      console.log("[FetchWpArticles] Cache parse failed, will refetch:", e);
    }

    const ids = collectIds(wpArticleIdsMap);
    console.log("[FetchWpArticles] Collected IDs:", ids);
    if (ids.length === 0) {
      console.log("[FetchWpArticles] No IDs found, skipping fetch");
      return;
    }

    const url = buildWpApiPostsUrl(uvmSite, ids, ["id", "title", "content", "rendered"]);
    console.log("[FetchWpArticles] Fetching from:", url);

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`WP fetch failed ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        const payload = {timestamp: Date.now(), posts: data};
        try {
          const serialized = JSON.stringify(payload);
          localStorage.setItem(CACHE_KEY, serialized);
          window.dispatchEvent(new Event("wpArticlesCacheUpdated"));
        } catch (e) {
          console.log("[FetchWpArticles] Failed to cache articles:", e);
        }
      })
      .catch((err) => {
        console.error("[FetchWpArticles] Failed to fetch WP articles:", err);
      });
  }, []);

  return null;
}

