export async function fetchCountryCode(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch country code from ${url}`);
  }
  const data = await response.json();
  return data?.country_code || null;
}