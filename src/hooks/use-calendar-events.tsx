"use client";

import {useCallback, useEffect, useState} from "react";
import {gCalCacheKey} from "@/constants";

export type CalendarEvent = {
  start_iso: string;
  end_iso: string;
  description: string;
  location?: string;
  summary: string;
};

export default function useCalendarEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);

  const refresh = useCallback(async () => {
    if (typeof window === "undefined") return;
    setLoading(true);
    try {
      const raw = localStorage.getItem(gCalCacheKey);
      const parsed = raw ? JSON.parse(raw) : null;
      const data = Array.isArray(parsed?.data) ? parsed.data : [];
      const safeEvents = data.filter((event: any): event is CalendarEvent =>
        Boolean(
          event &&
            typeof event.start_iso === "string" &&
            typeof event.end_iso === "string" &&
            typeof event.description === "string" &&
            typeof event.summary === "string" &&
            (typeof event.location === "undefined" || typeof event.location === "string"),
        ),
      );

      const sorted = [...safeEvents].sort((left, right) => {
        return new Date(left.start_iso).getTime() - new Date(right.start_iso).getTime();
      });
      setEvents(sorted);
    } catch (err) {
      console.error("[useCalendarEvents] Failed to load from cache:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setHasMounted(true);
    refresh().catch(() => {});

    const handleUpdate = (e?: Event) => {
      if (e instanceof StorageEvent && e.key !== gCalCacheKey) return;
      refresh().catch(() => {});
    };

    window.addEventListener("googleCalendarUpdated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("googleCalendarUpdated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [refresh]);

  return {events, loading, refresh, hasMounted};
}
