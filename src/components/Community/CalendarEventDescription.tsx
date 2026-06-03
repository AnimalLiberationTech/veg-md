"use client";

import {useTranslations} from "next-intl";
import {useMemo} from "react";
import {useExpandedEventDescription} from "@/components/Community/expanded-event-description-context";
import {stripHtmlTags} from "@/utils/text";

type Props = {
  html: string;
  eventId: string;
};

const CalendarEventDescription = ({html, eventId}: Props) => {
  const t = useTranslations("resources");
  const {expandedEventId, setExpandedEventId} = useExpandedEventDescription();
  const isExpanded = expandedEventId === eventId;

  const shouldShowToggle = useMemo(() => {
    const plainText = stripHtmlTags(html);
    return plainText.length > 180;
  }, [html]);

  return (
    <div className="mt-3">
      <div
        className={`text-body-color space-y-3 text-sm leading-relaxed [&_a]:text-primary [&_a]:underline [&_p]:mb-3 [&_br]:block ${!isExpanded ? "line-clamp-3" : ""}`}
        dangerouslySetInnerHTML={{__html: html}}
      />
      {shouldShowToggle ? (
        <button
          type="button"
          onClick={() => setExpandedEventId((prev) => (prev === eventId ? null : eventId))}
          className="mt-3 inline-flex items-center text-sm font-semibold text-primary transition-colors hover:text-primary/80"
        >
          {isExpanded ? t("viewLess") : t("viewMore")}
          <svg
            className={`ml-2 h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      ) : null}
    </div>
  );
};

export default CalendarEventDescription;
