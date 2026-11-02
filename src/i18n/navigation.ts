import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

/**
 * Locale-aware navigation primitives.
 *
 * Always import `Link`, `useRouter` and friends from here rather than from
 * `next/link` / `next/navigation` — these preserve the active locale when
 * building hrefs and performing programmatic navigation.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
