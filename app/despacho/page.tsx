import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CATEGORY_LABELS, CATEGORY_COLORS, type Article, type ArticleCategory } from '@/types'

export const revalidate = 300 // Revalida a cada 5 minutos

async function getArticles() {
  const supabase = await createClient()

  const { data: featured } = await supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .eq('featured', true)
    .order('published_at', { ascending: false })
    .limit(3)

  const { data: recent } = await supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(20)

  // Agrupa recentes por categoria
  const byCategory: Record<string, Article[]> = {}
  for (const article of recent ?? []) {
    if (!byCategory[article.category]) byCategory[article.category] = []
    if (byCategory[article.category].length < 4) {
      byCategory[article.category].push(article)
    }
  }

  return { featured: featured ?? [], byCategory }
}

function timeAgo(dateStr: string | null) {
  if (!dateStr) return ''
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: ptBR })
}

function CategoryBadge({ category }: { category: ArticleCategory }) {
  const color = CATEGORY_COLORS[category]
  const label = CATEGORY_LABELS[category]
  return (
    <span className="category-badge text-white text-xs"
      style={{ background: color }}>
      {label.replace('Direito ', '')}
    </span>
  )
}

function NewsCard({ article, size = 'md' }: { article: Article; size?: 'lg' | 'md' | 'sm' }) {
  const isLg = size === 'lg'
  const isSm = size === 'sm'

  return (
    <Link href={`/despacho/artigo/${article.slug ?? article.id}`} className="news-card block group">
      {/* Imagem */}
      {!isSm && (
        <div className="relative overflow-hidden"
          style={{ aspectRatio: isLg ? '16/7' : '16/9' }}>
          {article.image_url ? (
            <Image
              src={article.image_url}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes={isLg ? '800px' : '400px'}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl"
              style={{ background: CATEGORY_COLORS[article.category] + '20' }}>
              📰
            </div>
          )}
          <div className="absolute top-3 left-3">
            <CategoryBadge category={article.category} />
          </div>
        </div>
      )}

      {/* Conteúdo */}
      <div className={`p-4 ${isSm ? 'flex gap-3 items-start' : ''}`}>
        {isSm && (
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: CATEGORY_COLORS[article.category],
            marginTop: 6, flexShrink: 0
          }} />
        )}
        <div>
          {isSm && <CategoryBadge category={article.category} />}
          <h3 className={`font-bold leading-snug mt-1 mb-2 group-hover:text-amber-600 transition-colors
            ${isLg ? 'text-xl' : isSm ? 'text-sm' : 'text-base'}`}
            style={{ color: 'var(--color-text)' }}>
            {article.title}
          </h3>
          {!isSm && article.excerpt && (
            <p className="text-sm leading-relaxed line-clamp-2 mb-3"
              style={{ color: 'var(--color-muted)' }}>
              {article.excerpt}
            </p>
          )}
          <div className="flex items-center justify-between text-xs"
            style={{ color: 'var(--color-muted)' }}>
            <span>{article.source_name}</span>
            <span>{timeAgo(article.published_at)}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default async function PortalHomePage() {
  const { featured, byCategory } = await getArticles()

  const categoryOrder: ArticleCategory[] = [
    'agrario', 'civil', 'trabalhista', 'familia', 'animal', 'advocacia', 'oab'
  ]

  return (
    <div className="space-y-10">

      {/* ── DESTAQUES ── */}
      {featured.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest mb-4"
            style={{ color: 'var(--color-muted)' }}>
            Em Destaque
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featured[0] && (
              <div className="md:col-span-2">
                <NewsCard article={featured[0]} size="lg" />
              </div>
            )}
            <div className="flex flex-col gap-4">
              {featured.slice(1).map(a => (
                <NewsCard key={a.id} article={a} size="md" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── SEÇÕES POR CATEGORIA ── */}
      {categoryOrder.map(cat => {
        const articles = byCategory[cat]
        if (!articles?.length) return null

        const color = CATEGORY_COLORS[cat]
        const label = CATEGORY_LABELS[cat]

        return (
          <section key={cat}>
            {/* Header da seção */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 rounded-full" style={{ background: color }} />
                <h2 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
                  {label}
                </h2>
              </div>
              <Link href={`/despacho/${cat}`}
                className="text-xs font-semibold hover:underline"
                style={{ color: color }}>
                Ver todas →
              </Link>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {articles.map(a => (
                <NewsCard key={a.id} article={a} size="md" />
              ))}
            </div>
          </section>
        )
      })}

      {/* ── ESTADO VAZIO ── */}
      {Object.keys(byCategory).length === 0 && (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">📰</p>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
            Portal em configuração
          </h2>
          <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
            As notícias aparecerão aqui após a primeira sincronização RSS.
          </p>
        </div>
      )}

    </div>
  )
}
