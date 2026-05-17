import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET /api/ping
// Endpoint público e leve para manter o Supabase ativo.
// Faz apenas um SELECT COUNT mínimo — sem dados sensíveis na resposta.
export async function GET() {
  try {
    const supabase = await createClient()
    const { count } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published')

    return NextResponse.json({
      ok: true,
      published: count ?? 0,
      ts: new Date().toISOString(),
    })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
