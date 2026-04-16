import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl =
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''

const supabaseAnonKey =
  process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.warn(
    '[lib/supabase] Missing SUPABASE_URL / SUPABASE_ANON_KEY. Fallback phone will be used.',
  )
}

let _client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (_client) return _client
  _client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { 'x-application-name': 'tablechair-rental-malaysia' } },
  })
  return _client
}

export const supabase = getSupabase()
