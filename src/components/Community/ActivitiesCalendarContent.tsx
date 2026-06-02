"use client";

import useCalendarEvents from "@/hooks/use-calendar-events";
import {formatCalendarDateRange, linkifyCalendarUrls, normalizeCalendarDescription, normalizeCalendarText} from "@/utils/calendar";
import {ExpandedEventDescriptionProvider} from "@/components/Community/expanded-event-description-context";
import CalendarEventDescription from "@/components/Community/CalendarEventDescription";
import {sanitizeWpArticleHtml} from "@/utils/wp-article-sanitize";
import {locales} from "@/constants";
import {useTranslations} from "next-intl";

type CalendarLocaleCode = Uppercase<(typeof locales)[number]["code"]>;

const multilingualTagPattern = /\[\s*RO\s*\/\s*RU(?:\s*\/\s*EN)?\s*]/i;
const sectionSeparatorPattern = /-{5}(?:\s|&nbsp;|<[^>]+>)*(RO|RU|EN)\s*:/gi;
const calendarLocaleCodeByLocale = Object.fromEntries(
  locales.map(({code}) => [code, code.toUpperCase()]),
) as Record<(typeof locales)[number]["code"], CalendarLocaleCode>;
const defaultCalendarLocaleCode = calendarLocaleCodeByLocale.ro;

function toCalendarLocaleCode(locale: string): CalendarLocaleCode {
  const localeKey = locale.toLowerCase().split("-")[0] as (typeof locales)[number]["code"];
  return calendarLocaleCodeByLocale[localeKey] ?? defaultCalendarLocaleCode;
}

function stripCalendarSectionMarkers(value: string) {
  sectionSeparatorPattern.lastIndex = 0;
  return value.replace(sectionSeparatorPattern, "");
}

function localizeCalendarDescription(description: string, locale: string) {
  const tagMatch = multilingualTagPattern.exec(description);

  if (!tagMatch || tagMatch.index === undefined) {
    return description;
  }

  const beforeTag = description.slice(0, tagMatch.index);
  const contentAfterTag = description.slice(tagMatch.index + tagMatch[0].length);
  sectionSeparatorPattern.lastIndex = 0;
  const separators = Array.from(contentAfterTag.matchAll(sectionSeparatorPattern));

  if (separators.length === 0) {
    return description;
  }

  const localeFromTag = (tagMatch[0].toUpperCase().match(/RO|RU|EN/g) || []) as CalendarLocaleCode[];
  const defaultLocale = localeFromTag[0] || "RO";
  const sections: Partial<Record<CalendarLocaleCode, string>> = {};

  const firstSeparatorIndex = separators[0].index || 0;
  sections[defaultLocale] = contentAfterTag.slice(0, firstSeparatorIndex);

  separators.forEach((match, index) => {
    const sectionLocale = match[1].toUpperCase() as CalendarLocaleCode;
    const sectionStart = (match.index || 0) + match[0].length;
    const sectionEnd =
      index + 1 < separators.length
        ? separators[index + 1].index || contentAfterTag.length
        : contentAfterTag.length;

    sections[sectionLocale] = contentAfterTag.slice(sectionStart, sectionEnd);
  });

  const activeLocale = toCalendarLocaleCode(locale);
  const localizedSection = sections[activeLocale] || sections[defaultLocale] || "";

  return `${beforeTag}${stripCalendarSectionMarkers(localizedSection)}`;
}

export default function ActivitiesCalendarContent({locale}: {locale: string}) {
  const {events, loading} = useCalendarEvents();
  const t = useTranslations("activitiesPage");

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-black dark:text-white">
          {t("calendar")}
        </h2>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-100 dark:bg-gray-800 rounded border border-dark/10 dark:border-white/10" />
            ))}
          </div>
        ) : events.length > 0 ? (
          <ExpandedEventDescriptionProvider>
            {events.map((event) => {
              const eventId = `${event.start_iso}-${event.summary}`;

              return (
                <article
                  key={eventId}
                  className="rounded-sm border border-dark/10 p-4 dark:border-white/10"
                >
                  <p className="text-sm font-semibold text-primary">
                    {formatCalendarDateRange(locale, event.start_iso, event.end_iso)}
                  </p>
                  <h3 className="mt-2 text-lg font-bold text-black dark:text-white">
                    {normalizeCalendarText(event.summary)}
                  </h3>
                  {event.location ? (
                    <p className="mt-2 inline-flex items-start gap-2 text-sm text-body-color">
                      <svg
                        viewBox="0 0 24 24"
                        className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                      >
                        <path d="M12 21s6-5.686 6-11a6 6 0 0 0-12 0c0 5.314 6 11 6 11Z" />
                        <circle cx="12" cy="10" r="2.5" />
                      </svg>
                      <span>{normalizeCalendarText(event.location)}</span>
                    </p>
                  ) : null}
                  {event.description ? (
                    <CalendarEventDescription
                      eventId={eventId}
                      html={sanitizeWpArticleHtml(
                        linkifyCalendarUrls(
                          localizeCalendarDescription(normalizeCalendarDescription(event.description), locale),
                        ),
                      )}
                    />
                  ) : null}
                </article>
              );
            })}
          </ExpandedEventDescriptionProvider>
        ) : (
          <div className="rounded-sm border border-dashed border-dark/20 p-4 text-sm text-body-color dark:border-white/10">
            {t("noUpcomingEvents")}
          </div>
        )}
      </div>
    </div>
  );
}
