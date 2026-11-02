import 'server-only';

import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { supabaseServiceRoleKey, supabaseUrl } from './env';

/**
 * Privileged Supabase client using the service-role key, which bypasses Row
 * Level Security entirely.
 *
 * SECURITY CONTRACT — read before using:
 *
 *  1. This module imports `server-only`, so any attempt to import it from a
 *     Client Component is a build error rather than a silent key leak.
 *  2. The service-role key is read from a non-`NEXT_PUBLIC_` variable, so it is
 *     never inlined into the browser bundle.
 *  3. Every caller must have already authorised the request at the application
 *     layer. This client does not check who is asking — it trusts its caller.
 *     Concretely: API routes call `requireAdmin()` (or the equivalent) *before*
 *     touching this client.
 *  4. Because it bypasses RLS, all input passed to it must already be validated
 *     and normalised by a Zod schema. Never pass raw request bodies through.
 *
 * Legitimate uses are narrow: recording a public form submission that must be
 * writable by anonymous visitors, and admin mutations after authorisation.
 */
export function createAdminClient() {
  if (!supabaseUrl || !supabaseServiceRoleKey) return null;

  return createSupabaseClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}
