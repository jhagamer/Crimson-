
import { createClient, type SupabaseClient, type User as SupabaseUser } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.error(
    'Supabase Config Error: NEXT_PUBLIC_SUPABASE_URL is missing or empty. Please set it in your .env.local file and restart your server.'
  );
}
if (!supabaseAnonKey) {
  console.error(
    'Supabase Config Error: NEXT_PUBLIC_SUPABASE_ANON_KEY is missing or empty. Please set it in your .env.local file and restart your server.'
  );
}

// Ensure URL and key are defined before creating client to prevent runtime errors
let supabaseInstance: SupabaseClient | null = null;
if (supabaseUrl && supabaseAnonKey) {
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.error("Supabase client could not be initialized due to missing URL or Anon Key.");
}

export const supabase = supabaseInstance as SupabaseClient; // Cast for use, handle null if needed
export type { SupabaseUser };
