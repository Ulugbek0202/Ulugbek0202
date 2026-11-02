import { Inter, Manrope } from 'next/font/google';

/**
 * Manrope drives the editorial display type: geometric, confident, and
 * distinctive at large sizes without feeling decorative.
 */
export const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-manrope',
  weight: ['400', '500', '600', '700', '800'],
  fallback: ['ui-sans-serif', 'system-ui', 'sans-serif'],
});

/**
 * Inter handles UI and long-form body copy: exceptional legibility at small
 * sizes and full Cyrillic coverage for the Russian locale.
 */
export const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
  fallback: ['ui-sans-serif', 'system-ui', 'sans-serif'],
});

export const fontVariables = `${manrope.variable} ${inter.variable}`;
