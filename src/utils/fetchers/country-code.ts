import {countryCodeUrl} from "@/constants";

export async function fetchCountryCode():Promise<string | null> {
  const response = await fetch(countryCodeUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch country code from ${countryCodeUrl}`);
  }
  const data = await response.json();
  return data.country_code.toUpperCase() || null;
}