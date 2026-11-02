import { createBrowserClient } from '@supabase/ssr';
import { supabaseAnonKey, supabaseUrl } from './env';

/**
 * Browser-side Supabase client, used only for public reads and for the admin
 * sign-in call. It carries the anon key, so every query it makes is subject to
 * Row Level Security — it can never read or write more than the policies allow.
 *
 * Returns `null` in demo mode so callers must handle the unconfigured case
 * explicitly rather than receiving a client that silently fails.
 */
export function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) return null;

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
