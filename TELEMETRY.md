# Telemetry Guide

This project uses a privacy-first, cookieless analytics system via Appwrite. The telemetry system is designed to be **non-intrusive** and doesn't impact app performance.

## Automatic Tracking

The following events are **automatically tracked** without any code changes needed:
- `page_view`: Fired on every page load and route change
- `scroll_25`, `scroll_50`, `scroll_75`, `scroll_90`: Fired when user scrolls down
- `time_on_page`: Fired when user leaves the page
- `js_error`: Fired when a JavaScript error occurs

No action needed — these are enabled via `TelemetryLoader` in `src/app/[locale]/client-layout.tsx`.

---

## Manual Event Tracking

For user-initiated actions, use the `useTelemetryEvents` hook in your client components:

### Example: Search Event

```typescript
"use client";
import { useState } from "react";
import { useTelemetryEvents } from "@/hooks/use-telemetry-events";

export default function SearchBox() {
  const { trackSearch, trackEmptyResult } = useTelemetryEvents();
  const [term, setTerm] = useState("");

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const results = performSearch(term);

    trackSearch(term);

    if (results.length === 0) {
      trackEmptyResult(term);
    }
  };

  return (
    <form onSubmit={handleSearch}>
      <input
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Search..."
      />
    </form>
  );
}
```

### Example: Category Filter

```typescript
"use client";
import { useTelemetryEvents } from "@/hooks/use-telemetry-events";

export default function CategoryFilter() {
  const { trackFilter } = useTelemetryEvents();

  const handleFilterChange = (category: string) => {
    trackFilter(category);
    // ... apply filter ...
  };

  return (
    <select onChange={(e) => handleFilterChange(e.target.value)}>
      <option value="vegan">Vegan</option>
      <option value="gluten-free">Gluten-Free</option>
    </select>
  );
}
```

### Example: Outbound Link

```typescript
"use client";
import { useTelemetryEvents } from "@/hooks/use-telemetry-events";

export default function ExternalLink({ href, label }) {
  const { trackOutboundClick } = useTelemetryEvents();

  const handleClick = () => {
    trackOutboundClick(href);
    // Click will proceed naturally to the link
  };

  return (
    <a href={href} onClick={handleClick} target="_blank" rel="noopener noreferrer">
      {label}
    </a>
  );
}
```

### Example: Social Share

```typescript
"use client";
import { useTelemetryEvents } from "@/hooks/use-telemetry-events";

export default function ShareButtons() {
  const { trackShare } = useTelemetryEvents();

  const handleShare = (platform: string) => {
    trackShare(platform);
    window.open(`https://${platform}.com/share?url=...`);
  };

  return (
    <>
      <button onClick={() => handleShare("telegram")}>Share on Telegram</button>
      <button onClick={() => handleShare("facebook")}>Share on Facebook</button>
    </>
  );
}
```

### Example: File Download

```typescript
"use client";
import { useTelemetryEvents } from "@/hooks/use-telemetry-events";

export default function DownloadButton({ fileName, url }) {
  const { trackDownload } = useTelemetryEvents();

  const handleDownload = () => {
    trackDownload(fileName);
    // Trigger download...
  };

  return (
    <button onClick={handleDownload}>
      Download {fileName}
    </button>
  );
}
```

### Example: 404 Page

```typescript
"use client";
import { useTelemetryEvents } from "@/hooks/use-telemetry-events";

export default function NotFoundPage() {
  const { trackNotFound } = useTelemetryEvents();

  useEffect(() => {
    trackNotFound();
  }, [trackNotFound]);

  return <div>Page not found</div>;
}
```

---

## Event API Reference

All events are imported from `@/utils/telemetry`:

```typescript
export async function trackPageView(path: string): Promise<void>
export async function trackScroll(path: string, percentageThreshold: 25 | 50 | 75 | 90): Promise<void>
export async function trackTimeOnPage(path: string, secondsSpent: number): Promise<void>
export async function trackSearch(path: string, searchTerm: string): Promise<void>
export async function trackFilterApply(path: string, filterType: string): Promise<void>
export async function trackEmptySearchResult(path: string, searchTerm: string): Promise<void>
export async function trackOutboundClick(path: string, destinationUrl: string): Promise<void>
export async function trackSocialShare(path: string, platform: string): Promise<void>
export async function trackFileDownload(path: string, fileName: string): Promise<void>
export async function trackError404(path: string, referrer?: string): Promise<void>
export async function trackJsError(path: string, errorMessage: string, stack?: string): Promise<void>
```

---

## Data Privacy

The telemetry system respects user privacy:

- **No persistent tracking ID**: Users are not tracked across sessions
- **No cookies**: No first-party or third-party cookies are set
- **Compact user agent**: Only browser name and OS are stored (e.g., `chrome/windows`), not the full string
- **Silent failures**: Telemetry errors never break the app
- **Optional country**: Geolocation is not enabled by default; can be added via IP service

---

## Appwrite Schema

Events are stored in Appwrite at `analytics` database, `user-actions` table:

| Field | Type | Examples |
|-------|------|----------|
| `site` | string | "veg-md" |
| `env` | enum | "dev", "prod" |
| `event_name` | enum | "page_view", "scroll_50", "outbound_click" |
| `path` | string | "/ro/community/activities/" |
| `referrer` | string | "https://google.com/search?q=vegan", null |
| `device_type` | enum | "mobile", "desktop" |
| `country` | string | "md", null |
| `metadata` | string | "search_term: tofu", "url: https://..." |
| `user_agent` | string | "chrome/windows" |

---

## Troubleshooting

### Events not showing up?
1. Check Appwrite credentials in `src/constants.ts`
2. Verify the Appwrite database/table exists with the correct schema
3. Check browser console for errors (dev mode logs failures)

### To disable telemetry in development
Wrap telemetry calls in environment checks:
```typescript
if (process.env.NODE_ENV === "production") {
  trackPageView(pathname);
}
```

### To extend with new event types
1. Add the new `EventName` type to `src/utils/telemetry.ts`
2. Create a new exported function (e.g., `trackCustomEvent`)
3. Call it from components or the hooks

