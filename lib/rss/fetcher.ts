import Parser from 'rss-parser'
import { createAdminClient } from '@/lib/supabase/server'
import { generateArticleImage } from '@/lib/gemini'
import { RSS_SOURCES } from './sources'
import type { ArticleCategory } from '@/types'

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'mediaContent', { keepArray: false }],
      ['media:thumbnail', 'mediaThumbnail', { keepArray: false }],
      ['enclosure', 'enclosure'],
    ],
  },
  timeout: 10000,
  headers: {
    'User-Agent': 'Despacho/MNA RSS Reader (+https://moreiraneto.adv.br)',
  },
})

/**
 * Extrai a melhor URL de imagem disponível no item RSS.
 */
function extractImageUrl(item: Record<string, unknown>): string | null {
  // 1. enclosure (padrão RSS 2.0)
  const enc = item.enclosure as { url?: string; type?: string } | undefined
  if (enc?.url && enc.type?.startsWith('image')) return enc.url

  // 2. media:content (Media RSS)
  const mc = item.mediaContent as { $?: { url?: string } } | undefined
  if (mc?.$?.url) return mc.$.url

  // 3. media:thumbnail
  const mt = item.mediaThumbnail as { $?: { url?: string } } | undefined
  if (mt?.$?.url) return mt.$.url

  // 4. OG image no conteúdo HTML (regex simples)
  const content = (item.content ?? item['content:encoded'] ?? '') as string
  const match = content.match(/<img[^>]+src=["']([^"']+)["']/i)
  if (match?.[1]) return match[1]

  return null
}

/**
 * Busca e persiste artigos de todas as fontes RSS ativas.
 * Chamado pelo cron job em /api/rss/refresh.
 */
export async function fetchAllSources(): Promise<{
  created: number
  skipped: number
  errors: string[]
}> {
  const supabase = createAdminClient()
  let created = 0
  let skipped = 0
  const errors: string[] = []

  for (const source of RSS_SOURCES) {
    try {
      const feed = await parser.parseURL(source.url)

      // Atualiza last_fetched na tabela rss_sources
      await supabase
        .from('rss_sources')
        .upsert({
          url:          source.url,
          name:         source.name,
          site_url:     source.siteUrl,
          category:     source.category,
          active:       true,
          last_fetched: new Date().toISOString(),
          fetch_count:  1, // será somado via increment no DB
        }, { onConflict: 'url', ignoreDuplicates: false })

      const items = (feed.items ?? []).slice(0, 10) // máx 10 por fonte/ciclo

      for (const item of items) {
        if (!item.title || !item.link) continue

        // Verifica se já existe (por source_url)
        const { data: existing } = await supabase
          .from('articles')
          .select('id')
          .eq('source_url', item.link)
          .single()

        if (existing) { skipped++; continue }

        // Extrai ou gera imagem
        let imageUrl = extractImageUrl(item as Record<string, unknown>)

        if (!imageUrl) {
          // Tenta gerar via Gemini (pode falhar — não bloqueia)
          try {
            imageUrl = await generateArticleImage(item.title, source.category)
          } catch {
            imageUrl = null
          }
        }

        // Insere artigo com status 'pending' (aguarda aprovação editorial)
        const { error: insertError } = await supabase.from('articles').insert({
          title:       item.title.trim(),
          excerpt:     item.contentSnippet?.slice(0, 300) ?? null,
          content:     item.content ?? item.contentSnippet ?? null,
          category:    source.category,
          image_url:   imageUrl,
          source_url:  item.link,
          source_name: source.name,
          status:      'pending',
          published_at: item.pubDate ? new Date(item.pubDate).toISOString() : null,
        })

        if (insertError) {
          errors.push(`${source.name}: ${insertError.message}`)
        } else {
          created++
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      errors.push(`${source.name} (${source.url}): ${msg}`)

      // Incrementa error_count no banco
      await supabase.rpc('increment_rss_error', { source_url: source.url })
        .catch(() => {}) // não-crítico
    }
  }

  return { created, skipped, errors }
}

/**
 * Busca apenas as fontes de uma categoria específica.
 */
export async function fetchByCategory(category: ArticleCategory) {
  const filtered = RSS_SOURCES.filter(s => s.category === category)
  const tempSources = RSS_SOURCES.splice(0)
  RSS_SOURCES.length = 0
  RSS_SOURCES.push(...filtered)
  const result = await fetchAllSources()
  RSS_SOURCES.length = 0
  RSS_SOURCES.push(...tempSources)
  return result
}
