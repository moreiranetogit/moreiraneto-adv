import { requireRole } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import ArticleActions from './ArticleActions'
import { CATEGORY_LABELS } from '@/types'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { Article } from '@/types'

export const revalidate = 0

const STATUS_LABELS: Record<string, string> = {
  pending:   'Pendente',
  published: 'Publicado',
  rejected:  'Rejeitado',
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending:   { bg: '#FEF3C7', text: '#92400E' },
  published: { bg: '#D1FAE5', text: '#065F46' },
  rejected:  { bg: '#FEE2E2', text: '#991B1B' },
}

export default async function AdminArtigosPage() {
  await requireRole(['admin', 'editor'])
  const supabase = await createClient()

  const { data: artigos } = await supabase
    .from('articles')
    .select('id, title, category, status, source_name, published_at, created_at, read_count')
    .order('created_at', { ascending: false })
    .limit(100)

  const pendentes = (artigos ?? []).filter(a => a.status === 'pending')
  const publicados = (artigos ?? []).filter(a => a.status === 'published')
  const rejeitados = (artigos ?? []).filter(a => a.status === 'rejected')

  function ArtigoRow({ artigo }: { artigo: Article }) {
    const statusColor = STATUS_COLORS[artigo.status] ?? STATUS_COLORS.pending
    const categoryLabel = CATEGORY_LABELS[artigo.category as keyof typeof CATEGORY_LABELS] ?? artigo.category

    return (
      <div
        className="flex items-center gap-4 py-3 px-4 border-b last:border-0"
        style={{ borderColor: '#E5E7EB' }}
      >
        <div className="flex-1 min-w-0">
          <Link
            href={`/admin/artigos/${artigo.id}`}
            className="font-semibold text-sm leading-snug hover:opacity-70 transition-opacity line-clamp-1"
            style={{ color: '#2D2D2D' }}
          >
            {artigo.title}
          </Link>
          <p className="text-xs mt-0.5" style={{ color: '#666666' }}>
            {artigo.source_name && <span>{artigo.source_name} · </span>}
            <span
              className="inline-block px-1.5 py-0.5 rounded text-xs font-medium mr-1"
              style={{ backgroundColor: '#E8941F20', color: '#E8941F' }}
            >
              {categoryLabel}
            </span>
            {artigo.created_at && formatDistanceToNow(new Date(artigo.created_at), { locale: ptBR, addSuffix: true })}
          </p>
        </div>

        <span
          className="flex-shrink-0 text-xs font-semibold px-2 py-1 rounded-full"
          style={{ backgroundColor: statusColor.bg, color: statusColor.text }}
        >
          {STATUS_LABELS[artigo.status] ?? artigo.status}
        </span>

        <div className="flex-shrink-0">
          <ArticleActions articleId={artigo.id} currentStatus={artigo.status} />
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black" style={{ color: '#2D2D2D' }}>
            Fila Editorial
          </h1>
          <p className="text-sm mt-1" style={{ color: '#666666' }}>
            {pendentes.length} pendente{pendentes.length !== 1 ? 's' : ''} de revisão
          </p>
        </div>
      </div>

      {/* Pendentes */}
      {pendentes.length > 0 && (
        <div
          className="rounded-xl border mb-6 overflow-hidden"
          style={{ borderColor: '#E8941F40', backgroundColor: '#FFFFFF' }}
        >
          <div className="px-4 py-3 border-b" style={{ borderColor: '#E5E7EB', backgroundColor: '#FEF3C7' }}>
            <h2 className="text-sm font-bold" style={{ color: '#92400E' }}>
              Aguardando revisão ({pendentes.length})
            </h2>
          </div>
          {pendentes.map(a => <ArtigoRow key={a.id} artigo={a as Article} />)}
        </div>
      )}

      {pendentes.length === 0 && (
        <div
          className="rounded-xl border p-8 text-center mb-6"
          style={{ borderColor: '#E5E7EB', backgroundColor: '#FFFFFF' }}
        >
          <p className="text-sm" style={{ color: '#666666' }}>
            Nenhum artigo pendente. A fila está em dia.
          </p>
        </div>
      )}

      {/* Publicados recentes */}
      {publicados.length > 0 && (
        <div
          className="rounded-xl border mb-6 overflow-hidden"
          style={{ borderColor: '#E5E7EB', backgroundColor: '#FFFFFF' }}
        >
          <div className="px-4 py-3 border-b" style={{ borderColor: '#E5E7EB' }}>
            <h2 className="text-sm font-bold" style={{ color: '#666666' }}>
              Publicados recentemente ({publicados.length})
            </h2>
          </div>
          {publicados.slice(0, 10).map(a => <ArtigoRow key={a.id} artigo={a as Article} />)}
        </div>
      )}

      {/* Rejeitados */}
      {rejeitados.length > 0 && (
        <div
          className="rounded-xl border overflow-hidden"
          style={{ borderColor: '#E5E7EB', backgroundColor: '#FFFFFF' }}
        >
          <div className="px-4 py-3 border-b" style={{ borderColor: '#E5E7EB' }}>
            <h2 className="text-sm font-bold" style={{ color: '#666666' }}>
              Rejeitados ({rejeitados.length})
            </h2>
          </div>
          {rejeitados.slice(0, 5).map(a => <ArtigoRow key={a.id} artigo={a as Article} />)}
        </div>
      )}
    </div>
  )
}
