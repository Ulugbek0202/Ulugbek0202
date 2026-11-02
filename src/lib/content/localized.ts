import { defaultLocale, type Locale } from '@/i18n/config';
import type { Localized, PartialLocalized } from '@/types';

/**
 * Resolves a localized value for the active locale.
 *
 * Fallback chain: requested locale → default locale → first available value.
 * Returns `null` (never `undefined`) when nothing is available, so callers can
 * decide between hiding the element and rendering a placeholder.
 */
export function resolve<T>(value: Localized<T> | PartialLocalized<T> | null | undefined, locale: Locale): T | null {
  if (!value) return null;

  const map = value as PartialLocalized<T>;
  const exact = map[locale];
  if (exact !== undefined && exact !== null) return exact;

  const fallback = map[defaultLocale];
  if (fallback !== undefined && fallback !== null) return fallback;

  for (const candidate of Object.values(map)) {
    if (candidate !== undefined && candidate !== null) return candidate;
  }

  return null;
}

/** Resolves a localized string, returning `fallback` when nothing is set. */
export function resolveText(
  value: Localized<string> | PartialLocalized<string> | null | undefined,
  locale: Locale,
  fallback = '',
): string {
  return resolve<string>(value, locale) ?? fallback;
}

/** Resolves a localized list, returning an empty array when nothing is set. */
export function resolveList(
  value: Localized<string[]> | PartialLocalized<string[]> | null | undefined,
  locale: Locale,
): string[] {
  return resolve<string[]>(value, locale) ?? [];
}

/** True when the locale has its own value rather than falling back. */
export function hasOwnTranslation(
  value: Localized<unknown> | PartialLocalized<unknown> | null | undefined,
  locale: Locale,
): boolean {
  if (!value) return false;
  return (value as PartialLocalized<unknown>)[locale] !== undefined;
}

/** Counts how many locales have their own value — used by the admin panel. */
export function translationCoverage(
  value: Localized<unknown> | PartialLocalized<unknown> | null | undefined,
): number {
  if (!value) return 0;
  return Object.values(value as PartialLocalized<unknown>).filter(
    (entry) => entry !== undefined && entry !== null,
  ).length;
}

/**
 * Builds a `Localized<string>` from a single value. Used when seeding records
 * from a form that only collected one language.
 */
export function fromSingle(value: string): Localized<string> {
  return { uz: value, ru: value, en: value };
}
