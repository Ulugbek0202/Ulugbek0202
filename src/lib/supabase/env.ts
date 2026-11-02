/**
 * Environment access, validated in one place.
 *
 * Nothing in this module throws at import time: a missing Supabase
 * configuration is a legitimate state (demo mode), not a crash. Only the
 * server-side service-role client insists on credentials, and only when it is
 * actually asked to perform a write.
 */

function read(key: string): string | null {
  const value = process.env[key];
  if (value === undefined) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export const siteUrl =
  read('NEXT_PUBLIC_SITE_URL') ??
  (read('VERCEL_URL') ? `https://${read('VERCEL_URL')}` : 'http://localhost:3000');

export const supabaseUrl = read('NEXT_PUBLIC_SUPABASE_URL');
export const supabaseAnonKey = read('NEXT_PUBLIC_SUPABASE_ANON_KEY');
export const supabaseServiceRoleKey = read('SUPABASE_SERVICE_ROLE_KEY');

/**
 * True when the public (anon) Supabase credentials are present. Used to decide
 * between the demo repository and the Supabase-backed one.
 */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/**
 * True when the service-role key is also present, which is required for the
 * admin panel's privileged writes and for accepting public form submissions
 * that must bypass Row Level Security.
 */
export const isSupabaseAdminConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && supabaseServiceRoleKey,
);

export const adminDemoEmail = read('ADMIN_DEMO_EMAIL') ?? 'admin@example.com';
export const adminDemoPassword = read('ADMIN_DEMO_PASSWORD') ?? 'change-me-please';
export const adminSessionSecret = read('ADMIN_SESSION_SECRET');

export const telegramBotToken = read('TELEGRAM_BOT_TOKEN');
export const telegramChatId = read('TELEGRAM_CHAT_ID');

export const smtp = {
  host: read('SMTP_HOST'),
  port: Number(read('SMTP_PORT') ?? 587),
  user: read('SMTP_USER'),
  password: read('SMTP_PASSWORD'),
  from: read('SMTP_FROM') ?? 'Website <no-reply@example.com>',
  notificationEmail: read('NOTIFICATION_EMAIL'),
};

export const isEmailConfigured = Boolean(smtp.host && smtp.user && smtp.password);
export const isTelegramConfigured = Boolean(telegramBotToken && telegramChatId);

/**
 * The demo admin session is only ever accepted outside a production build.
 * This is the single gate that prevents a hard-coded demo login from existing
 * on a deployed production site.
 */
export const isDemoAuthAllowed = process.env.NODE_ENV !== 'production';

/** Redacted snapshot of the integration state, safe to render in the admin UI. */
export function integrationStatus() {
  return {
    supabase: isSupabaseConfigured,
    supabaseAdmin: isSupabaseAdminConfigured,
    telegram: isTelegramConfigured,
    email: isEmailConfigured,
    demoAuth: isDemoAuthAllowed,
  } as const;
}
