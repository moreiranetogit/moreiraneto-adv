import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CATEGORY_LABELS, CATEGORY_COLORS, type Article, type ArticleCategory } from '@/types'

export const revalidate = 300

const PAGE_SIZE = 10

interface Props {
  searchParams: Promise<{ page?: string }>
}

async function getPage1Data() {
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
    .limit(28)

  const byCategory: Record<string, Article[]> = {}
  for (const article of recent ?? []) {
    if (!byCategory[article.category]) byCategory[article.category] = []
    if (byCategory[article.category].length < 4) {
      byCategory[article.category].push(article)
    }
  }

  return { featured: featured ?? [], byCategory }
}

async function getPaginatedData(page: number) {
  const supabase = await createClient()
  const offset = (page - 1) * PAGE_SIZE

  const { data: articles, count } = await supabase
    .from('articles')
    .select('*', { count: 'exact' })
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1)

  return {
    articles: articles ?? [],
    totalPages: Math.ceil((count ?? 0) / PAGE_SIZE),
    total: count ?? 0,
  }
}

function timeAgo(dateStr: string | null) {
  if (!dateStr) return ''
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: ptBR })
}

function CategoryBadge({ category }: { category: ArticleCategory }) {
  const color = CATEGORY_COLORS[category]
  return (
    <span
      className="category-badge"
      style={{ backgroundColor: color + '22', color }}
    >
      {CATEGORY_LABELS[category].replace('Direito ', '')}
    </span>
  )
}

function NewsCard({ article, size = 'md' }: { article: Article; size?: 'lg' | 'md' | 'sm' }) {
  const isLg = size === 'lg'
  const isSm = size === 'sm'
  const color = CATEGORY_COLORS[article.category]

  return (
    <Link href={`/noticias-e-opinioes/artigo/${article.slug ?? article.id}`} className="news-card block group">
      {!isSm && (
        <div className="news-card-img-wrap" style={{ aspectRatio: isLg ? '16/7' : '16/9' }}>
          {article.image_url ? (
            <Image src={article.image_url} alt={article.title} fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes={isLg ? '800px' : '400px'} />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl"
              style={{ background: color + '18' }}>📰</div>
          )}
          <div className="category-badge-overlay">
            <CategoryBadge category={article.category} />
          </div>
        </div>
      )}
      <div className={`p-4 ${isSm ? 'flex gap-3 items-start' : ''}`}>
        {isSm && (
          <div style={{ width: 8, height: 8, borderRadius: '50%',
            background: color, marginTop: 6, flexShrink: 0 }} />
        )}
        <div className="flex-1 min-w-0">
          {isSm && <CategoryBadge category={article.category} />}
          <h3
            className={`font-bold leading-snug mt-1 mb-2 transition-colors
              ${isLg ? 'text-xl' : isSm ? 'text-sm' : 'text-base'}`}
            style={{ color: 'var(--color-text)' }}
          >
            <span className="group-hover:opacity-75 transition-opacity">{article.title}</span>
          </h3>
          {!isSm && article.excerpt && (
            <p className="text-sm leading-relaxed line-clamp-2 mb-3" style={{ color: 'var(--color-muted)' }}>
              {article.excerpt}
            </p>
          )}
          <div className="flex items-center justify-between text-xs" style={{ color: 'var(--color-muted)' }}>
            <span className="truncate mr-2">{article.source_name}</span>
            <span className="flex-shrink-0">{timeAgo(article.published_at)}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

function Pagination({ page, totalPages }: { page: number; totalPages: number }) {
  if (totalPages <= 1) return null

  // Calcula janela de páginas visíveis
  const delta = 2
  const range: (number | '...')[] = []
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
      range.push(i)
    } else if (range[range.length - 1] !== '...') {
      range.push('...')
    }
  }

  return (
    <nav className="flex items-center justify-center gap-1 flex-wrap py-8">
      {page > 1 && (
        <Link href={`/noticias-e-opinioes?page=${page - 1}`}
          className="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}>
          ← Anterior
        </Link>
      )}

      {range.map((r, i) =>
        r === '...' ? (
          <span key={`ellipsis-${i}`} className="px-2 py-2 text-sm" style={{ color: 'var(--color-muted)' }}>…</span>
        ) : (
          <Link key={r} href={`/noticias-e-opinioes?page=${r}`}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-sm font-semibold transition-colors"
            style={r === page
              ? { background: '#E8941F', color: '#fff' }
              : { background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }
            }>
            {r}
          </Link>
        )
      )}

      {page < totalPages && (
        <Link href={`/noticias-e-opinioes?page=${page + 1}`}
          className="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{ background: '#E8941F', color: '#fff' }}>
          Próxima →
        </Link>
      )}

      <span className="w-full text-center text-xs mt-2" style={{ color: 'var(--color-muted)' }}>
        Página {page} de {totalPages}
      </span>
    </nav>
  )
}

export default async function PortalHomePage({ searchParams }: Props) {
  const { page: pageStr } = await searchParams
  const page = Math.max(1, parseInt(pageStr ?? '1'))
  const isFirstPage = page === 1

  const categoryOrder: ArticleCategory[] = [
    'agrario', 'civil', 'trabalhista', 'familia', 'animal', 'advocacia', 'oab'
  ]

  if (isFirstPage) {
    const { featured, byCategory } = await getPage1Data()

    return (
      <div className="space-y-10">

        {/* DESTAQUES */}
        {featured.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-5 rounded-full" style={{ background: '#E8941F' }} />
              <h2 className="text-sm font-bold uppercase tracking-widest"
                style={{ color: 'var(--color-text)' }}>Em Destaque</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featured[0] && (
                <div className="md:col-span-2">
                  <NewsCard article={featured[0]} size="lg" />
                </div>
              )}
              <div className="flex flex-col gap-4">
                {featured.slice(1).map(a => <NewsCard key={a.id} article={a} size="md" />)}
              </div>
            </div>
          </section>
        )}

        {/* SEÇÕES POR CATEGORIA */}
        {categoryOrder.map(cat => {
          const articles = byCategory[cat]
          if (!articles?.length) return null
          const color = CATEGORY_COLORS[cat]
          const label = CATEGORY_LABELS[cat]
          return (
            <section key={cat}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-5 rounded-full" style={{ background: color }} />
                  <h2 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>{label}</h2>
                </div>
                <Link href={`/noticias-e-opinioes/${cat}`}
                  className="text-xs font-semibold hover:underline" style={{ color }}>
                  Ver todas →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {articles.map(a => <NewsCard key={a.id} article={a} size="md" />)}
              </div>
            </section>
          )
        })}

        {/* LINK PARA MAIS */}
        {Object.keys(byCategory).length > 0 && (
          <div className="text-center pt-4 pb-8">
            <Link href="/noticias-e-opinioes?page=2"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-colors"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}>
              Ver todas as notícias →
            </Link>
          </div>
        )}

        {/* ESTADO VAZIO */}
        {Object.keys(byCategory).length === 0 && (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">📰</p>
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>Radar Jurídico MNA em configuração</h2>
            <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
              As notícias aparecerão aqui após a primeira sincronização RSS.
            </p>
          </div>
        )}
      </div>
    )
  }

  // Páginas 2+: grid paginado
  const { articles, totalPages, total } = await getPaginatedData(page)

  return (
    <div>
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black" style={{ color: 'var(--color-text)' }}>Todas as notícias</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--color-muted)' }}>
            {total} notícias publicadas
          </p>
        </div>
        <Link href="/noticias-e-opinioes"
          className="text-xs font-medium hover:underline" style={{ color: 'var(--color-muted)' }}>
          ← Página inicial
        </Link>
      </div>

      {/* Grid */}
      {articles.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
            {articles.map(a => <NewsCard key={a.id} article={a} />)}
          </div>
          <Pagination page={page} totalPages={totalPages} />
        </>
      ) : (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">📰</p>
          <p className="text-sm" style={{ color: 'var(--color-muted)' }}>Nenhuma notícia nesta página.</p>
        </div>
      )}
    </div>
  )
}
