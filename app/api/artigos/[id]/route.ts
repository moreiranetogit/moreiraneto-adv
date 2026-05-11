import { requireRole } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

const VALID_STATUSES = new Set(['pending', 'published', 'rejected'])

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireRole(['admin', 'editor'])
  const supabase = await createClient()
  const { id } = await params
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single()
  if (error || !data) return NextResponse.json({ error: 'Artigo não encontrado' }, { status: 404 })
  return NextResponse.json(data)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireRole(['admin', 'editor'])
  const supabase = await createClient()
  const { id } = await params
  const body = await req.json()

  const updates: Record<string, unknown> = {}

  if (body.status !== undefined) {
    if (!VALID_STATUSES.has(body.status)) {
      return NextResponse.json({ error: 'Status inválido' }, { status: 400 })
    }
    updates.status = body.status
    if (body.status === 'published') updates.published_at = new Date().toISOString()
  }
  if (body.analise_texto !== undefined) updates.analise_texto = body.analise_texto
  if (body.analise_editada_manualmente !== undefined) updates.analise_editada_manualmente = body.analise_editada_manualmente

  const { data, error } = await supabase
    .from('articles')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireRole(['admin', 'editor'])
  const supabase = await createClient()
  const { id } = await params
  const { error } = await supabase
    .from('articles')
    .update({ status: 'rejected' })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
