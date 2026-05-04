/**
 * Builds a WordPress REST API posts URL
 * @param baseUrl - The base site URL (e.g., 'https://uvem.org')
 * @param includeIds - Single ID or array of IDs to include
 * @param fields - Optional array of fields to fetch (e.g., ['id', 'title', 'content', 'rendered'])
 * @returns The complete WordPress REST API URL
 */
export const buildWpApiPostsUrl = (
  baseUrl: string,
  includeIds: number | number[],
  fields?: string[]
): string => {
  const ids = Array.isArray(includeIds) ? includeIds.join(',') : String(includeIds);
  const normalizedBaseUrl = baseUrl.replace(/\/+$/, '');
  const url = new URL(`${normalizedBaseUrl}/wp-json/wp/v2/posts`);

  url.searchParams.set('include', ids);

  if (fields && fields.length > 0) {
    url.searchParams.set('_fields', fields.join(','));
  }

  return url.toString();
};

