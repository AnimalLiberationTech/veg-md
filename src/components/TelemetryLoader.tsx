"use client";

import { useTelemetry } from "@/hooks/use-telemetry";

/**
 * Client-side telemetry loader
 * Automatically tracks page views, scroll events, time on page, and JS errors
 */
export default function TelemetryLoader(): null {
  useTelemetry();
  return null;
}

