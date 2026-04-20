import { requireRole } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

const VALID_CATEGORIES = new Set(['agrario', 'civil', 'trabalhista', 'familia', 'animal', 'advocacia', 'oab'])

export async function GET(_req: NextRequest) {
  await requireRole(['admin'])
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('rss_sources')
    .select('*')
    .order('name', { ascending: true })
  if (error) {
    console.error('[GET /api/rss/fontes]', error)
    return NextResponse.json({ error: 'Failed to fetch sources' }, { status: 500 })
  }
  return NextResponse.json(data ?? [])
}

export async function POST(req: NextRequest) {
  await requireRole(['admin'])
  const supabase = await createClient()
  const body = await req.json()
  const { name, url, site_url, category, active } = body

  if (!name || !url || !category) {
    return NextResponse.json({ error: 'name, url e category são obrigatórios' }, { status: 400 })
  }
  if (!VALID_CATEGORIES.has(category)) {
    return NextResponse.json({ error: 'Categoria inválida' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('rss_sources')
    .insert({
      name: String(name).trim().slice(0, 200),
      url: String(url).trim().slice(0, 2048),
      site_url: site_url ? String(site_url).trim().slice(0, 2048) : null,
      category,
      active: active !== false,
    })
    .select()
    .single()

  if (error) {
    console.error('[POST /api/rss/fontes]', error)
    return NextResponse.json({ error: 'Failed to create source' }, { status: 500 })
  }
  return NextResponse.json(data, { status: 201 })
}
