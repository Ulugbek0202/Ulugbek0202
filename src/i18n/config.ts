/**
 * Single source of truth for the site's localization.
 *
 * Uzbek is the default locale (the company's home market); Russian and English
 * are first-class alternatives. Every route is locale-prefixed so each language
 * has its own indexable URL space: /uz/..., /ru/..., /en/...
 */

export const locales = ['uz', 'ru', 'en'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'uz';

/** Display metadata for the language switcher. */
export const localeMeta: Record<
  Locale,
  { label: string; nativeLabel: string; short: string; htmlLang: string; dir: 'ltr' | 'rtl' }
> = {
  uz: { label: 'Uzbek', nativeLabel: "O'zbekcha", short: 'UZ', htmlLang: 'uz-Latn', dir: 'ltr' },
  ru: { label: 'Russian', nativeLabel: 'Русский', short: 'RU', htmlLang: 'ru', dir: 'ltr' },
  en: { label: 'English', nativeLabel: 'English', short: 'EN', htmlLang: 'en', dir: 'ltr' },
};

/** BCP-47 tags handed to Intl formatters. */
export const intlLocale: Record<Locale, string> = {
  uz: 'uz-Latn-UZ',
  ru: 'ru-RU',
  en: 'en-GB',
};

/** Open Graph locale identifiers. */
export const ogLocale: Record<Locale, string> = {
  uz: 'uz_UZ',
  ru: 'ru_RU',
  en: 'en_GB',
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}

/**
 * Pick the best locale from an Accept-Language header, falling back to the
 * default. Deliberately simple: exact tag first, then primary subtag.
 */
export function matchLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale;

  const ranked = acceptLanguage
    .split(',')
    .map((part) => {
      const [tag, q] = part.trim().split(';q=');
      return { tag: tag.trim().toLowerCase(), q: q ? Number.parseFloat(q) : 1 };
    })
    .filter((entry) => entry.tag && !Number.isNaN(entry.q))
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    if (isLocale(tag)) return tag;
    const primary = tag.split('-')[0];
    if (isLocale(primary)) return primary;
  }

  return defaultLocale;
}
