"use client";

import {useEffect, useState} from "react";
import {bugReportUrl} from "@/constants";

type ClientBugMailerProps = {
  locale: string;
  pagePath: string;
  wpApiArticleUrl?: string;
};

type ReportStatus = "idle" | "sent" | "failed";

const LOG_PREFIX = "[ClientBugMailer]";
const RECENT_REPORT_WINDOW_MS = 30_000;
const recentReportAttempts = new Map<string, number>();

const getReportKey = (locale: string, pagePath: string, wpApiArticleUrl?: string) =>
  `${locale}:${pagePath}:${wpApiArticleUrl || ''}`;

const shouldSkipRecentReport = (reportKey: string, nowMs: number) => {
  const lastAttemptMs = recentReportAttempts.get(reportKey);
  return lastAttemptMs !== undefined && nowMs - lastAttemptMs < RECENT_REPORT_WINDOW_MS;
};

const normalizeError = (error: unknown) => {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return {
    name: "UnknownError",
    message: String(error),
  };
};

const parseResponseBody = async (response: Response) => {
  const responseText = await response.text();
  try {
    return responseText ? JSON.parse(responseText) : null;
  } catch {
    return responseText || null;
  }
};

const ClientBugMailer = ({ locale, pagePath, wpApiArticleUrl }: ClientBugMailerProps) => {
  const [status, setStatus] = useState<ReportStatus>("idle");

  useEffect(() => {
    const nowMs = Date.now();
    const reportKey = getReportKey(locale, pagePath, wpApiArticleUrl);

    // Prevent duplicate sends caused by client remounts (e.g. React Strict Mode in dev)
    if (shouldSkipRecentReport(reportKey, nowMs)) {
      return;
    }

    recentReportAttempts.set(reportKey, nowMs);

    const payload = {
      type: "connection error",
      path: pagePath,
      locale,
      url: wpApiArticleUrl,
      details: "UVEM.org WordPress article could not be fetched",
      ts: new Date().toISOString(),
      user_agent: navigator.userAgent,
    };

    const sendReport = async () => {
      try {
        const response = await fetch(bugReportUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        const responseBody = await parseResponseBody(response);


        if (!response.ok) {
          const responseDetails =
            responseBody === null
              ? ""
              : ` and body ${typeof responseBody === "string" ? responseBody : JSON.stringify(responseBody)}`;
          setStatus("failed");
          recentReportAttempts.delete(reportKey);
          console.warn(`${LOG_PREFIX} send-failed`, {
            error: {
              name: "HttpError",
              message: `Bug report endpoint failed with status ${response.status}${responseDetails}`,
            },
            locale,
            pagePath,
          });
          return;
        }

        setStatus("sent");
      } catch (error: unknown) {
        const normalizedError = normalizeError(error);

        // Cross-origin calls can fail in the browser before we can read a response.
        // Retry in no-cors mode to still dispatch a JSON payload.
        if (normalizedError.name === "TypeError") {
          try {
            await fetch(bugReportUrl, {
              method: "POST",
              mode: "no-cors",
              headers: {
                "Content-Type": "text/plain;charset=UTF-8",
              },
              body: JSON.stringify(payload),
            });

            setStatus("sent");
            return;
          } catch (fallbackError: unknown) {
            console.warn(`${LOG_PREFIX} send-fallback-failed`, {
              error: normalizeError(fallbackError),
              locale,
              pagePath,
            });
          }
        }

        setStatus("failed");
        recentReportAttempts.delete(reportKey);
        console.warn(`${LOG_PREFIX} send-failed`, {
          error: normalizedError,
          locale,
          pagePath,
        });
      }
    };

    void sendReport();
  }, [locale, pagePath, wpApiArticleUrl]);

  return (
    <>
      {process.env.NODE_ENV !== "production" && (
        <div className="mb-6 rounded-sm border border-yellow-300 bg-yellow-50 px-3 py-2 text-xs text-yellow-900 dark:border-yellow-600/30 dark:bg-yellow-900/20 dark:text-yellow-200">
          Bug mail status: {status}
        </div>
      )}
    </>
  );
};

export default ClientBugMailer;
