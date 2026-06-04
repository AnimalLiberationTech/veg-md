import {parseCalEvents} from "@/components/Calendar/events";

export function fetchCalEvents(url: string) {
  return async () => {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        return [];
      }

      return parseCalEvents(await response.json());
    } catch {
      return [];
    }
  };
}