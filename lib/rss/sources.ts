import type { ArticleCategory } from '@/types'

export interface RssSourceConfig {
  name:     string
  url:      string
  siteUrl:  string
  category: ArticleCategory
  /** Seletor XPath/CSS específico de imagem, se o RSS não inclui enclosure */
  imageSelector?: string
}

/**
 * Fontes RSS por categoria.
 *
 * ⚠️  MOMENTO DE PERSONALIZAÇÃO:
 * O usuário irá confirmar/adicionar fontes aqui.
 * Adicione novos objetos seguindo o padrão abaixo.
 * O fetcher usa esta lista para buscar e importar artigos automaticamente.
 */
export const RSS_SOURCES: RssSourceConfig[] = [

  // ── ADVOCACIA & JURÍDICO GERAL ──────────────────────────────────────────
  {
    name:     'Migalhas',
    url:      'https://www.migalhas.uol.com.br/rss/quentes',
    siteUrl:  'https://migalhas.uol.com.br',
    category: 'advocacia',
  },
  {
    name:     'Conjur',
    url:      'https://www.conjur.com.br/rss.xml',
    siteUrl:  'https://conjur.com.br',
    category: 'advocacia',
  },
  {
    name:     'JOTA',
    url:      'https://www.jota.info/feed',
    siteUrl:  'https://jota.info',
    category: 'advocacia',
  },
  {
    name:     'Estadão Jurídico',
    url:      'https://politica.estadao.com.br/blogs/fausto-macedo/feed/',
    siteUrl:  'https://estadao.com.br',
    category: 'advocacia',
  },

  // ── OAB & CARREIRA ──────────────────────────────────────────────────────
  {
    name:     'OAB Federal',
    url:      'https://www.oab.org.br/rss/noticias',
    siteUrl:  'https://oab.org.br',
    category: 'oab',
  },
  {
    name:     'OAB Paraná',
    url:      'https://www.oabpr.org.br/feed/',
    siteUrl:  'https://oabpr.org.br',
    category: 'oab',
  },
  {
    name:     'Advocacia PR (G1)',
    url:      'https://g1.globo.com/rss/g1/pr/',
    siteUrl:  'https://g1.globo.com/pr',
    category: 'oab',
  },

  // ── DIREITO CIVIL ────────────────────────────────────────────────────────
  {
    name:     'STJ Notícias',
    url:      'https://www.stj.jus.br/sites/portalp/RSS/noticias',
    siteUrl:  'https://stj.jus.br',
    category: 'civil',
  },
  {
    name:     'STF Notícias',
    url:      'https://portal.stf.jus.br/rss/noticiasrss.asp',
    siteUrl:  'https://stf.jus.br',
    category: 'civil',
  },

  // ── DIREITO TRABALHISTA ──────────────────────────────────────────────────
  {
    name:     'TST Notícias',
    url:      'https://www.tst.jus.br/rss',
    siteUrl:  'https://tst.jus.br',
    category: 'trabalhista',
  },
  {
    name:     'LexMagister Trabalhista',
    url:      'https://www.lex.com.br/noticias/rss/?categoria=trabalho',
    siteUrl:  'https://lex.com.br',
    category: 'trabalhista',
  },

  // ── DIREITO DE FAMÍLIA ──────────────────────────────────────────────────
  {
    name:     'IBDFAM',
    url:      'https://ibdfam.org.br/rss.xml',
    siteUrl:  'https://ibdfam.org.br',
    category: 'familia',
  },
  {
    name:     'Direito de Família (Migalhas)',
    url:      'https://www.migalhas.uol.com.br/rss/familia',
    siteUrl:  'https://migalhas.uol.com.br',
    category: 'familia',
  },

  // ── DIREITO AGRÁRIO ──────────────────────────────────────────────────────
  {
    name:     'Agrolink',
    url:      'https://www.agrolink.com.br/rss',
    siteUrl:  'https://agrolink.com.br',
    category: 'agrario',
  },
  {
    name:     'CNA Brasil',
    url:      'https://www.cnabrasil.org.br/feed',
    siteUrl:  'https://cnabrasil.org.br',
    category: 'agrario',
  },
  {
    name:     'Agronews TV',
    url:      'https://www.agronews.tv.br/feed/',
    siteUrl:  'https://agronews.tv.br',
    category: 'agrario',
  },
  {
    name:     'Canal Rural',
    url:      'https://www.canalrural.com.br/rss',
    siteUrl:  'https://canalrural.com.br',
    category: 'agrario',
  },
  {
    name:     'Notícias Agrícolas',
    url:      'https://www.noticiasagricolas.com.br/rss.xml',
    siteUrl:  'https://noticiasagricolas.com.br',
    category: 'agrario',
  },

  // ── DIREITO ANIMAL ──────────────────────────────────────────────────────
  {
    name:     'IBDA',
    url:      'https://ibda.com.br/feed',
    siteUrl:  'https://ibda.com.br',
    category: 'animal',
  },
  {
    name:     'Direito Animal (Migalhas)',
    url:      'https://www.migalhas.uol.com.br/rss/animal',
    siteUrl:  'https://migalhas.uol.com.br',
    category: 'animal',
  },
  {
    name:     'ONG Ampara Animal',
    url:      'https://amparanimal.org.br/feed/',
    siteUrl:  'https://amparanimal.org.br',
    category: 'animal',
  },
]

/**
 * Retorna fontes filtradas por categoria.
 */
export function getSourcesByCategory(category: ArticleCategory): RssSourceConfig[] {
  return RSS_SOURCES.filter(s => s.category === category)
}
