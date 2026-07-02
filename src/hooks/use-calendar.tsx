"use client";

import {useEffect, useState} from "react";
import {gCalCacheKey, gCalCommunityUrl} from "@/constants";
import {getOrFetchLocalCache, writeLocalCache} from "@/cache/local-cache";
import {fetchCalEvents} from "@/utils/fetchers/cal-events";
import {CalEvent} from "@/types/calendar";

export function useCalendar(initialEvents: CalEvent[], useCalendarCache = true) {
  const [events, setEvents] = useState<CalEvent[]>(initialEvents);

  useEffect(() => {
    let isCancelled = false;

    const loadEvents = async () => {
      try {
        const data = useCalendarCache
          ? await getOrFetchLocalCache<CalEvent[]>(
              gCalCacheKey,
              () => fetchCalEvents(gCalCommunityUrl),
            )
          : await fetchCalEvents(gCalCommunityUrl);

        if (!isCancelled) {
          setEvents(data);
        }
      } catch {
        // use initialEvents directly instead of the 'events' state variable.
        if (initialEvents && initialEvents.length > 0) {
          writeLocalCache(gCalCacheKey, initialEvents);
        }
      }
    };

    void loadEvents();

    return () => {
      isCancelled = true;
    };
  }, [initialEvents, useCalendarCache]); // don't use 'events' in the dependency array

  return events;
}
