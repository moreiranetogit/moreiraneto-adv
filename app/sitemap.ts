import { createClient } from '@/lib/supabase/server'
import type { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://moreiraneto.adv.br'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()

  // Artigos publicados
  const { data: artigos } = await supabase
    .from('articles')
    .select('slug, id, updated_at, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(1000)

  const artigoUrls: MetadataRoute.Sitemap = (artigos ?? []).map(a => ({
    url: `${BASE_URL}/noticias-e-opinioes/artigo/${a.slug ?? a.id}`,
    lastModified: new Date(a.updated_at ?? a.published_at ?? Date.now()),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const categorias = ['agrario', 'civil', 'trabalhista', 'familia', 'animal', 'advocacia', 'oab']
  const areas = ['direito-agrario', 'direito-civil', 'direito-trabalhista', 'direito-de-familia', 'direito-animal', 'direito-geral']

  return [
    // Páginas estáticas de alto valor
    { url: BASE_URL,                              lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE_URL}/noticias-e-opinioes`,     lastModified: new Date(), changeFrequency: 'hourly',  priority: 0.9 },
    { url: `${BASE_URL}/amaa`,                    lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },

    // Categorias do portal
    ...categorias.map(cat => ({
      url: `${BASE_URL}/noticias-e-opinioes/${cat}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    })),

    // Áreas de atuação
    ...areas.map(area => ({
      url: `${BASE_URL}/areas/${area}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),

    // Artigos
    ...artigoUrls,
  ]
}
