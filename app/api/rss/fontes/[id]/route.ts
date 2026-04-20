import { requireRole } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

const VALID_CATEGORIES = new Set(['agrario', 'civil', 'trabalhista', 'familia', 'animal', 'advocacia', 'oab'])

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await requireRole(['admin'])
  const supabase = await createClient()
  const body = await req.json()
  const { name, url, site_url, category, active } = body

  const updateData: Record<string, unknown> = {}
  if (name !== undefined) updateData.name = String(name).trim().slice(0, 200)
  if (url !== undefined) updateData.url = String(url).trim().slice(0, 2048)
  if (site_url !== undefined) updateData.site_url = site_url ? String(site_url).trim().slice(0, 2048) : null
  if (active !== undefined) updateData.active = Boolean(active)
  if (category !== undefined) {
    if (!VALID_CATEGORIES.has(category)) {
      return NextResponse.json({ error: 'Categoria inválida' }, { status: 400 })
    }
    updateData.category = category
  }

  const { data, error } = await supabase
    .from('rss_sources')
    .update(updateData)
    .eq('id', params.id)
    .select()
    .single()

  if (error) {
    console.error('[PATCH /api/rss/fontes/[id]]', error)
    return NextResponse.json({ error: 'Failed to update source' }, { status: 500 })
  }
  if (!data) return NextResponse.json({ error: 'Source not found' }, { status: 404 })
  return NextResponse.json(data)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  await requireRole(['admin'])
  const supabase = await createClient()
  const { error } = await supabase
    .from('rss_sources')
    .delete()
    .eq('id', params.id)

  if (error) {
    console.error('[DELETE /api/rss/fontes/[id]]', error)
    return NextResponse.json({ error: 'Failed to delete source' }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}
