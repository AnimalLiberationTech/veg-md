import { Client, ID, TablesDB } from "appwrite";
import { appwriteEndpoint, appwriteProjectId } from "@/constants";

const DATABASE_ID = "analytics";
const TABLE_ID = "user-actions";
const TELEMETRY_SITE = "veg-md";
const TELEMETRY_ENV = process.env.NODE_ENV === "production" ? "prod" : "dev";

// Lazy-initialize Appwrite client only in browser
let client: Client | null = null;
let tablesDB: TablesDB | null = null;

let cachedCountryCode: string | null = null;
let isFetchingCountry = false;

// Exported for testing purposes
export function _resetTelemetryCache() {
  cachedCountryCode = null;
  isFetchingCountry = false;
  client = null;
  tablesDB = null;
}

function initializeClient() {
  if (typeof window === "undefined") return false;
  if (client) return true;

  try {
    client = new Client()
      .setEndpoint(appwriteEndpoint)
      .setProject(appwriteProjectId);
    tablesDB = new TablesDB(client);
    return true;
  } catch (e) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[Telemetry] Failed to initialize Appwrite client:", e);
    }
    return false;
  }
}

export type EventName =
  | "page_view"
  | "scroll_25"
  | "scroll_50"
  | "scroll_75"
  | "scroll_90"
  | "time_on_page"
  | "site_search"
  | "filter_apply"
  | "empty_search_result"
  | "outbound_click"
  | "social_share"
  | "file_download"
  | "error_404"
  | "js_error";

export type DeviceType = "mobile" | "desktop" | null;

interface TelemetryPayload {
  event_name: EventName;
  path: string;
  referrer?: string | null;
  device_type?: DeviceType;
  country?: string | null;
  metadata?: string | null;
  user_agent?: string | null;
}

/**
 * Derive device type from navigator.userAgent
 * Returns "mobile" for common mobile patterns, "desktop" otherwise
 */
function getDeviceType(): DeviceType {
  if (typeof navigator === "undefined") return null;
  const ua = navigator.userAgent.toLowerCase();
  const isMobile =
    /mobile|android|iphone|ipod|blackberry|iemobile|opera mini/.test(ua);
  return isMobile ? "mobile" : "desktop";
}

/**
 * Extract the full referrer URL if present and valid, otherwise null.
 * Appwrite expects the `referrer` attribute to be a valid URL when provided.
 */
function getReferrerUrl(): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  try {
    const referrer = document.referrer;
    if (!referrer) return null;
    // Validate URL – if it's not a valid absolute URL, treat as null
    const parsed = new URL(referrer);
    return parsed.href || null;
  } catch {
    return null;
  }
}

/**
 * Get country code from a 3rd-party service
 */
async function getCountry(): Promise<string | null> {
  if (cachedCountryCode) return cachedCountryCode;
  if (isFetchingCountry) return null;

  try {
    isFetchingCountry = true;
    const response = await fetch("/api/country-code");
    if (!response.ok) {
      if (process.env.NODE_ENV === "development") {
        console.error(`[Telemetry] Failed to fetch country code: HTTP error! status: ${response.status}`);
      }
      return null;
    }
    const data = await response.json();
    cachedCountryCode = data.country_code || null;
    return cachedCountryCode;
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.error("[Telemetry] Failed to fetch country code:", e);
    }
    return null;
  } finally {
    isFetchingCountry = false;
  }
}

/**
 * Compact user agent representation
 * Stores just the browser and OS, not the full string for privacy
 */
function getCompactUserAgent(): string | null {
  if (typeof navigator === "undefined") return null;

  const ua = navigator.userAgent;
  const browserMatch =
    ua.match(/Chrome|Firefox|Safari|Edge|Opera/) || ["Unknown"];
  const osMatch = ua.match(/Windows|Mac|Linux|Android|iOS/) || ["Unknown"];

  return `${browserMatch[0]}/${osMatch[0]}`.toLowerCase();
}

/**
 * Core telemetry track function
 */
async function track(payload: TelemetryPayload): Promise<void> {
  if (typeof window === "undefined") {
    return;
  }

  if (!initializeClient() || !tablesDB) {
    return;
  }

  try {
    const country = await getCountry();

    await tablesDB.createRow({
      databaseId: DATABASE_ID,
      tableId: TABLE_ID,
      rowId: ID.unique(),
      data: {
        site: TELEMETRY_SITE,
        env: TELEMETRY_ENV,
        event_name: payload.event_name,
        path: payload.path,
        referrer: payload.referrer || null,
        device_type: payload.device_type || getDeviceType(),
        country: country || null,
        metadata: payload.metadata || null,
        user_agent: payload.user_agent || getCompactUserAgent(),
      },
    });
  } catch (e) {
    // Silently fail — don't let telemetry errors break the app
    if (process.env.NODE_ENV === "development") {
      console.error("[Telemetry] Track failed:", e);
    }
  }
}

/**
 * Track a page view
 */
export async function trackPageView(path: string): Promise<void> {
  return track({
    event_name: "page_view",
    path,
    referrer: getReferrerUrl(),
  });
}

/**
 * Track scroll depth
 */
export async function trackScroll(
  path: string,
  percentageThreshold: 25 | 50 | 75 | 90
): Promise<void> {
  return track({
    event_name: `scroll_${percentageThreshold}` as EventName,
    path,
  });
}

/**
 * Track time spent on page
 */
export async function trackTimeOnPage(
  path: string,
  secondsSpent: number
): Promise<void> {
  return track({
    event_name: "time_on_page",
    path,
    metadata: `seconds: ${Math.round(secondsSpent)}`,
  });
}

/**
 * Track site search
 */
export async function trackSearch(path: string, searchTerm: string): Promise<void> {
  return track({
    event_name: "site_search",
    path,
    metadata: `search_term: ${searchTerm}`,
  });
}

/**
 * Track filter application
 */
export async function trackFilterApply(
  path: string,
  filterType: string
): Promise<void> {
  return track({
    event_name: "filter_apply",
    path,
    metadata: `filter_type: ${filterType}`,
  });
}

/**
 * Track empty search result
 */
export async function trackEmptySearchResult(
  path: string,
  searchTerm: string
): Promise<void> {
  return track({
    event_name: "empty_search_result",
    path,
    metadata: `search_term: ${searchTerm}`,
  });
}

/**
 * Track outbound click
 */
export async function trackOutboundClick(
  path: string,
  destinationUrl: string
): Promise<void> {
  return track({
    event_name: "outbound_click",
    path,
    metadata: `url: ${destinationUrl}`,
  });
}

/**
 * Track social share
 */
export async function trackSocialShare(path: string, platform: string): Promise<void> {
  return track({
    event_name: "social_share",
    path,
    metadata: `platform: ${platform}`,
  });
}

/**
 * Track file download
 */
export async function trackFileDownload(
  path: string,
  fileName: string
): Promise<void> {
  return track({
    event_name: "file_download",
    path,
    metadata: `file: ${fileName}`,
  });
}

/**
 * Track 404 errors
 */
export async function trackError404(
  path: string,
  referrer?: string
): Promise<void> {
  const resolvedReferrer = referrer || "direct";

  return track({
    event_name: "error_404",
    path,
    referrer: resolvedReferrer,
    metadata: `referrer: ${resolvedReferrer}`,
  });
}

/**
 * Track JavaScript errors (global error handler)
 */
export async function trackJsError(
  path: string,
  errorMessage: string,
  stack?: string
): Promise<void> {
  return track({
    event_name: "js_error",
    path,
    metadata: `error: ${errorMessage}${stack ? " | " + stack.substring(0, 100) : ""}`,
  });
}
