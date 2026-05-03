import {wpArticleIdsMap} from "@/pages";

export const CACHE_KEY = "wpArticlesCache";

export type Post = any;
export type ArticlesMap = Record<string, Record<string, Post | null>>;

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
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) {
      return mapEmpty();
    }

    const parsed = JSON.parse(raw);
    const posts: Post[] = Array.isArray(parsed?.posts) ? parsed.posts : [];
    const postsById = new Map<number, Post>();

    posts.forEach((post) => {
      if (post && typeof post.id === "number") {
        postsById.set(post.id, post);
      }
    });

    Object.entries(wpArticleIdsMap).forEach(([pageKey, locales]) => {
      result[pageKey] = {};
      Object.entries(locales).forEach(([locale, idOrStr]) => {
        const id = typeof idOrStr === "number" ? idOrStr : Number(idOrStr);
        result[pageKey][locale] = postsById.get(id) ?? null;
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
): Post | null {
  return articles[pageKey]?.[locale] ?? articles[pageKey]?.ro ?? null;
}

