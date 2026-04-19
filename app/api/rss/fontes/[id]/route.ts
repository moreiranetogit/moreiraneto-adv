import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * PATCH /api/rss/fontes/[id]
 * Atualizar uma fonte RSS
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }

    const body = await req.json()
    const { nome, url, tipo, categoria, ativo } = body

    const supabase = await createClient()

    // Mapear categoria slug para ID
    let updateData: Record<string, any> = {}
    if (nome) updateData.nome = nome
    if (url) updateData.url = url
    if (tipo) updateData.tipo = tipo
    if (ativo !== undefined) updateData.ativo = ativo

    if (categoria && categoria.startsWith('direito-')) {
      const categorias: Record<string, number> = {
        'direito-agrario': 1,
        'direito-civil': 2,
        'direito-trabalhista': 3,
        'direito-familia': 4,
        'direito-animal': 5,
        'direito-geral': 6,
      }
      updateData.categoria_id = categorias[categoria] || null
    }

    const { data, error } = await supabase
      .from('rss_sources')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    if (!data) {
      return NextResponse.json({ error: 'Source not found' }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (err) {
    console.error('[PATCH /api/rss/fontes/[id]]', err)
    return NextResponse.json({ error: 'Failed to update source' }, { status: 500 })
  }
}

/**
 * DELETE /api/rss/fontes/[id]
 * Deletar uma fonte RSS
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }

    const supabase = await createClient()

    const { error } = await supabase
      .from('rss_sources')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[DELETE /api/rss/fontes/[id]]', err)
    return NextResponse.json({ error: 'Failed to delete source' }, { status: 500 })
  }
}
