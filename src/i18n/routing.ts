import {defineRouting} from 'next-intl/routing';
import {supportedLocales} from "@/constants";

export const routing = defineRouting({
  locales: supportedLocales,
  defaultLocale: 'ro',  // when no locale matches
  localePrefix: 'as-needed',
  localeCookie: {
    maxAge: 60 * 60 * 24 * 365
  }
});