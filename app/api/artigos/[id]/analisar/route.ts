import { requireRole } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  await requireRole(['admin', 'editor'])
  const supabase = await createClient()

  const { data: artigo, error: erroArtigo } = await supabase
    .from('articles')
    .select('id, title, excerpt, content, source_name, category')
    .eq('id', params.id)
    .single()

  if (erroArtigo || !artigo) {
    return NextResponse.json({ error: 'Artigo não encontrado' }, { status: 404 })
  }

  // TODO: integrar skill /legal-moreira:analise-juridica
  const analiseGerada = `[ANÁLISE PENDENTE]\n\nNotícia: ${artigo.title}\nFonte: ${artigo.source_name ?? 'desconhecida'}\nData: ${new Date().toLocaleDateString('pt-BR')}\n\nUse o painel de revisão para gerar a análise jurídica.`

  const { data, error } = await supabase
    .from('articles')
    .update({
      analise_texto: analiseGerada,
      analise_editada_manualmente: false,
    })
    .eq('id', params.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    artigo: data,
    mensagem: 'Análise gerada. Edite antes de aprovar.',
  })
}
