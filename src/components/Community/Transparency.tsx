"use client";

import {useEffect, useState} from "react";
import {getOrFetchLocalCache} from "@/cache/local-cache";
import {gSheetDonationsCacheKey, gSheetExpensesCacheKey, gSheetUrl} from "@/constants";
import {CsvRow, fetchCsvData} from "@/utils/table";

interface TransparencyProps {
  donationTableHeader: string;
  expensesTableHeader: string;
  loading: string;
  noDataLabel: string;
  errorLoadingTables: string;
}

type TableData = {
  headers: string[];
  rows: CsvRow[];
};


async function loadCsvTable(cacheKey: string, url: string): Promise<TableData> {
  return getOrFetchLocalCache(cacheKey, fetchCsvData(url));
}

export default function Transparency({
  donationTableHeader,
  expensesTableHeader,
  loading,
  noDataLabel,
  errorLoadingTables,
}: TransparencyProps) {
  const [donations, setDonations] = useState<TableData>({headers: [], rows: []});
  const [expenses, setExpenses] = useState<TableData>({headers: [], rows: []});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const donationsUrl = `${gSheetUrl}?sheet=community-donations`;
  const expensesUrl = `${gSheetUrl}?sheet=community-expenses`;

  useEffect(() => {
    let isCancelled = false;

    const loadTables = async () => {
      try {
        const [donationsTable, expensesTable] = await Promise.all([
          loadCsvTable(gSheetDonationsCacheKey, donationsUrl),
          loadCsvTable(gSheetExpensesCacheKey, expensesUrl),
        ]);

        if (isCancelled) {
          return;
        }

        setDonations(donationsTable);
        setExpenses(expensesTable);
       } catch (err) {
        if (process.env.NODE_ENV !== "production") {
          console.error("Error loading transparency CSV data:", err);
        }

         if (!isCancelled) {
           setError(errorLoadingTables);
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
  }, [donationsUrl, expensesUrl, errorLoadingTables]);

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

