import { createClient } from '@supabase/supabase-js'

// Cast import.meta to bypass strict TS2339 checks in vue-tsc
const env = (import.meta as unknown as { env: Record<string, string | undefined> }).env

const supabaseUrl = env.VITE_SUPABASE_URL
const supabaseAnonKey = env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY environment variables.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)