import { requireRole } from '@/lib/auth'
import { createAdminClient, createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await requireRole(['admin'])
  const supabase = await createClient()
  const body = await req.json()
  const { role, active } = body

  const VALID_ROLES = new Set(['admin', 'editor', 'voluntaria_amaa'])
  const updateData: Record<string, unknown> = {}
  if (role !== undefined) {
    if (!VALID_ROLES.has(role)) return NextResponse.json({ error: 'Role inválida' }, { status: 400 })
    updateData.role = role
  }
  if (active !== undefined) updateData.active = Boolean(active)

  const { data, error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', params.id)
    .select()
    .single()

  if (error) {
    console.error('[PATCH /api/admin/usuarios/[id]]', error)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
  if (!data) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  return NextResponse.json(data)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  await requireRole(['admin'])
  const adminClient = createAdminClient()
  // Deleta da auth — cascade apaga o profile automaticamente
  const { error } = await adminClient.auth.admin.deleteUser(params.id)
  if (error) {
    console.error('[DELETE /api/admin/usuarios/[id]]', error)
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}
