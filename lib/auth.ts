import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { UserRole, Profile } from '@/types'

/**
 * Retorna o usuário autenticado + perfil.
 * Redireciona para /login se não autenticado.
 */
export async function requireAuth(): Promise<{ userId: string; profile: Profile }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error || !profile) redirect('/login')

  return { userId: user.id, profile: profile as Profile }
}

/**
 * Requer role mínima. Redireciona se insuficiente.
 */
export async function requireRole(roles: UserRole[]): Promise<Profile> {
  const { profile } = await requireAuth()

  if (!roles.includes(profile.role)) {
    redirect('/admin') // volta para home do admin
  }

  return profile
}

/**
 * Retorna usuário + perfil sem redirecionar (para layouts públicos).
 */
export async function getOptionalAuth(): Promise<Profile | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return profile as Profile | null
}
