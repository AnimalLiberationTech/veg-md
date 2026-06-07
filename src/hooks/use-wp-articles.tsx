"use client";
import {useCallback, useEffect, useState} from "react";
import {wpArticlesCacheKey} from "@/constants";
import {ArticlesMap, buildArticlesMapFromCache, resolveArticleFromCache, WpArticle} from "@/cache/wp-article-local-cache";

export default function useWpArticles() {
  const [articles, setArticles] = useState<ArticlesMap>({});
  const [loading, setLoading] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const next = buildArticlesMapFromCache();
      setArticles(next);
    } finally {
      setLoading(false);
    }
  }, []);

  const getArticle = useCallback((pageKey: string, locale: string): WpArticle | null => {
    if (!hasMounted) return null;
    return resolveArticleFromCache(pageKey, locale, articles);
  }, [articles, hasMounted]);

  useEffect(() => {
    setHasMounted(true);
    // Ensure we have the latest cache at mount
    refresh().catch(() => {
      // Ignore errors during initial refresh
    });

    const handleUpdate = (e?: Event) => {
      if (e instanceof StorageEvent && e.key !== wpArticlesCacheKey) return;
      refresh().catch(() => {
        // Ignore errors during refresh
      });
    };

    window.addEventListener("wpArticlesUpdated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("wpArticlesUpdated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [refresh]);

  return {articles, loading, refresh, getArticle};
}

