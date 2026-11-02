import 'server-only';

import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { adminSessionSecret, isDemoAuthAllowed } from '@/lib/supabase/env';
import { createClient } from '@/lib/supabase/server';
import type { AdminUser } from '@/types';

/**
 * ============================================================================
 * ADMIN AUTHENTICATION
 * ============================================================================
 * Two credential sources, in strict priority order:
 *
 *   1. Supabase Auth — used whenever Supabase is configured. The session is
 *      held in Supabase's own cookies and the user's role is read from the
 *      `profiles` table, which is protected by Row Level Security.
 *
 *   2. Demo session — available ONLY outside production. It exists so the admin
 *      panel can be reviewed without standing up a database. `isDemoAuthAllowed`
 *      is false in a production build, so this path cannot be reached on a
 *      deployed site even if the environment variables are left at defaults.
 *
 * The session cookie is an HMAC-signed payload, not a bare flag, so a visitor
 * cannot mint one by setting `meridian_admin_session=1` by hand.
 * ============================================================================
 */

export const SESSION_COOKIE = 'meridian_admin_session';
const SESSION_TTL_SECONDS = 60 * 60 * 8;

export interface SessionPayload {
  sub: string;
  email: string;
  name: string;
  role: AdminUser['role'];
  /** Issued-at, seconds since epoch. */
  iat: number;
  /** Expiry, seconds since epoch. */
  exp: number;
}

/* -------------------------------------------------------------------------- */
/* Signing                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * The signing key. In production a configured secret is mandatory: falling back
 * to a known constant would let anyone forge a session on a deployment that
 * forgot to set the variable, so we refuse to sign instead.
 */
function signingKey(): Buffer {
  if (adminSessionSecret) return Buffer.from(adminSessionSecret, 'utf8');

  if (isDemoAuthAllowed) {
    // Deterministic development-only key so hot reloads keep sessions valid.
    return Buffer.from('meridian-development-only-session-key', 'utf8');
  }

  throw new Error(
    'ADMIN_SESSION_SECRET must be set in production. Refusing to sign an admin session with a default key.',
  );
}

function base64url(input: Buffer | string): string {
  return Buffer.from(input).toString('base64url');
}

function sign(payload: string): string {
  return createHmac('sha256', signingKey()).update(payload).digest('base64url');
}

export function encodeSession(payload: SessionPayload): string {
  const body = base64url(JSON.stringify(payload));
  return `${body}.${sign(body)}`;
}

export function decodeSession(token: string | undefined): SessionPayload | null {
  if (!token) return null;

  const separator = token.lastIndexOf('.');
  if (separator <= 0) return null;

  const body = token.slice(0, separator);
  const signature = token.slice(separator + 1);

  let expected: string;
  try {
    expected = sign(body);
  } catch {
    return null;
  }

  // Constant-time comparison: a byte-by-byte early exit would leak how much of
  // a guessed signature was correct.
  const provided = Buffer.from(signature, 'utf8');
  const computed = Buffer.from(expected, 'utf8');
  if (provided.length !== computed.length) return null;
  if (!timingSafeEqual(provided, computed)) return null;

  try {
    const parsed = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as SessionPayload;
    if (typeof parsed.exp !== 'number' || parsed.exp * 1000 < Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}

/* -------------------------------------------------------------------------- */
/* Credential verification                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Verifies demo credentials against the configured values.
 *
 * Both comparisons are constant-time, and the password check always runs even
 * when the email is wrong, so response timing does not reveal which half of the
 * pair was incorrect.
 */
export async function verifyDemoCredentials(
  email: string,
  password: string,
): Promise<AdminUser | null> {
  if (!isDemoAuthAllowed) return null;

  const { adminDemoEmail, adminDemoPassword } = await import('@/lib/supabase/env');

  const emailMatches = safeCompare(email.trim().toLowerCase(), adminDemoEmail.toLowerCase());
  const passwordMatches = safeCompare(password, adminDemoPassword);

  if (!emailMatches || !passwordMatches) return null;

  return {
    id: 'demo-admin',
    email: adminDemoEmail,
    name: 'Demo Administrator',
    role: 'admin',
    createdAt: new Date(0).toISOString(),
  };
}

function safeCompare(a: string, b: string): boolean {
  const bufferA = Buffer.from(a, 'utf8');
  const bufferB = Buffer.from(b, 'utf8');
  // Equal-length buffers are required by timingSafeEqual; pad the shorter one so
  // the comparison still runs in constant time and simply fails.
  const length = Math.max(bufferA.length, bufferB.length, 1);
  const paddedA = Buffer.alloc(length);
  const paddedB = Buffer.alloc(length);
  bufferA.copy(paddedA);
  bufferB.copy(paddedB);

  return timingSafeEqual(paddedA, paddedB) && bufferA.length === bufferB.length;
}

/** Signs in through Supabase Auth and loads the user's role from `profiles`. */
export async function verifySupabaseCredentials(
  email: string,
  password: string,
): Promise<AdminUser | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', data.user.id)
    .maybeSingle();

  const role = profile?.role;

  // A signed-in user without a recognised role is not an administrator.
  if (role !== 'admin' && role !== 'editor' && role !== 'viewer') return null;

  return {
    id: data.user.id,
    email: data.user.email ?? email,
    name: profile?.full_name ?? data.user.email ?? 'Administrator',
    role,
    createdAt: data.user.created_at ?? new Date().toISOString(),
  };
}

/* -------------------------------------------------------------------------- */
/* Session lifecycle                                                           */
/* -------------------------------------------------------------------------- */

export function createSessionCookieValue(user: AdminUser): string {
  const issuedAt = Math.floor(Date.now() / 1000);

  return encodeSession({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    iat: issuedAt,
    exp: issuedAt + SESSION_TTL_SECONDS,
  });
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: SESSION_TTL_SECONDS,
};

/** Reads and verifies the current admin session. Safe to call anywhere. */
export async function getSession(): Promise<SessionPayload | null> {
  // Prefer Supabase when configured, so a real deployment never honours a
  // demo cookie that happened to survive from a local session.
  const supabase = await createClient();
  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, role')
      .eq('id', user.id)
      .maybeSingle();

    const role = profile?.role;
    if (role !== 'admin' && role !== 'editor' && role !== 'viewer') return null;

    return {
      sub: user.id,
      email: user.email ?? '',
      name: profile?.full_name ?? user.email ?? 'Administrator',
      role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
    };
  }

  const store = await cookies();
  return decodeSession(store.get(SESSION_COOKIE)?.value);
}

export async function requireSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) throw new Error('UNAUTHORISED');
  return session;
}

/**
 * Authorises an admin mutation.
 *
 * This is the single gate every write path must pass through. Client-side role
 * checks are treated as a convenience only — they are trivially bypassed by
 * calling the API directly, so the server re-checks here on every request.
 */
export async function requireAdmin(allowed: AdminUser['role'][] = ['admin', 'editor']): Promise<SessionPayload> {
  const session = await requireSession();

  if (!allowed.includes(session.role)) {
    throw new Error('FORBIDDEN');
  }

  return session;
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  if (supabase) await supabase.auth.signOut();

  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
