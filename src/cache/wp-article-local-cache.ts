import {wpArticlesCacheKey} from "@/constants";
import {wpArticleIdsMap} from "@/pages";

export interface WpArticle {
  id: number;
  title?: { rendered?: string };
  content?: { rendered?: string };
}

export type ArticlesMap = Record<string, Record<string, WpArticle | null>>;

function mapEmpty(): ArticlesMap {
  const result: ArticlesMap = {};

  Object.keys(wpArticleIdsMap).forEach((pageKey) => {
    result[pageKey] = {};
    Object.keys(wpArticleIdsMap[pageKey]).forEach((locale) => {
      result[pageKey][locale] = null;
    });
  });

  return result;
}

export function buildArticlesMapFromCache(): ArticlesMap {
  const result: ArticlesMap = {};

  if (typeof window === "undefined") {
    return mapEmpty();
  }

  try {
    const raw = localStorage.getItem(wpArticlesCacheKey);
    if (!raw) {
      return mapEmpty();
    }

    const parsed = JSON.parse(raw);
    const articles: WpArticle[] = Array.isArray(parsed?.data) ? parsed.data : [];
    const articlesById = new Map<number, WpArticle>();

    articles.forEach((post) => {
      if (post && typeof post.id === "number") {
        articlesById.set(post.id, post);
      }
    });

    Object.entries(wpArticleIdsMap).forEach(([pageKey, locales]) => {
      result[pageKey] = {};
      Object.entries(locales).forEach(([locale, idOrStr]) => {
        const id = typeof idOrStr === "number" ? idOrStr : Number(idOrStr);
        result[pageKey][locale] = articlesById.get(id) ?? null;
      });
    });
  } catch {
    return mapEmpty();
  }

  return result;
}

export function resolveArticleFromCache(
  pageKey: string,
  locale: string,
  articles: ArticlesMap = buildArticlesMapFromCache(),
): WpArticle | null {
  return articles[pageKey]?.[locale] ?? articles[pageKey]?.ro ?? null;
}