import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export const revalidate = 300

export async function GET(req: NextRequest) {
  const limit = Math.min(parseInt(req.nextUrl.searchParams.get('limit') ?? '5'), 20)
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('articles')
    .select('id, title, slug, category, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(isNaN(limit) ? 5 : limit)

  if (error) return NextResponse.json([], { status: 500 })
  return NextResponse.json(data ?? [])
}
