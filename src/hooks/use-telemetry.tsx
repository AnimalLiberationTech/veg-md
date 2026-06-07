"use client";

import {useEffect, useRef, useState} from "react";
import { usePathname } from "next/navigation";
import {
  trackPageView,
  trackScroll,
  trackTimeOnPage,
  trackJsError,
} from "@/utils/telemetry";
import {getOrFetchLocalCache, writeLocalCache} from "@/cache/local-cache";
import {countryCodeCacheKey, countryCodeUrl} from "@/constants";
import {fetchCountryCode} from "@/utils/fetchers/country-code";

/**
 * Hook for automatic telemetry tracking
 * - Tracks page views on route change
 * - Tracks scroll depth (25%, 50%, 75%, 90%)
 * - Tracks time spent on page
 * - Captures global JS errors
 */
export function useTelemetry() {
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const pathname = usePathname();
  const pageStartTime = useRef<number | null>(null);
  const scrollThresholdsReached = useRef<Set<number>>(new Set());

  // Fetch country code once on mount
  useEffect(() => {
    let isCancelled = false;

    const fetchCountry = async () => {
      if (process.env.NODE_ENV !== "production") {
        console.log("[Telemetry] useEffect fetchCountry starting");
      }
      try {
        const code: string = await getOrFetchLocalCache(
          countryCodeCacheKey,
          () => fetchCountryCode(countryCodeUrl)
        );

        if (process.env.NODE_ENV !== "production") {
          console.log("[Telemetry] country code data received:", code);
        }

        if (!isCancelled) {
          setCountryCode(code);
        }
      } catch (err) {
        if (countryCode) {
          writeLocalCache(countryCodeCacheKey, countryCode);
        }
      }
    };

    void fetchCountry();

    return () => {
      isCancelled = true;
    };
  }, [countryCode]);

  // Track page view on mount and route change
  useEffect(() => {
    trackPageView(pathname).catch(() => {
      // Silently fail — don't break the app on telemetry errors
    });

    // Reset for new page
    pageStartTime.current = Date.now();
    scrollThresholdsReached.current.clear();

    return () => {
      // Track time on page before leaving
      if (pageStartTime.current !== null) {
        const timeSpent = (Date.now() - pageStartTime.current) / 1000;
        if (timeSpent > 1) {
          // Only track if user spent at least 1 second on page
          trackTimeOnPage(pathname, timeSpent).catch(() => {
            // Silently fail
          });
        }
      }
    };
  }, [pathname]);

  // Track scroll events
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      const pageHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      const scrollTop = window.scrollY;
      const scrollableHeight = pageHeight - viewportHeight;

      if (scrollableHeight <= 0) return; // Can't scroll

      const scrollPercent = (scrollTop / scrollableHeight) * 100;

      // Check thresholds: 25%, 50%, 75%, 90%
      const thresholds = [25, 50, 75, 90];
      for (const threshold of thresholds) {
        if (
          scrollPercent >= threshold &&
          !scrollThresholdsReached.current.has(threshold)
        ) {
          scrollThresholdsReached.current.add(threshold);
          trackScroll(pathname, threshold as 25 | 50 | 75 | 90).catch(() => {
            // Silently fail
          });
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  // Track global JS errors
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleError = (event: ErrorEvent) => {
      trackJsError(pathname, event.message, event.error?.stack).catch(
        () => {
          // Silently fail
        }
      );
    };

    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, [pathname]);
}

