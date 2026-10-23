import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('[YOUR-PROJECT-REF]')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export async function signInWithGoogleOAuth(redirectTo?: string) {
  if (!isSupabaseConfigured || !supabase) {
    // If Supabase keys are not yet configured, return local mock authorization url
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    return {
      url: `${origin}/api/auth/callback?provider=google&demo=true`,
      error: null,
    };
  }

  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  const targetRedirect = redirectTo || `${origin}/dashboard`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: targetRedirect,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  return { url: data?.url, error };
}
