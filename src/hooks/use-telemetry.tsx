"use client";

import {useEffect, useRef} from "react";
import {usePathname} from "next/navigation";
import {trackJsError, trackPageView, trackScroll, trackTimeOnPage} from "@/utils/telemetry";
import {useCountryCode} from "@/hooks/use-country-code";

/**
 * Hook for automatic telemetry tracking
 * - Tracks page views on route change
 * - Tracks scroll depth (25%, 50%, 75%, 90%)
 * - Tracks time spent on a page
 * - Captures global JS errors
 */
export function useTelemetry() {
  const pathname = usePathname();
  const pageStartTime = useRef<number | null>(null);
  const scrollThresholdsReached = useRef<Set<number>>(new Set());

  // Fetch country code once on mount
  const countryCode = useCountryCode();

  // Track page view on mount and route change
  useEffect(() => {
    trackPageView(pathname, countryCode).catch(() => {
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
          trackTimeOnPage(pathname, timeSpent, countryCode).catch(() => {
            // Silently fail
          });
        }
      }
    };
  }, [countryCode, pathname]);

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
          trackScroll(
            pathname,
            threshold as 25 | 50 | 75 | 90,
            countryCode
          ).catch(() => {
            // Silently fail
          });
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [countryCode, pathname]);

  // Track global JS errors
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleError = (event: ErrorEvent) => {
      trackJsError(pathname, event.message, countryCode, event.error?.stack).catch(
        () => {
          // Silently fail
        }
      );
    };

    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, [countryCode, pathname]);
}

