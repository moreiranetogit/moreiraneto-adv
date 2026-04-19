import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/admin/usuarios
 * Listar todos os usuários
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('full_name', { ascending: true })

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (err) {
    console.error('[GET /api/admin/usuarios]', err)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

/**
 * POST /api/admin/usuarios
 * Criar novo usuário (convite)
 *
 * Body: { email, full_name, role }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, full_name, role } = body

    if (!email || !full_name) {
      return NextResponse.json(
        { error: 'Email e nome são obrigatórios' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Verificar se usuário já existe
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Usuário já existe' },
        { status: 409 }
      )
    }

    // TODO: Chamar Supabase Auth API ou Resend para enviar convite
    // Por enquanto, criar perfil placeholder com senha temporária

    const tempPassword = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)

    // Criar usuário via auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: false,
    })

    if (authError) throw authError
    if (!authData.user) throw new Error('Failed to create user')

    // Criar perfil
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email,
        full_name,
        role: role || 'editor',
        active: true,
      })
      .select()
      .single()

    if (profileError) throw profileError

    return NextResponse.json(profileData, { status: 201 })
  } catch (err) {
    console.error('[POST /api/admin/usuarios]', err)
    return NextResponse.json(
      { error: 'Failed to create user', details: String(err) },
      { status: 500 }
    )
  }
}
