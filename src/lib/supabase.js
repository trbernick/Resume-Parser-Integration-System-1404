import { createClient } from '@supabase/supabase-js'

// Project credentials will be injected during deployment
const SUPABASE_URL = 'https://<PROJECT-ID>.supabase.co'
const SUPABASE_ANON_KEY = '<ANON_KEY>'

if (SUPABASE_URL === 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY === '<ANON_KEY>') {
  throw new Error('Missing Supabase variables. Please connect your Supabase project.');
}

export default createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})