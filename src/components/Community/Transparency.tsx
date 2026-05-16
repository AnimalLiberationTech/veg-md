"use client";

import {useEffect, useState} from "react";
import Papa from "papaparse";
import {getOrFetchLocalStorageCache} from "@/utils/local-storage-cache";

interface TransparencyProps {
  donationsUrl: string;
  expensesUrl: string;
  donationTableHeader: string;
  expensesTableHeader: string;
  loading: string;
  noDataLabel: string;
}

type CsvRow = Record<string, string | undefined>;

type TableData = {
  headers: string[];
  rows: CsvRow[];
};

const CSV_CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

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

function fixDiacritics(value: string) {
  if (!/[ÃÂÄÅ]/.test(value)) {
    return value;
  }

  try {
    const bytes = Uint8Array.from(value, (character) => character.charCodeAt(0) & 0xff);
    return new TextDecoder("utf-8").decode(bytes);
  } catch {
    return value;
  }
}

async function loadCsvTable(url: string, hideColumns: Set<string> = new Set()): Promise<TableData> {
  const cacheKey = `transparency-csv:${url}:${Array.from(hideColumns).sort().join("|")}`;

  return getOrFetchLocalStorageCache(cacheKey, CSV_CACHE_TTL_MS, async () => {
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

    const headers = (results.meta.fields ?? []).filter(
      (header) => header.trim().length > 0 && !hideColumns.has(header.trim())
    );
    const rows = (results.data ?? []).filter((row) =>
      headers.some((header) => String(row[header] ?? "").trim().length > 0)
    );

    return {headers, rows};
  });
}

export default function Transparency({
  donationsUrl,
  expensesUrl,
  donationTableHeader,
  expensesTableHeader,
  loading,
  noDataLabel,
}: TransparencyProps) {
  const [donations, setDonations] = useState<TableData>({headers: [], rows: []});
  const [expenses, setExpenses] = useState<TableData>({headers: [], rows: []});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const loadTables = async () => {
      try {
        const [donationsTable, expensesTable] = await Promise.all([
          loadCsvTable(donationsUrl), loadCsvTable(expensesUrl),
        ]);

        if (isCancelled) {
          return;
        }

        setDonations(donationsTable);
        setExpenses(expensesTable);
      } catch (err) {
        console.error("Error loading transparency CSV data:", err);

        if (!isCancelled) {
          setError("Error loading transparency data");
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadTables();

    return () => {
      isCancelled = true;
    };
  }, [donationsUrl, expensesUrl]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-body-color">{loading}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const renderTable = (tableData: TableData, title: string) => {
    if (tableData.headers.length === 0) {
      return null;
    }

    const {headers, rows} = tableData;

    return (
      <div key={title} className="overflow-hidden rounded-sm border border-dark/10 shadow-three dark:border-white/10 dark:shadow-none">
        <div className="bg-gray-100 px-6 py-4 dark:bg-gray-900">
          <h3 className="text-lg font-semibold text-black dark:text-white">
            {title}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark/10 bg-lighter dark:border-white/10 dark:bg-black/50">
                {headers.map((header) => (
                  <th
                    key={header}
                    className="px-4 py-3 text-left text-sm font-semibold text-black dark:text-white"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length > 0 ? (
                rows.map((row, idx) => (
                  <tr key={idx} className="border-b border-dark/10 last:border-b-0 dark:border-white/10">
                    {headers.map((header) => (
                      <td
                        key={`${idx}-${header}`}
                        className="px-4 py-3 text-sm text-body-color"
                      >
                        {row[header] || "-"}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-3 text-sm text-body-color" colSpan={headers.length}>
                    {noDataLabel}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {renderTable(donations, donationTableHeader)}
      {renderTable(expenses, expensesTableHeader)}
    </div>
  );
}

