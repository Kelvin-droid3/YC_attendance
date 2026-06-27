import { createClient } from '@supabase/supabase-js'

let supabase: any = null

export const getSupabaseClient = () => {
  if (supabase) return supabase
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not available')
    return null
  }

  supabase = createClient(supabaseUrl, supabaseAnonKey)
  return supabase
}
