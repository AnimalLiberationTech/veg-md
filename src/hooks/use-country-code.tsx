"use client";

import {useEffect, useState} from "react";
import {getOrFetchLocalCache, writeLocalCache} from "@/cache/local-cache";
import {countryCodeCacheKey} from "@/constants";
import {fetchCountryCode} from "@/utils/fetchers/country-code";

export function useCountryCode() {
  const [countryCode, setCountryCode] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const fetchCountry = async () => {
      if (process.env.NODE_ENV !== "production") {
        console.log("[Telemetry] useEffect fetchCountry starting");
      }
      try {
        const code: string = await getOrFetchLocalCache(
          countryCodeCacheKey,
          () => fetchCountryCode()
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

  return countryCode;
}