import {NextRequest, NextResponse} from "next/server";
import {countryCodeUrl} from "@/constants";

type CachedCountry = {
  countryCode: string | null;
  expiresAt: number;
};

const COUNTRY_CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const countryCache = new Map<string, CachedCountry>();

function getClientIp(request: NextRequest): string | null {
  const headerCandidates = [
    request.headers.get("x-forwarded-for"),
    request.headers.get("x-real-ip"),
    request.headers.get("cf-connecting-ip"),
    request.headers.get("true-client-ip"),
  ];

  for (const headerValue of headerCandidates) {
    if (!headerValue) continue;

    const ip = headerValue.split(",")[0]?.trim();
    if (ip) return ip;
  }

  return null;
}

function getCachedCountry(ip: string): string | null | undefined {
  const cachedEntry = countryCache.get(ip);
  if (!cachedEntry) return undefined;

  if (cachedEntry.expiresAt <= Date.now()) {
    countryCache.delete(ip);
    return undefined;
  }

  return cachedEntry.countryCode;
}

function setCachedCountry(ip: string, countryCode: string | null): void {
  countryCache.set(ip, {
    countryCode,
    expiresAt: Date.now() + COUNTRY_CACHE_TTL_MS,
  });
}

export async function GET(request: NextRequest) {
  const clientIp = getClientIp(request);

  if (clientIp) {
    const cachedCountry = getCachedCountry(clientIp);

    if (cachedCountry !== undefined) {
      console.debug("[CountryCode API] cache hit:", { clientIp, cachedCountry });
      return NextResponse.json({ country_code: cachedCountry, cached: true });
    }

    console.debug("[CountryCode API] cache miss:", { clientIp });
  } else {
    console.debug("[CountryCode API] no client IP detected; skipping cache");
  }

  try {
    const upstreamUrl = clientIp
      ? `${countryCodeUrl}?ip=${encodeURIComponent(clientIp)}`
      : countryCodeUrl;

    const response = await fetch(upstreamUrl, {
      method: "GET",
      cache: "no-store",
      headers: clientIp
        ? {
            "x-forwarded-for": clientIp,
          }
        : undefined,
    });

    const rawBody = await response.text();

    if (!response.ok) {
      console.error("[CountryCode API] upstream response not ok:", {
        clientIp,
        status: response.status,
        statusText: response.statusText,
        rawBody,
      });

      return NextResponse.json(
        { country_code: null },
        { status: response.status },
      );
    }

    let parsedBody: unknown = rawBody;

    try {
      parsedBody = rawBody ? JSON.parse(rawBody) : null;
    } catch {
      // Keep the raw body if the upstream returns plain text.
    }

    const countryCode =
      typeof parsedBody === "string"
        ? parsedBody
        : parsedBody && typeof parsedBody === "object"
          ? (parsedBody as { country_code?: unknown; countryCode?: unknown; country?: unknown }).country_code ??
            (parsedBody as { country_code?: unknown; countryCode?: unknown; country?: unknown }).countryCode ??
            (parsedBody as { country_code?: unknown; countryCode?: unknown; country?: unknown }).country
          : null;

    const normalizedCountry =
      typeof countryCode === "string" ? countryCode.trim().toUpperCase() : null;

    if (clientIp && normalizedCountry) {
      setCachedCountry(clientIp, normalizedCountry);
    }

    console.debug("[CountryCode API] fetched country code:", {
      clientIp,
      rawBody,
      parsedBody,
      countryCode,
      normalizedCountry,
      cached: Boolean(clientIp && normalizedCountry),
    });

    return NextResponse.json({
      country_code: normalizedCountry,
      cached: false,
    });
  } catch (error) {
    console.error("[API] Failed to proxy country code:", error);
    return NextResponse.json({ country_code: null }, { status: 500 });
  }
}
