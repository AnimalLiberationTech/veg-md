"use client";

import { useTranslations } from "next-intl";
import {uvmEmail, uvmSite, veganMoldovaTgGroupUrl} from "@/constants";

const ContactCard = () => {
  const t = useTranslations("contactCard");
  const tGlobal = useTranslations("global");

  return (
    <div className="bg-white dark:bg-dark shadow-sm rounded-xl p-6 space-y-8">
      {/* Managed By */}
      <div className="flex items-start">
        <div className="shrink-0">
          <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {tGlobal("uvm")}
          </h3>
          <p className="mt-2">
            <a
              href={uvmSite}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
            >
              {uvmSite}
            </a>
          </p>
        </div>
      </div>

      {/* Telegram */}
      <div className="flex items-start border-t border-gray-100 dark:border-gray-700 pt-8">
        <div className="shrink-0">
          <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.35-.49.96-.75 3.78-1.65 6.31-2.74 7.58-3.27 3.61-1.51 4.35-1.77 4.84-1.78.11 0 .35.03.5.16.13.1.17.24.18.33.01.06.02.19.01.29z" />
            </svg>
          </div>
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {t("telegram")}
          </h3>
          <p className="mt-2">
            <a
              href={veganMoldovaTgGroupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
            >
              {veganMoldovaTgGroupUrl}
            </a>
          </p>
        </div>
      </div>

      {/* Email */}
      <div className="flex items-start border-t border-gray-100 dark:border-gray-700 pt-8">
        <div className="shrink-0">
          <div className="flex items-center justify-center h-12 w-12 rounded-md bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {t("writeUs")}
          </h3>
          <p className="mt-2">
            <a
              href={`mailto:${uvmEmail}`}
              className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 font-medium"
            >
              {uvmEmail}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactCard;

