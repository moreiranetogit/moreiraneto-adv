// ═══════════════════════════════════════════════════════════════════════════
// Painel Admin — Lista de Artigos com Fila de Aprovação
// moreiraneto.adv.br/admin/artigos
// ═══════════════════════════════════════════════════════════════════════════

import { createClient } from '@/lib/supabase/server'
import { requireRole } from '@/lib/auth'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { Article } from '@/types'
import { CATEGORY_LABELS, CATEGORY_COLORS } from '@/types'
import ArticleActions from './ArticleActions'

export const dynamic = 'force-dynamic'

// ── Busca artigos ────────────────────────────────────────────────────────────

interface SearchParams {
  status?: string
  categoria?: string
  q?: string
  page?: string
}

const PAGE_SIZE = 20

async function getArtigos(params: SearchParams) {
  await requireRole(['admin', 'editor'])
  const supabase = await createClient()

  const status    = params.status    || 'pending'
  const categoria = params.categoria || ''
  const q         = params.q         || ''
  const page      = parseInt(params.page || '1', 10)
  const from      = (page - 1) * PAGE_SIZE
  const to        = from + PAGE_SIZE - 1

  let query = supabase
    .from('articles')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (status !== 'all') query = query.eq('status', status)
  if (categoria) query = query.eq('category', categoria)
  if (q) query = query.ilike('title', `%${q}%`)

  const { data, count, error } = await query
  if (error) throw error

  return { artigos: (data as Article[]) ?? [], total: count ?? 0, page, status }
}

// ── Componente ──────────────────────────────────────────────────────────────

export default async function AdminArtigosPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { artigos, total, page, status } = await getArtigos(searchParams)

  const totalPages = Math.ceil(total / PAGE_SIZE)

  const STATUS_TABS = [
    { key: 'pending',   label: 'Pendentes',   color: 'amber' },
    { key: 'published', label: 'Publicados',   color: 'green' },
    { key: 'rejected',  label: 'Rejeitados',   color: 'red' },
    { key: 'all',       label: 'Todos',        color: 'gray' },
  ]

  const CATEGORIAS = Object.entries(CATEGORY_LABELS)

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Fila Editorial</h1>
          <p className="text-gray-500 text-sm mt-1">
            {total} artigo{total !== 1 ? 's' : ''} · {status === 'pending' ? 'aguardando revisão' : `status: ${status}`}
          </p>
        </div>
        <a
          href="/api/rss/refresh"
          className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors"
        >
          🔄 Sincronizar RSS
        </a>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 space-y-4">

        {/* Tabs de status */}
        <div className="flex flex-wrap gap-2">
          {STATUS_TABS.map(tab => (
            <Link
              key={tab.key}
              href={`/admin/artigos?status=${tab.key}${searchParams.categoria ? `&categoria=${searchParams.categoria}` : ''}${searchParams.q ? `&q=${searchParams.q}` : ''}`}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
                status === tab.key
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {/* Busca e categoria */}
        <form method="get" action="/admin/artigos" className="flex flex-wrap gap-3">
          <input type="hidden" name="status" value={status} />
          <input
            name="q"
            defaultValue={searchParams.q || ''}
            placeholder="Buscar por título..."
            className="flex-1 min-w-48 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <select
            name="categoria"
            defaultValue={searchParams.categoria || ''}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
          >
            <option value="">Todas as categorias</option>
            {CATEGORIAS.map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors"
          >
            Filtrar
          </button>
        </form>

      </div>

      {/* Lista de artigos */}
      {artigos.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <div className="text-5xl mb-4">📭</div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">Nenhum artigo encontrado</h3>
          <p className="text-gray-400 text-sm">
            {status === 'pending'
              ? 'Fila vazia! Sincronize o RSS para buscar novos artigos.'
              : 'Nenhum artigo nesta categoria / status.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-50">
            {artigos.map(artigo => (
              <ArticleRow key={artigo.id} artigo={artigo} />
            ))}
          </div>
        </div>
      )}

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {page > 1 && (
            <Link
              href={`/admin/artigos?status=${status}&page=${page - 1}`}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              ← Anterior
            </Link>
          )}
          <span className="text-sm text-gray-500">
            Página {page} de {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={`/admin/artigos?status=${status}&page=${page + 1}`}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              Próxima →
            </Link>
          )}
        </div>
      )}

    </div>
  )
}

// ── Sub-componente: linha do artigo ─────────────────────────────────────────

function ArticleRow({ artigo }: { artigo: Article }) {
  const categoryLabel = CATEGORY_LABELS[artigo.category] ?? artigo.category
  const categoryColor = CATEGORY_COLORS[artigo.category] ?? '#E8941F'

  const timeAgo = artigo.created_at
    ? formatDistanceToNow(new Date(artigo.created_at), { locale: ptBR, addSuffix: true })
    : ''

  const statusConfig: Record<string, { label: string; cls: string }> = {
    pending:   { label: 'Pendente',   cls: 'status-pending' },
    published: { label: 'Publicado',  cls: 'status-published' },
    rejected:  { label: 'Rejeitado',  cls: 'status-rejected' },
  }

  const sc = statusConfig[artigo.status] ?? { label: artigo.status, cls: '' }

  return (
    <div className="flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors group">

      {/* Thumbnail */}
      <div className="w-20 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
        {artigo.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={artigo.image_url} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-2xl">
            📰
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span
            className="category-badge text-xs"
            style={{ backgroundColor: categoryColor + '20', color: categoryColor }}
          >
            {categoryLabel}
          </span>
          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${sc.cls}`}>
            {sc.label}
          </span>
          {artigo.source_name && (
            <span className="text-xs text-gray-400">{artigo.source_name}</span>
          )}
        </div>

        <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1 line-clamp-2">
          {artigo.title}
        </h3>

        {artigo.excerpt && (
          <p className="text-xs text-gray-400 line-clamp-1 mb-1">{artigo.excerpt}</p>
        )}

        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span>🕐 {timeAgo}</span>
          {artigo.read_count > 0 && <span>👁️ {artigo.read_count} leituras</span>}
          {artigo.source_url && (
            <a
              href={artigo.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-orange-500 transition-colors"
            >
              🔗 fonte original
            </a>
          )}
        </div>
      </div>

      {/* Ações */}
      <div className="flex-shrink-0 flex items-center gap-2">
        <Link
          href={`/admin/artigos/${artigo.id}`}
          className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:border-orange-400 hover:text-orange-500 transition-colors"
        >
          Revisar
        </Link>
        {/* Ações rápidas via client component */}
        <ArticleActions articleId={artigo.id} currentStatus={artigo.status} />
      </div>

    </div>
  )
}
