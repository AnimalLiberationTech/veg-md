import {locales} from "@/constants";

export function renderUrls(value: string) {
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

export type CalEvent = {
  start_iso: string;
  end_iso: string;
  description: string;
  location?: string;
  summary: string;
};

function isCalEvent(value: unknown): value is CalEvent {
  return Boolean(
    value &&
    typeof value === "object" &&
    typeof (value as CalEvent).start_iso === "string" &&
    typeof (value as CalEvent).end_iso === "string" &&
    typeof (value as CalEvent).description === "string" &&
    typeof (value as CalEvent).summary === "string",
  );
}

export function parseCalEvents(value: unknown): CalEvent[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isCalEvent).sort((left, right) => {
    return new Date(left.start_iso).getTime() - new Date(right.start_iso).getTime();
  });
}

type CalendarLocaleCode = Uppercase<(typeof locales)[number]["code"]>;
const multilingualTagPattern = /\[\s*RO\s*\/\s*RU(?:\s*\/\s*EN)?\s*]/i;
const sectionSeparatorPattern = /-{5}(?:\s|&nbsp;|<[^>]+>)*(RO|RU|EN)\s*:/gi;
const calendarLocaleCodeByLocale = Object.fromEntries(
  locales.map(({code}) => [code, code.toUpperCase()]),
) as Record<(typeof locales)[number]["code"], CalendarLocaleCode>;
const defaultCalendarLocaleCode = calendarLocaleCodeByLocale.ro;

function toCalLocaleCode(locale: string): CalendarLocaleCode {
  const localeKey = locale.toLowerCase().split("-")[0] as (typeof locales)[number]["code"];
  return calendarLocaleCodeByLocale[localeKey] ?? defaultCalendarLocaleCode;
}

function stripCalSectionMarkers(value: string) {
  sectionSeparatorPattern.lastIndex = 0;
  return value.replace(sectionSeparatorPattern, "");
}

export function localizeCalDescription(description: string, locale: string) {
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

  const activeLocale = toCalLocaleCode(locale);
  const localizedSection = sections[activeLocale] || sections[defaultLocale] || "";

  return `${beforeTag}${stripCalSectionMarkers(localizedSection)}`;
}