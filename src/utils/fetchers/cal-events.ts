import {parseCalEvents} from "@/components/Calendar/events";

export async function fetchCalEvents(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load events from ${url}`);
  }
  return parseCalEvents(await response.json());
}