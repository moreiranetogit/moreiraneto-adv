import { createBrowserClient } from '@supabase/ssr'

/**
 * Supabase client para uso em Client Components ('use client').
 * Cria uma única instância por renderização — seguro para uso em hooks.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
