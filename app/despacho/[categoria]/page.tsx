import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  CATEGORY_SLUGS,
  type Article,
  type ArticleCategory,
} from '@/types'

export const revalidate = 300

interface Props {
  params: Promise<{ categoria: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateStaticParams() {
  return Object.keys(CATEGORY_SLUGS).map(slug => ({ categoria: slug }))
}

export async function generateMetadata({ params }: Props) {
  const { categoria } = await params
  const category = CATEGORY_SLUGS[categoria]
  if (!category) return {}
  return {
    title: CATEGORY_LABELS[category],
    description: `Notícias jurídicas sobre ${CATEGORY_LABELS[category]} — Despacho, por MNA`,
  }
}

const PAGE_SIZE = 18

export default async function CategoriaPage({ params, searchParams }: Props) {
  const { categoria } = await params
  const { page: pageStr } = await searchParams
  const category = CATEGORY_SLUGS[categoria] as ArticleCategory | undefined

  if (!category) notFound()

  const page = Math.max(1, parseInt(pageStr ?? '1'))
  const offset = (page - 1) * PAGE_SIZE

  const supabase = await createClient()
  const { data: articles, count } = await supabase
    .from('articles')
    .select('*', { count: 'exact' })
    .eq('status', 'published')
    .eq('category', category)
    .order('published_at', { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1)

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE)
  const color = CATEGORY_COLORS[category]
  const label = CATEGORY_LABELS[category]

  return (
    <div>
      {/* Cabeçalho */}
      <div className="mb-8 pb-4" style={{ borderBottom: `3px solid ${color}` }}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full" style={{ background: color }} />
          <span className="text-xs font-bold uppercase tracking-wider"
            style={{ color: 'var(--color-muted)' }}>
            Categoria
          </span>
        </div>
        <h1 className="text-3xl font-black" style={{ color: 'var(--color-text)' }}>
          {label}
        </h1>
        {count !== null && (
          <p className="text-sm mt-1" style={{ color: 'var(--color-muted)' }}>
            {count} notícias publicadas
          </p>
        )}
      </div>

      {/* Grid */}
      {articles && articles.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {articles.map((article: Article) => (
              <Link
                key={article.id}
                href={`/despacho/artigo/${article.slug ?? article.id}`}
                className="news-card block group"
              >
                {article.image_url ? (
                  <div className="relative" style={{ aspectRatio: '16/9' }}>
                    <Image src={article.image_url} alt={article.title}
                      fill className="object-cover transition-transform group-hover:scale-105" />
                  </div>
                ) : (
                  <div className="flex items-center justify-center text-3xl"
                    style={{ aspectRatio: '16/9', background: color + '15' }}>
                    📰
                  </div>
                )}
                <div className="p-4">
                  <h2 className="font-bold text-base leading-snug mb-2 group-hover:text-amber-600 transition-colors line-clamp-3"
                    style={{ color: 'var(--color-text)' }}>
                    {article.title}
                  </h2>
                  {article.excerpt && (
                    <p className="text-sm line-clamp-2 mb-3"
                      style={{ color: 'var(--color-muted)' }}>
                      {article.excerpt}
                    </p>
                  )}
                  <div className="flex justify-between text-xs"
                    style={{ color: 'var(--color-muted)' }}>
                    <span>{article.source_name}</span>
                    <span>
                      {article.published_at
                        ? formatDistanceToNow(new Date(article.published_at),
                            { addSuffix: true, locale: ptBR })
                        : ''}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              {page > 1 && (
                <Link href={`/despacho/${categoria}?page=${page - 1}`}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text)',
                  }}>
                  ← Anterior
                </Link>
              )}
              <span className="px-4 py-2 rounded-lg text-sm"
                style={{ color: 'var(--color-muted)' }}>
                {page} / {totalPages}
              </span>
              {page < totalPages && (
                <Link href={`/despacho/${categoria}?page=${page + 1}`}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    background: color,
                    color: '#fff',
                  }}>
                  Próxima →
                </Link>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">📭</p>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
            Nenhuma notícia ainda
          </h2>
          <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
            As notícias de {label} aparecerão aqui após a primeira sincronização RSS.
          </p>
        </div>
      )}
    </div>
  )
}
