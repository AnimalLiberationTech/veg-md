"use client";

import { useCallback } from "react";
import { usePathname } from "next/navigation";
import {
  trackSearch,
  trackFilterApply,
  trackEmptySearchResult,
  trackOutboundClick,
  trackSocialShare,
  trackFileDownload,
  trackError404,
} from "@/utils/telemetry";

/**
 * Hook providing telemetry event tracking helpers for client components
 * Automatically captures the current pathname for each event
 */
export function useTelemetryEvents() {
  const pathname = usePathname();

  const trackSearchEvent = useCallback(
    (searchTerm: string) => {
      trackSearch(pathname, searchTerm).catch(() => {
        // Silently fail
      });
    },
    [pathname]
  );

  const trackFilterEvent = useCallback(
    (filterType: string) => {
      trackFilterApply(pathname, filterType).catch(() => {
        // Silently fail
      });
    },
    [pathname]
  );

  const trackEmptyResultEvent = useCallback(
    (searchTerm: string) => {
      trackEmptySearchResult(pathname, searchTerm).catch(() => {
        // Silently fail
      });
    },
    [pathname]
  );

  const trackOutboundClickEvent = useCallback(
    (url: string) => {
      trackOutboundClick(pathname, url).catch(() => {
        // Silently fail
      });
    },
    [pathname]
  );

  const trackShareEvent = useCallback(
    (platform: string) => {
      trackSocialShare(pathname, platform).catch(() => {
        // Silently fail
      });
    },
    [pathname]
  );

  const trackDownloadEvent = useCallback(
    (fileName: string) => {
      trackFileDownload(pathname, fileName).catch(() => {
        // Silently fail
      });
    },
    [pathname]
  );

  const trackNotFoundEvent = useCallback(
    (referrer?: string) => {
      trackError404(pathname, referrer).catch(() => {
        // Silently fail
      });
    },
    [pathname]
  );

  return {
    trackSearch: trackSearchEvent,
    trackFilter: trackFilterEvent,
    trackEmptyResult: trackEmptyResultEvent,
    trackOutboundClick: trackOutboundClickEvent,
    trackShare: trackShareEvent,
    trackDownload: trackDownloadEvent,
    trackNotFound: trackNotFoundEvent,
  };
}

