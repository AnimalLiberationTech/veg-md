export function normalizeCalendarText(value: string) {
  return value.replace(/\\,/g, ",");
}

export function normalizeCalendarDescription(value: string) {
  return normalizeCalendarText(value)
    .replace(/\\n\\n/g, "<br><br>")
    .replace(/\\n/g, "<br>");
}

export function linkifyCalendarUrls(value: string) {
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

function convertToChisinauTime(isoString: string): Date {
  const date = new Date(isoString);
  return new Date(
    date.toLocaleString("en-US", {timeZone: "Europe/Bucharest"}),
  );
}

export function formatCalendarDateRange(locale: string, startIso: string, endIso: string) {
  const start = convertToChisinauTime(startIso);
  const end = convertToChisinauTime(endIso);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return normalizeCalendarText(startIso);
  }

  const dateFormatter = new Intl.DateTimeFormat(locale, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "Europe/Bucharest",
  });
  const timeFormatter = new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Bucharest",
  });

  const sameDay = start.toDateString() === end.toDateString();

  if (sameDay) {
    return `${dateFormatter.format(start)} · ${timeFormatter.format(start)} – ${timeFormatter.format(end)}`;
  }

  return `${dateFormatter.format(start)} · ${timeFormatter.format(start)} – ${dateFormatter.format(end)} · ${timeFormatter.format(end)}`;
}