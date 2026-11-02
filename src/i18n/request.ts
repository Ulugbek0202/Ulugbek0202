import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { defaultLocale } from './config';
import { routing } from './routing';

/**
 * Loads the message catalogue for the active request.
 *
 * Catalogues are plain JSON under `src/messages`, statically imported so the
 * bundler can inline them per locale and keep the runtime cost at zero.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : defaultLocale;

  const messages = (await import(`../messages/${locale}.json`)).default;

  return {
    locale,
    messages,
    timeZone: 'Asia/Tashkent',
    now: new Date(),
    formats: {
      number: {
        compact: { notation: 'compact', maximumFractionDigits: 1 },
        integer: { maximumFractionDigits: 0 },
      },
      dateTime: {
        editorial: { year: 'numeric', month: 'long', day: 'numeric' },
        short: { year: 'numeric', month: '2-digit', day: '2-digit' },
      },
    },
    onError(error) {
      // Missing translations should be loud in development, silent in production
      // so a single absent key never takes down a page for visitors.
      if (process.env.NODE_ENV === 'development') {
        console.error('[i18n]', error.message);
      }
    },
    getMessageFallback({ namespace, key }) {
      return namespace ? `${namespace}.${key}` : key;
    },
  };
});
