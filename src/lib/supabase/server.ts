import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { supabaseAnonKey, supabaseUrl } from './env';

/**
 * Server-side Supabase client bound to the request's cookie jar, so it carries
 * the signed-in user's session and is therefore subject to Row Level Security.
 *
 * Use this for anything that must respect the current user's permissions. For
 * privileged operations that intentionally bypass RLS (public form submissions,
 * admin mutations already authorised at the application layer), use
 * `createAdminClient` from `./admin` instead — never this one.
 */
export async function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) return null;

  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Server Components cannot set cookies. Session refresh is handled by
          // the middleware, so this is safe to ignore here.
        }
      },
    },
  });
}
