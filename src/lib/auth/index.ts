import 'server-only';

import { headers } from 'next/headers';
import type { AdminUser } from '@/types';
import {
  createSessionCookieValue,
  sessionCookieOptions,
  SESSION_COOKIE,
  verifyDemoCredentials,
  verifySupabaseCredentials,
} from './session';

export { SESSION_COOKIE, sessionCookieOptions } from './session';
export type { SessionPayload } from './session';
export {
  decodeSession,
  encodeSession,
  getSession,
  requireAdmin,
  requireSession,
  signOut,
} from './session';

/**
 * Sign-in entry point.
 *
 * Supabase Auth is attempted first whenever it is configured; the demo path is
 * only consulted when Supabase is absent, and only outside production.
 */
export async function authenticate(email: string, password: string): Promise<AdminUser | null> {
  const { isSupabaseConfigured } = await import('@/lib/supabase/env');

  if (isSupabaseConfigured) {
    return verifySupabaseCredentials(email, password);
  }

  return verifyDemoCredentials(email, password);
}

/**
 * Establishes the session.
 *
 * With Supabase configured, Supabase Auth has already written its own cookies
 * during `authenticate`, so nothing further is needed here. In demo mode we set
 * a signed cookie, which is only reachable outside production.
 */
export async function establishSession(user: AdminUser): Promise<void> {
  const { isSupabaseConfigured } = await import('@/lib/supabase/env');

  if (isSupabaseConfigured) return;

  const { cookies } = await import('next/headers');
  const store = await cookies();
  store.set(SESSION_COOKIE, createSessionCookieValue(user), sessionCookieOptions);
}

/**
 * Coarse per-IP throttle for the sign-in endpoint.
 *
 * This is process-local, so it is a speed bump rather than a defence: on a
 * multi-instance deployment an attacker can spread attempts across instances.
 * It exists to stop trivial scripted guessing; a production deployment should
 * additionally rely on Supabase Auth's own rate limiting, and ideally put a
 * managed WAF or edge rate limit in front of `/api/auth/login`.
 */
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 8;
const WINDOW_MS = 10 * 60 * 1000;

export async function clientFingerprint(): Promise<string> {
  const headerList = await headers();
  const forwarded = headerList.get('x-forwarded-for');
  const realIp = headerList.get('x-real-ip');
  return (forwarded?.split(',')[0] ?? realIp ?? 'unknown').trim();
}

export function checkRateLimit(key: string): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || entry.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  entry.count += 1;

  if (entry.count > MAX_ATTEMPTS) {
    return { allowed: false, retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000) };
  }

  return { allowed: true, retryAfterSeconds: 0 };
}

export function clearRateLimit(key: string): void {
  attempts.delete(key);
}

/**
 * Periodically drops expired entries so the map cannot grow without bound on a
 * long-running server. Cheap enough to run on every sign-in attempt.
 */
export function pruneRateLimits(): void {
  const now = Date.now();
  for (const [key, entry] of attempts) {
    if (entry.resetAt < now) attempts.delete(key);
  }
}
