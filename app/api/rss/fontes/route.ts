import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/rss/fontes
 * Lista todas as fontes RSS configuradas
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('rss_sources')
      .select('*')
      .order('nome', { ascending: true })

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (err) {
    console.error('[GET /api/rss/fontes]', err)
    return NextResponse.json({ error: 'Failed to fetch sources' }, { status: 500 })
  }
}

/**
 * POST /api/rss/fontes
 * Criar nova fonte RSS
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { nome, url, tipo, categoria, ativo } = body

    if (!nome || !url) {
      return NextResponse.json(
        { error: 'Nome e URL são obrigatórios' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Mapear categoria slug para ID
    let categoria_id: number | null = null
    if (categoria && categoria.startsWith('direito-')) {
      const categorias: Record<string, number> = {
        'direito-agrario': 1,
        'direito-civil': 2,
        'direito-trabalhista': 3,
        'direito-familia': 4,
        'direito-animal': 5,
        'direito-geral': 6,
      }
      categoria_id = categorias[categoria] || null
    }

    const { data, error } = await supabase
      .from('rss_sources')
      .insert({
        nome,
        url,
        tipo: tipo || 'rss',
        categoria_id,
        ativo: ativo !== false,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    console.error('[POST /api/rss/fontes]', err)
    return NextResponse.json({ error: 'Failed to create source' }, { status: 500 })
  }
}
