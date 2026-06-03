import {fixDiacritics} from "@/utils/text";
import Papa from "papaparse";

export type CsvRow = Record<string, string | undefined>;

function normalizeCsvPayload(payload: string) {
  const trimmed = payload.trim();

  if (!trimmed) {
    return "";
  }

  try {
    const parsed = JSON.parse(trimmed);

    if (typeof parsed === "string") {
      return parsed;
    }
  } catch {
    // Keep the original payload when it is already raw CSV.
  }

  return trimmed;
}

export function fetchCsvData(url: string) {
  return async () => {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to load CSV from ${url}`);
    }

    const csvText = fixDiacritics(normalizeCsvPayload(await response.text()));
    const results = Papa.parse<CsvRow>(csvText, {
      header: true,
      skipEmptyLines: "greedy",
      transformHeader: (header) => header.trim(),
    });

    const headers = results.meta.fields;
    const rows = (results.data ?? []).filter((row) =>
      headers.some((header) => String(row[header] ?? "").trim().length > 0)
    );

    return {headers, rows};
  };
}