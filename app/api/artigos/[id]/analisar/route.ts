import { requireRole } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import type { ArticleCategory } from '@/types'

const CATEGORY_LABEL: Record<ArticleCategory, string> = {
  agrario:    'Direito Agrário e do Agronegócio',
  civil:      'Direito Civil',
  trabalhista: 'Direito do Trabalho',
  familia:    'Direito de Família',
  animal:     'Direito Animal e Ambiental',
  advocacia:  'Advocacia e Processo Civil',
  oab:        'OAB e Ética Profissional',
}

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

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: 'GEMINI_API_KEY não configurada no ambiente.' },
      { status: 503 }
    )
  }

  const categoriaLabel = CATEGORY_LABEL[artigo.category as ArticleCategory] ?? 'Direito'
  const conteudo = artigo.content ?? artigo.excerpt ?? artigo.title
  const fonte = artigo.source_name ?? 'fonte não informada'

  const prompt = `Você é um advogado brasileiro especialista em ${categoriaLabel}, \
escrevendo para o portal jurídico Moreira Neto Advocacia (Realeza/PR).

Analise a seguinte notícia de forma técnica e acessível, em 4 parágrafos:
1. Contexto jurídico: qual ramo do direito e qual questão legal está em jogo.
2. Impacto prático: o que muda para cidadãos, empresas ou profissionais do direito.
3. Precedentes e legislação: leis, artigos ou jurisprudência relevante (se aplicável).
4. Conclusão: posicionamento técnico resumido.

Tom: profissional, direto, sem jargão desnecessário. Idioma: português brasileiro.
Não repita o título. Não cite o nome do escritório.

---
Título: ${artigo.title}
Fonte: ${fonte}
Área: ${categoriaLabel}
Conteúdo:
${conteudo.slice(0, 3000)}
---`

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
    const result = await model.generateContent(prompt)
    const analiseGerada = result.response.text()

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
      mensagem: 'Análise gerada pelo Gemini. Revise antes de publicar.',
    })
  } catch (err) {
    console.error('[Gemini] Erro na geração de análise:', err)
    return NextResponse.json(
      { error: 'Erro ao gerar análise. Tente novamente.' },
      { status: 500 }
    )
  }
}
