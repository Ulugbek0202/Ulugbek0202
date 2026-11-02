import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

/**
 * Middleware pipeline.
 *
 * 1. Admin routes are excluded from locale handling and gated by a session
 *    check here — a cheap redirect for unauthenticated visitors. This is only
 *    the first of three layers; the admin layout re-verifies the session
 *    server-side and every mutation re-checks authorization.
 * 2. Everything else is delegated to next-intl for locale negotiation.
 */
export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin')) {
    const hasSession = request.cookies.has('meridian_admin_session');

    if (!hasSession && pathname !== '/admin/login') {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  // Skip API routes, Next internals, static files and common asset extensions.
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
