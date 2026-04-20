import { requireRole } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

const VALID_STATUSES = new Set(['pending', 'published', 'rejected'])
const VALID_CATEGORIES = new Set(['agrario', 'civil', 'trabalhista', 'familia', 'animal', 'advocacia', 'oab'])

export async function GET(req: NextRequest) {
  await requireRole(['admin', 'editor'])
  const supabase = await createClient()
  const { searchParams } = req.nextUrl

  const status = searchParams.get('status') || 'pending'
  const category = searchParams.get('category')
  const search = searchParams.get('search')

  const resolvedStatus = VALID_STATUSES.has(status) ? status : 'pending'

  let query = supabase
    .from('articles')
    .select('id, title, slug, category, status, source_name, published_at, created_at, read_count')
    .eq('status', resolvedStatus)
    .order('created_at', { ascending: false })
    .limit(100)

  if (category && VALID_CATEGORIES.has(category)) query = query.eq('category', category)
  if (search) query = query.ilike('title', `%${search.trim().slice(0, 100)}%`)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function POST(req: NextRequest) {
  await requireRole(['admin', 'editor'])
  const supabase = await createClient()
  const body = await req.json()
  const { title, excerpt, content, source_url, source_name, category } = body

  if (!title || !category) {
    return NextResponse.json({ error: 'title e category são obrigatórios' }, { status: 400 })
  }
  if (!VALID_CATEGORIES.has(category)) {
    return NextResponse.json({ error: 'Categoria inválida' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('articles')
    .insert({
      title: String(title).trim().slice(0, 500),
      excerpt: excerpt ? String(excerpt).trim().slice(0, 1000) : null,
      content: content ? String(content).trim() : null,
      source_url: source_url ? String(source_url).slice(0, 2048) : null,
      source_name: source_name ? String(source_name).trim().slice(0, 200) : null,
      category,
      status: 'pending',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
