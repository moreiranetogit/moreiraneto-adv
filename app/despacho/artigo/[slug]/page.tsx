// ═══════════════════════════════════════════════════════════════════════════
// Página de Artigo Individual — Portal Despacho
// moreiraneto.adv.br/despacho/artigo/[slug]
// ═══════════════════════════════════════════════════════════════════════════

import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { formatDistanceToNow, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { Metadata } from 'next'
import type { Article } from '@/types'
import { CATEGORY_LABELS, CATEGORY_COLORS } from '@/types'

export const revalidate = 300

// ── Params ──────────────────────────────────────────────────────────────────

interface Params {
  params: { slug: string }
}

// ── Busca artigo ────────────────────────────────────────────────────────────

async function getArtigo(slug: string): Promise<Article | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error || !data) return null

  // Incrementa read_count de forma assíncrona (fire-and-forget)
  supabase
    .from('articles')
    .update({ read_count: (data.read_count ?? 0) + 1 })
    .eq('id', data.id)
    .then(() => {})

  return data as Article
}

// ── Artigos relacionados ────────────────────────────────────────────────────

async function getRelacionados(category: string, excludeId: string): Promise<Article[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('articles')
    .select('id, title, slug, excerpt, image_url, category, published_at, source_name')
    .eq('category', category)
    .eq('status', 'published')
    .neq('id', excludeId)
    .order('published_at', { ascending: false })
    .limit(4)

  return (data as Article[]) ?? []
}

// ── Metadata dinâmica ───────────────────────────────────────────────────────

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const artigo = await getArtigo(params.slug)
  if (!artigo) return { title: 'Artigo não encontrado — Despacho' }

  return {
    title: `${artigo.title} — Despacho, por MNA`,
    description: artigo.excerpt ?? undefined,
    openGraph: {
      title: artigo.title,
      description: artigo.excerpt ?? undefined,
      images: artigo.image_url ? [artigo.image_url] : [],
      type: 'article',
      publishedTime: artigo.published_at ?? undefined,
    },
  }
}

// ── Formata conteúdo ────────────────────────────────────────────────────────

function renderContent(content: string | null): string {
  if (!content) return ''
  // Se já vier com HTML (ex: de RSS), retorna direto
  if (content.startsWith('<')) return content
  // Senão, quebra em parágrafos
  return content
    .split('\n\n')
    .filter(Boolean)
    .map(p => `<p class="mb-4">${p.replace(/\n/g, '<br>')}</p>`)
    .join('')
}

// ── Página ──────────────────────────────────────────────────────────────────

export default async function ArtigoPage({ params }: Params) {
  const artigo = await getArtigo(params.slug)
  if (!artigo) notFound()

  const relacionados = await getRelacionados(artigo.category, artigo.id)

  const categoryLabel = CATEGORY_LABELS[artigo.category] ?? artigo.category
  const categoryColor = CATEGORY_COLORS[artigo.category] ?? '#E8941F'

  const publishedAt = artigo.published_at
    ? format(new Date(artigo.published_at), "d 'de' MMMM 'de' yyyy", { locale: ptBR })
    : null

  const timeAgo = artigo.published_at
    ? formatDistanceToNow(new Date(artigo.published_at), { locale: ptBR, addSuffix: true })
    : null

  const htmlContent = renderContent(artigo.content)

  return (
    <>
      {/* Breadcrumb + cabeçalho do artigo ficam dentro do layout do portal */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-6" style={{ color: 'var(--color-muted)' }}>
          <Link href="/despacho" className="hover:text-accent transition-colors">
            Despacho
          </Link>
          <span>/</span>
          <Link
            href={`/despacho/${artigo.category}`}
            className="hover:text-accent transition-colors"
          >
            {categoryLabel}
          </Link>
          <span>/</span>
          <span className="truncate max-w-xs">{artigo.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10">

          {/* ── ARTIGO PRINCIPAL ──────────────────────────────────── */}
          <article>

            {/* Badge de categoria */}
            <div className="mb-4">
              <span
                className="category-badge"
                style={{ backgroundColor: categoryColor + '20', color: categoryColor }}
              >
                {categoryLabel}
              </span>
            </div>

            {/* Título */}
            <h1
              className="text-2xl md:text-3xl font-black leading-tight mb-4"
              style={{ color: 'var(--color-text)' }}
            >
              {artigo.title}
            </h1>

            {/* Meta: data, fonte, leituras */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm" style={{ color: 'var(--color-muted)' }}>
              {publishedAt && (
                <time dateTime={artigo.published_at ?? ''} title={publishedAt}>
                  📅 {timeAgo}
                </time>
              )}
              {artigo.source_name && (
                <span>
                  📰 {artigo.source_name}
                </span>
              )}
              {artigo.read_count > 0 && (
                <span>👁️ {artigo.read_count.toLocaleString('pt-BR')} leituras</span>
              )}
            </div>

            {/* Excerpt em destaque */}
            {artigo.excerpt && (
              <div
                className="text-base leading-relaxed border-l-4 pl-4 mb-6 italic"
                style={{
                  borderColor: categoryColor,
                  color: 'var(--color-muted)',
                }}
              >
                {artigo.excerpt}
              </div>
            )}

            {/* Imagem principal */}
            {artigo.image_url && (
              <div className="relative mb-6 rounded-xl overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={artigo.image_url}
                  alt={artigo.title}
                  className="w-full object-cover max-h-80"
                />
              </div>
            )}

            {/* Conteúdo do artigo */}
            {artigo.content ? (
              <div
                className="prose prose-sm max-w-none"
                style={{ color: 'var(--color-text)' }}
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            ) : (
              <div
                className="rounded-xl p-6 text-center"
                style={{ backgroundColor: 'var(--color-surface2)', color: 'var(--color-muted)' }}
              >
                <p className="mb-3">O conteúdo completo está disponível na fonte original.</p>
                {artigo.source_url && (
                  <a
                    href={artigo.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-semibold transition-colors"
                    style={{ color: 'var(--color-accent)' }}
                  >
                    Ler artigo completo em {artigo.source_name ?? 'fonte original'} →
                  </a>
                )}
              </div>
            )}

            {/* Rodapé do artigo */}
            <div
              className="mt-8 pt-6 border-t flex flex-wrap items-center justify-between gap-4 text-sm"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-muted)' }}
            >
              <div>
                {publishedAt && <p>Publicado em {publishedAt}</p>}
                {artigo.source_name && artigo.source_url && (
                  <p className="mt-1">
                    Fonte:{' '}
                    <a
                      href={artigo.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                      style={{ color: 'var(--color-accent)' }}
                    >
                      {artigo.source_name}
                    </a>
                  </p>
                )}
              </div>
              <Link
                href={`/despacho/${artigo.category}`}
                className="hover:opacity-80 transition-opacity text-xs font-semibold"
                style={{ color: 'var(--color-accent)' }}
              >
                ← Mais em {categoryLabel}
              </Link>
            </div>

          </article>

          {/* ── SIDEBAR ───────────────────────────────────────────── */}
          <aside className="space-y-6">

            {/* Artigos relacionados */}
            {relacionados.length > 0 && (
              <div
                className="rounded-xl border p-4"
                style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
              >
                <h3
                  className="font-bold text-sm mb-4 uppercase tracking-wide"
                  style={{ color: 'var(--color-muted)' }}
                >
                  Leia também
                </h3>
                <div className="space-y-4">
                  {relacionados.map(rel => (
                    <Link
                      key={rel.id}
                      href={`/despacho/artigo/${rel.slug}`}
                      className="group flex gap-3 items-start"
                    >
                      {rel.image_url && (
                        <div className="flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden bg-gray-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={rel.image_url}
                            alt=""
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm font-semibold leading-snug line-clamp-2 group-hover:opacity-70 transition-opacity"
                          style={{ color: 'var(--color-text)' }}
                        >
                          {rel.title}
                        </p>
                        {rel.published_at && (
                          <p className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>
                            {formatDistanceToNow(new Date(rel.published_at), { locale: ptBR, addSuffix: true })}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
                <Link
                  href={`/despacho/${artigo.category}`}
                  className="block mt-4 text-xs font-semibold text-center transition-colors hover:opacity-70"
                  style={{ color: 'var(--color-accent)' }}
                >
                  Ver todas em {categoryLabel} →
                </Link>
              </div>
            )}

            {/* Box Despacho */}
            <div
              className="rounded-xl p-4 text-center border"
              style={{
                backgroundColor: 'var(--color-surface2)',
                borderColor: 'var(--color-border)',
              }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-black text-lg mx-auto mb-3"
                style={{ backgroundColor: '#E8941F' }}
              >
                M
              </div>
              <p
                className="text-sm font-bold mb-1"
                style={{ color: 'var(--color-text)' }}
              >
                Despacho, por MNA
              </p>
              <p className="text-xs mb-3" style={{ color: 'var(--color-muted)' }}>
                Notícias jurídicas selecionadas para o sudoeste paranaense.
              </p>
              <Link
                href="/despacho"
                className="block text-xs font-semibold transition-colors"
                style={{ color: 'var(--color-accent)' }}
              >
                ← Voltar ao portal
              </Link>
            </div>

            {/* Box MNA */}
            <div
              className="rounded-xl p-4 border"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
            >
              <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: 'var(--color-muted)' }}>
                Precisa de orientação jurídica?
              </p>
              <p className="text-sm mb-3" style={{ color: 'var(--color-text)' }}>
                A Moreira Neto Advocacia atua em Direito Agrário, Civil, Trabalhista, Família e Direito Animal.
              </p>
              <a
                href="/#contato"
                className="block w-full text-center py-2 rounded-lg text-sm font-bold text-white transition-colors"
                style={{ backgroundColor: '#E8941F' }}
              >
                Fale com um advogado →
              </a>
            </div>

          </aside>

        </div>
      </div>
    </>
  )
}
