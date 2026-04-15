import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Fail-safe validation
if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('[auth]: CRITICAL ERROR - Supabase URL or Service Role Key is missing.');
}

// Client with Service Role Key for Admin operations (use with caution)
// We provide fallbacks to prevent immediate crash but log the error clearly
export const supabaseAdmin = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseServiceRoleKey || 'placeholder-key'
);

// Default Client
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseKey || 'placeholder-key'
);
