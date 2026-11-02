import { defineRouting } from 'next-intl/routing';
import { defaultLocale, locales } from './config';

export const routing = defineRouting({
  locales,
  defaultLocale,
  // Always prefix, including the default locale: /uz/about, /ru/about, /en/about.
  // Predictable URLs are worth more than a marginally shorter default path.
  localePrefix: 'always',
  localeCookie: {
    name: 'meridian_locale',
    maxAge: 60 * 60 * 24 * 365,
  },
});

export type AppRouting = typeof routing;
