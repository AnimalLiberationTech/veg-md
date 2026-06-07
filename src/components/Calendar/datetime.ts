import {unescapeCommas} from "@/utils/text";

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
    return unescapeCommas(startIso);
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