"use client";

import {ReactNode, useState} from "react";

type Props = {
  children: ReactNode;
  calendarUrl: string;
  calendarTitle: string;
  openLabel: string;
  closeLabel: string;
  mobileAlwaysVisible?: boolean;
};

const ActivitiesCalendar = ({
  children,
  calendarUrl,
  calendarTitle,
  openLabel,
  closeLabel,
  mobileAlwaysVisible = false,
}: Props) => {
  const [isOpen, setIsOpen] = useState(true);
  const isVisibleOnAnyViewport = isOpen || mobileAlwaysVisible;
  const toggleWrapperClass = mobileAlwaysVisible ? "hidden justify-end md:flex" : "flex justify-end";

  return (
    <div className="space-y-8">
      <div className={toggleWrapperClass}>
        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          aria-expanded={isOpen}
          className="inline-flex items-center gap-2 rounded-lg border border-dark bg-white px-4 py-2 text-sm font-semibold text-dark transition hover:border-primary hover:text-primary dark:border-white/20 dark:bg-dark dark:text-white dark:hover:border-primary dark:hover:text-primary"
        >
          <span>{isOpen ? closeLabel : openLabel}</span>
          <span className={`transition-transform ${isOpen ? "rotate-180" : ""}`} aria-hidden="true">
            ▼
          </span>
        </button>
      </div>

      <div
        className={`grid gap-10 ${
          isOpen ? "grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]" : "grid-cols-1"
        }`}
      >
        <div className="min-w-0">{children}</div>

        {isVisibleOnAnyViewport ? (
          <aside
            className={`w-full h-125 md:h-150 rounded-sm border border-dark overflow-hidden shadow-three dark:shadow-none bg-white dark:bg-black ${
              mobileAlwaysVisible && !isOpen ? "lg:hidden" : ""
            }`}
          >
            <iframe
              src={calendarUrl}
              style={{border: 0}}
              width="100%"
              height="100%"
              title={calendarTitle}
            />
          </aside>
        ) : null}
      </div>
    </div>
  );
};

export default ActivitiesCalendar;

