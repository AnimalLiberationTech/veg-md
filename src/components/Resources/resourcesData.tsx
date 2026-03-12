import path from "path";
import sqlite3 from "sqlite3";
import {open} from "sqlite";
import {Feature, ResourceLink} from "@/types/feature";

export async function getResourcesData(locale: string): Promise<Feature[]> {
  const db = await open({
    filename: path.join(process.cwd(), "data", "resources.sqlite3"),
    driver: sqlite3.Database,
  });

  try {
    const resources = await db.all<
      Array<{
        id: number;
        title: string;
        description: string;
        image_url: string;
        type: string;
        slug: string;
        average_rating: number | null;
      }>
    >(
      `
      WITH ranked_localized_resources AS (
        SELECT
          lr.id,
          lr.resource_id,
          lr.locale,
          lr.title,
          lr.description,
          lr.image_url,
          lr.updated_at,
          ROW_NUMBER() OVER (
            PARTITION BY lr.resource_id, lr.locale
            ORDER BY
              CASE
                WHEN lr.method = 'voiceover' THEN 0
                WHEN lr.method = 'subtitles' THEN 1
                ELSE 2
              END,
              lr.updated_at DESC,
              lr.id DESC
          ) AS row_rank
        FROM localized_resources lr
        WHERE lr.deleted_at IS NULL
          AND lr.locale = ?
      )
      SELECT
        rlr.id,
        rlr.title,
        rlr.description,
        COALESCE(rlr.image_url, r.image_url) AS image_url,
        r.type AS type,
        r.slug,
        COALESCE(AVG(lrr.rating), 0) AS average_rating
      FROM ranked_localized_resources rlr
      INNER JOIN resources r ON r.id = rlr.resource_id
      LEFT JOIN localized_resource_ratings lrr ON lrr.localized_resource_id = rlr.id
      WHERE r.deleted_at IS NULL
        AND rlr.row_rank = 1
      GROUP BY rlr.id, rlr.title, rlr.description, rlr.image_url, r.image_url, r.type, r.slug
      ORDER BY average_rating DESC, rlr.id DESC
      LIMIT 6
      `,
      [locale],
    );

    if (resources.length === 0) {
      return [];
    }

    const links = await db.all<
      Array<{localized_resource_id: number; type: string; url: string}>
    >(
      `
      SELECT localized_resource_id, type, url
      FROM localized_resource_links
      WHERE deleted_at IS NULL
        AND localized_resource_id IN (${resources.map(() => "?").join(",")})
      `,
      resources.map((resource) => resource.id),
    );

    const linksByResource = new Map<number, ResourceLink[]>();
    for (const link of links) {
      const current = linksByResource.get(link.localized_resource_id) ?? [];
      current.push({type: link.type, url: link.url});
      linksByResource.set(link.localized_resource_id, current);
    }

    return resources.map((resource) => ({
      ...resource,
      links: linksByResource.get(resource.id) ?? [],
    }));
  } finally {
    await db.close();
  }
}

