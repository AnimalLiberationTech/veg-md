import Image from "next/image";
import Breadcrumb from "@/components/Common/Breadcrumb";
import ActivitiesCalendar from "@/components/Community/ActivitiesCalendar";
import CalendarEventDescription from "@/components/Community/CalendarEventDescription";
import {gCalUrl, locales, supportedLocales, uvmEmail} from "@/constants";
import {Metadata} from "next";
import {getTranslations} from "next-intl/server";
import {getPageMetadata} from "@/utils/metadata";
import {JSX} from "react";
import PhotoCredit from "@/components/Common/PhotoCredit";
import {sanitizeWpArticleHtml} from "@/utils/wp-article-sanitize";
import {ExpandedEventDescriptionProvider} from "@/components/Community/expanded-event-description-context";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  return getPageMetadata(locale, "activitiesPage");
}

export function generateStaticParams() {
  return supportedLocales.map((locale) => ({locale}));
}

type ActivityLink = {
  type: "website" | "cal" | "telegram" | "email" | "github";
  href: string;
  label: string;
};

type CalendarEvent = {
  start_iso: string;
  end_iso: string;
  description: string;
  location?: string;
  summary: string;
};

type CalendarLocaleCode = Uppercase<(typeof locales)[number]["code"]>;

const calendarFeedUrl = `${gCalUrl}?cal=community&days=30`;
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

function normalizeCalendarText(value: string) {
  return value.replace(/\\,/g, ",");
}

function normalizeCalendarDescription(value: string) {
  return normalizeCalendarText(value)
    .replace(/\\n\\n/g, "<br><br>")
    .replace(/\\n/g, "<br>");
}

function linkifyCalendarUrls(value: string) {
  const tagSplitPattern = /(<[^>]+>)/g;
  const urlPattern = /(^|[\s(])(https?:\/\/[^\s<>"']+)/g;
  const maxLabelLength = 56;
  let isInsideAnchor = false;

  return value
    .split(tagSplitPattern)
    .map((part) => {
      if (part.startsWith("<")) {
        const lowerPart = part.toLowerCase();

        if (/^<a\b/.test(lowerPart)) {
          isInsideAnchor = true;
        } else if (/^<\/a\b/.test(lowerPart)) {
          isInsideAnchor = false;
        }

        return part;
      }

      if (isInsideAnchor) {
        return part;
      }

      return part.replace(urlPattern, (_, prefix: string, rawUrl: string) => {
        const href = rawUrl.replace(/[),.;!?]+$/g, "");
        const suffix = rawUrl.slice(href.length);
        const displayText = href.length > maxLabelLength ? `${href.slice(0, maxLabelLength - 1)}…` : href;

        return `${prefix}<a href="${href}" target="_blank" rel="noopener noreferrer">${displayText}</a>${suffix}`;
      });
    })
    .join("");
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

function isCalendarEvent(value: unknown): value is CalendarEvent {
  return Boolean(
    value &&
      typeof value === "object" &&
      typeof (value as CalendarEvent).start_iso === "string" &&
      typeof (value as CalendarEvent).end_iso === "string" &&
      typeof (value as CalendarEvent).description === "string" &&
      typeof (value as CalendarEvent).summary === "string",
  );
}

function parseCalendarEvents(value: unknown): CalendarEvent[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isCalendarEvent).sort((left, right) => {
    return new Date(left.start_iso).getTime() - new Date(right.start_iso).getTime();
  });
}


function formatCalendarDateRange(locale: string, startIso: string, endIso: string) {
  const start = new Date(startIso);
  const end = new Date(endIso);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return normalizeCalendarText(startIso);
  }

  const dateFormatter = new Intl.DateTimeFormat(locale, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const timeFormatter = new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });

  const sameDay = start.toDateString() === end.toDateString();

  if (sameDay) {
    return `${dateFormatter.format(start)} · ${timeFormatter.format(start)} – ${timeFormatter.format(end)}`;
  }

  return `${dateFormatter.format(start)} · ${timeFormatter.format(start)} – ${dateFormatter.format(end)} · ${timeFormatter.format(end)}`;
}

async function loadCalendarEvents() {
  try {
    const isDev = process.env.NODE_ENV === "development";
    const response = await fetch(calendarFeedUrl, {
      next: {revalidate: isDev ? 300 : 3600},
    });

    if (!response.ok) {
      return [];
    }

    return parseCalendarEvents(await response.json());
  } catch {
    return [];
  }
}

const linkIconByType: Record<ActivityLink["type"], JSX.Element> = {
  website: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
    </svg>
  ),
  cal: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 10h18" />
    </svg>
  ),
  telegram: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M22 3 11 13" />
      <path d="M22 3 15 21l-4-8-8-4Z" />
    </svg>
  ),
  email: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
    </svg>
  ),
};

const ActivitiesPage = async ({params}: Props) => {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: "activitiesPage"});
  const calendarEvents = await loadCalendarEvents();

  const activities = [
    {
      title: t("streetOutreachTitle"),
      description: t("streetOutreachDescription"),
      image: "/images/activities/3MMC-Chisinau-2025.jpg",
      alt: t("streetOutreachImageAlt"),
      links: [
        {type: "website", href: "https://3minutes.wtf/viata", label: t("learnMore")},
        {type: "cal", href: "https://calendar.google.com/calendar/event?action=TEMPLATE&tmeid=cWdyMmdqNTQzY2wwazhhYWtycG90ZmJyNWtfMjAyNjA0MTFUMTEwMDAwWiBtb2xkb3ZhdmVnYW5hQG0&tmsrc=moldovavegana%40gmail.com&scp=ALL", label: "Google Calendar"},
      ],
    },
    {
      title: t("picnicsTitle"),
      description: t("picnicsDescription"),
      image: "/images/activities/picnic-Chisinau-2025.jpg",
      alt: t("picnicsImageAlt"),
      links: [
        {type: "telegram", href: "https://t.me/veganmoldova/1751", label: t("telegramLink")},
      ]
    },
    {
      title: t("digitalProjectsTitle"),
      description: t("digitalProjectsDescription"),
      image: "/images/activities/pexels-lorencastillo-9213879.jpg",
      creditLabel: "Photo by Loren Castillo",
      creditHref: "http://www.lorencastillophotography.com/",
      alt: t("digitalProjectsImageAlt"),
      links: [
        {type: "telegram", href: "https://t.me/veganmoldova/3690", label: t("telegramLink")},
        {type: "github", href: "https://github.com/AnimalLiberationTech", label: "GitHub"},
      ]
    },
    {
      title: t("otherActivitiesTitle"),
      description: t("otherActivitiesDescription"),
      image: "/images/activities/pexels-arthousestudio-4589510.jpg",
      alt: t("otherActivitiesImageAlt"),
      creditLabel: "Photo by ArtHouse Studio",
      creditHref: "https://www.pexels.com/@arthousestudio/",
      links: [
        {type: "telegram", href: "https://t.me/veganmoldova/1751", label: t("telegramLink")},
        {type: "email", href: uvmEmail, label: "e-mail"},
      ]
    },
  ];

  return (
    <>
      <Breadcrumb
        pageName={t("title")}
        description={t("description")}
        homeHref={`/${locale}`}
      />
      <section className="pt-12 pb-16">
        <div className="container">
          <ActivitiesCalendar
            calendarContent={
              <div className="space-y-4">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-black dark:text-white">
                    {t("calendar")}
                  </h2>
                </div>

                <div className="space-y-4">
                  {calendarEvents.length > 0 ? (
                    <ExpandedEventDescriptionProvider>
                      {calendarEvents.map((event) => {
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
            }
            openLabel={t("calendarOpen")}
            closeLabel={t("calendarClose")}
            mobileAlwaysVisible
          >
            <div className="space-y-8">
              {activities.map((activity) => (
                <article
                  key={activity.title}
                  className="overflow-hidden rounded-sm border border-dark bg-white shadow-three dark:border-white/10 dark:bg-black dark:shadow-none"
                >
                  <div className="grid gap-0 lg:grid-cols-[minmax(0,480px)_minmax(0,1fr)]">
                    <div className="relative min-h-72 w-full">
                      <Image
                        src={activity.image}
                        alt={activity.alt}
                        fill
                        className="object-cover object-center"
                      />
                      {activity.creditLabel && activity.creditHref ? (
                        <PhotoCredit
                          creditLabel={activity.creditLabel}
                          creditHref={activity.creditHref}
                        />
                      ) : null}
                    </div>
                    <div className="space-y-4 p-6 md:p-8">
                      <h2 className="text-2xl font-bold text-black dark:text-white">
                        {activity.title}
                      </h2>
                      <p className="text-body-color text-base leading-relaxed font-medium">
                        {activity.description}
                      </p>
                      {activity.links.length > 0 ? (
                        <div className="flex flex-wrap gap-3 pt-1">
                          {activity.links.map((link: ActivityLink) => {
                            const isEmail = link.type === "email";
                            const href = isEmail ? `mailto:${link.href}` : link.href;

                            return (
                              <a
                                key={link.href}
                                href={href}
                                target={isEmail ? undefined : "_blank"}
                                rel={isEmail ? undefined : "noopener noreferrer"}
                                className="inline-flex items-center gap-2 rounded-sm border border-primary/20 px-3 py-1.5 text-sm font-semibold text-primary transition hover:border-primary/40 hover:bg-primary/5"
                              >
                                {linkIconByType[link.type]}
                                <span>{link.label}</span>
                              </a>
                            );
                          })}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </ActivitiesCalendar>
        </div>
      </section>
    </>
  );
};

export default ActivitiesPage;
