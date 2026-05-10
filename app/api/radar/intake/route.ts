import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import type { ArticleCategory } from '@/types'

// Categorias válidas
const VALID_CATEGORIES = new Set<ArticleCategory>([
  'agrario', 'civil', 'trabalhista', 'familia', 'animal', 'advocacia', 'oab',
])

// Status de revisão aceitos
const VALID_REVIEW_STATUS = new Set(['pendente', 'aprovado', 'reprovado', 'nao_aplicavel'])

interface IntakePayload {
  // Obrigatórios
  title: string
  category: ArticleCategory
  // Conteúdo
  excerpt?: string
  content?: string
  comentario_editorial?: string
  analise_texto?: string
  // Fonte
  source_name?: string
  source_url?: string
  // Metadados
  tags?: string[]
  destaque?: boolean
  image_url?: string
  // Revisões dos agentes
  status_fonte?: string
  status_etica?: string
  // Data original da notícia
  data_noticia?: string
}

/**
 * POST /api/radar/intake
 * Endpoint para os agentes PAA/CODEX enviarem rascunhos editoriais.
 * Sempre cria com status "pending" — nunca publica diretamente.
 * Autenticado via header: Authorization: Bearer <RADAR_INTAKE_SECRET>
 */
export async function POST(request: NextRequest) {
  // Autenticação por API key dos agentes
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (!token || token !== process.env.RADAR_INTAKE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: IntakePayload
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  // Validações obrigatórias
  if (!body.title?.trim()) {
    return NextResponse.json({ error: 'Campo obrigatório: title' }, { status: 400 })
  }
  if (!body.category || !VALID_CATEGORIES.has(body.category)) {
    return NextResponse.json(
      { error: `Categoria inválida. Use: ${[...VALID_CATEGORIES].join(' | ')}` },
      { status: 400 }
    )
  }

  // Validação de status de revisão (se fornecidos)
  if (body.status_fonte && !VALID_REVIEW_STATUS.has(body.status_fonte)) {
    return NextResponse.json({ error: 'status_fonte inválido' }, { status: 400 })
  }
  if (body.status_etica && !VALID_REVIEW_STATUS.has(body.status_etica)) {
    return NextResponse.json({ error: 'status_etica inválido' }, { status: 400 })
  }

  // Gerar slug a partir do título
  const slug = body.title
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 100)
    + '-' + Date.now()

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('articles')
    .insert({
      title:               body.title.trim().slice(0, 500),
      slug,
      excerpt:             body.excerpt?.trim().slice(0, 1000) ?? null,
      content:             body.content?.trim() ?? null,
      category:            body.category,
      source_name:         body.source_name?.trim().slice(0, 200) ?? 'PAA/Radar',
      source_url:          body.source_url?.trim().slice(0, 2048) ?? null,
      image_url:           body.image_url?.trim() ?? null,
      tags:                Array.isArray(body.tags) ? body.tags.slice(0, 20) : null,
      destaque:            body.destaque ?? false,
      comentario_editorial: body.comentario_editorial?.trim().slice(0, 5000) ?? null,
      analise_texto:       body.analise_texto?.trim() ?? null,
      status_fonte:        body.status_fonte ?? 'pendente',
      status_etica:        body.status_etica ?? 'pendente',
      origem:              'paa_radar',
      status:              'pending',    // nunca publica direto
      featured:            false,
      published_at:        body.data_noticia ?? null,
    })
    .select('id, slug, title')
    .single()

  if (error) {
    console.error('[POST /api/radar/intake]', error)
    return NextResponse.json({ error: 'Erro ao salvar rascunho' }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    message: 'Rascunho recebido. Aguardando revisão do Editor Master.',
    artigo: {
      id:    data.id,
      slug:  data.slug,
      title: data.title,
      status: 'pending',
      painel: `https://moreiraneto.adv.br/admin/artigos/${data.id}`,
    },
  }, { status: 201 })
}
