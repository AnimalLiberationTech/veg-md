"use client";

import {useEffect, useState} from "react";
import {gCalCacheKey, gCalUrl} from "@/constants";
import {getOrFetchLocalCache, writeLocalCache} from "@/cache/local-cache";
import {fetchCalEvents} from "@/utils/fetchers/cal-events";
import {CalEvent} from "@/types/calendar";

export function useCalendar(initialEvents: CalEvent[]) {
  const [events, setEvents] = useState<CalEvent[]>(initialEvents);

  useEffect(() => {
    let isCancelled = false;

    const loadEvents = async () => {
      try {
        const url = `${gCalUrl}?cal=community&days=30`;
        const data = await getOrFetchLocalCache<CalEvent[]>(
          gCalCacheKey,
          () => fetchCalEvents(url),
        );
        if (!isCancelled) {
          setEvents(data);
        }
      } catch {
        // Silently ignore fetch failures, falling back to initialEvents.
        // To prevent spamming the endpoint when offline/CORS-blocked,
        // we populate the cache with the server-provided initialEvents.
        if (events && events.length > 0) {
          writeLocalCache(gCalCacheKey, events);
        }
      }
    };

    void loadEvents();

    return () => {
      isCancelled = true;
    };
  }, [events, initialEvents]);

  return events;
}