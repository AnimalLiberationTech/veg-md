"use client";

import {useCallback} from "react";
import {usePathname} from "next/navigation";
import {
  trackEmptySearchResult,
  trackError404,
  trackFileDownload,
  trackFilterApply,
  trackOutboundClick,
  trackSearch,
  trackSocialShare,
} from "@/utils/telemetry";
import {useCountryCode} from "@/hooks/use-country-code";

/**
 * Hook providing telemetry event tracking helpers for client components
 * Automatically captures the current pathname for each event
 */
export function useTelemetryEvents() {
  const pathname = usePathname();
  const countryCode = useCountryCode();

  const trackSearchEvent = useCallback(
    (searchTerm: string) => {
      trackSearch(pathname, searchTerm, countryCode).catch(() => {
        // Silently fail
      });
    },
    [countryCode, pathname]
  );

  const trackFilterEvent = useCallback(
    (filterType: string) => {
      trackFilterApply(pathname, filterType, countryCode).catch(() => {
        // Silently fail
      });
    },
    [countryCode, pathname]
  );

  const trackEmptyResultEvent = useCallback(
    (searchTerm: string) => {
      trackEmptySearchResult(pathname, searchTerm, countryCode).catch(() => {
        // Silently fail
      });
    },
    [countryCode, pathname]
  );

  const trackOutboundClickEvent = useCallback(
    (url: string) => {
      trackOutboundClick(pathname, url, countryCode).catch(() => {
        // Silently fail
      });
    },
    [countryCode, pathname]
  );

  const trackShareEvent = useCallback(
    (platform: string) => {
      trackSocialShare(pathname, platform, countryCode).catch(() => {
        // Silently fail
      });
    },
    [countryCode, pathname]
  );

  const trackDownloadEvent = useCallback(
    (fileName: string) => {
      trackFileDownload(pathname, fileName, countryCode).catch(() => {
        // Silently fail
      });
    },
    [countryCode, pathname]
  );

  const trackNotFoundEvent = useCallback(
    (referrer?: string) => {
      trackError404(pathname, countryCode, referrer).catch(() => {
        // Silently fail
      });
    },
    [countryCode, pathname]
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

