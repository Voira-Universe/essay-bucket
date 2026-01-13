
import { createClient } from '@supabase/supabase-js';

// Access environment variables securely
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Key is missing. Check your .env file.');
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

export type Essay = {
  id?: string;
  created_at?: string;
  prompt: string;
  content: string;
  source: string;
  embedding?: number[]; // Vector embedding for semantic search
};
