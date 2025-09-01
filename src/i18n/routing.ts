import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'ro', 'ru'],  // supported locales
  defaultLocale: 'ro',  // when no locale matches
  localePrefix: 'as-needed',
  localeCookie: {
    maxAge: 60 * 60 * 24 * 365
  }
});