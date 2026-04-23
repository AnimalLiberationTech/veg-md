import { decode } from "html-entities";

type WordPressPage = {
  title?: { rendered?: string };
  content?: { rendered?: string };
};

export type RoPlanetArticle = {
  title: string;
  contentHtml: string;
};

const UVEM_WP_API_URL =
  "http://uvem.org/wp-json/wp/v2/posts?include=25";

function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, "").trim();
}

function removeScriptTags(input: string): string {
  return input.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
}

export async function getRoPlanetArticle(): Promise<RoPlanetArticle | null> {
  try {
    const response = await fetch(UVEM_WP_API_URL, {
      cache: "force-cache",
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      return null;
    }

    const pages = (await response.json()) as WordPressPage[];
    const page = pages?.[0];
    const title = decode(stripHtml(page?.title?.rendered ?? ""));
    const contentHtml = removeScriptTags(page?.content?.rendered ?? "");

    if (!title || !contentHtml) {
      return null;
    }

    return { title, contentHtml };
  } catch {
    return null;
  }
}
