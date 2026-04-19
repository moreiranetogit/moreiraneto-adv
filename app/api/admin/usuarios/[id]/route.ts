import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * PATCH /api/admin/usuarios/[id]
 * Atualizar role ou status de um usuário
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const body = await req.json()
    const { role, active } = body

    const supabase = await createClient()

    const updateData: Record<string, any> = {}
    if (role) updateData.role = role
    if (active !== undefined) updateData.active = active

    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    if (!data) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (err) {
    console.error('[PATCH /api/admin/usuarios/[id]]', err)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}

/**
 * DELETE /api/admin/usuarios/[id]
 * Deletar um usuário
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const supabase = await createClient()

    // Deletar perfil
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id)

    if (profileError) throw profileError

    // TODO: Deletar usuário da auth também via admin API
    // const { error: authError } = await supabase.auth.admin.deleteUser(id)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[DELETE /api/admin/usuarios/[id]]', err)
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
  }
}
