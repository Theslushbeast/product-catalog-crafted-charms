import { createClient } from '@supabase/supabase-js'

const env = (import.meta as unknown as { env: Record<string, string | undefined> }).env

const supabaseUrl = env.VITE_SUPABASE_URL
const supabaseKey = env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY environment variables.')
}

export const supabase = createClient(supabaseUrl, supabaseKey)
