import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || ''; // Usually admin or service role key in backend
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Backend Supabase environment variables are missing.');
}

// Client with Service Role Key for Admin operations (use with caution)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

// Default Client
export const supabase = createClient(supabaseUrl, supabaseKey);
