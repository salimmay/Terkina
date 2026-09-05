import { createBrowserClient } from '@supabase/ssr';

const _supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const _supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!_supabaseUrl || !_supabaseAnonKey) {
  throw new Error(
    'Missing required Supabase env vars: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY). ' +
      'Copy .env.example → .env and fill in real values.',
  );
}

// Narrowed to string after the runtime guard above
const supabaseUrl: string = _supabaseUrl;
const supabaseAnonKey: string = _supabaseAnonKey;

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

