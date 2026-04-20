import { requireRole } from '@/lib/auth'
import { createAdminClient, createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(_req: NextRequest) {
  await requireRole(['admin'])
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, role, active, created_at')
    .order('full_name', { ascending: true })
  if (error) {
    console.error('[GET /api/admin/usuarios]', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
  return NextResponse.json(data ?? [])
}

export async function POST(req: NextRequest) {
  await requireRole(['admin'])
  const body = await req.json()
  const { email, full_name, role } = body

  if (!email || !full_name) {
    return NextResponse.json({ error: 'email e full_name são obrigatórios' }, { status: 400 })
  }

  const VALID_ROLES = new Set(['admin', 'editor', 'voluntaria_amaa'])
  const resolvedRole = VALID_ROLES.has(role) ? role : 'editor'

  const adminClient = createAdminClient()

  const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
    email: String(email).trim().toLowerCase(),
    email_confirm: false,
    user_metadata: { full_name: String(full_name).trim() },
  })

  if (authError) {
    console.error('[POST /api/admin/usuarios] auth error:', authError)
    return NextResponse.json({ error: authError.message }, { status: 500 })
  }
  if (!authData.user) {
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }

  // Atualizar role no perfil criado automaticamente pelo trigger
  const supabase = await createClient()
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .update({ role: resolvedRole, full_name: String(full_name).trim() })
    .eq('id', authData.user.id)
    .select()
    .single()

  if (profileError) {
    console.error('[POST /api/admin/usuarios] profile error:', profileError)
    return NextResponse.json({ error: 'Usuário criado, mas erro ao definir role' }, { status: 500 })
  }

  return NextResponse.json(profile, { status: 201 })
}
