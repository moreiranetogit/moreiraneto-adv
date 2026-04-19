// ═══════════════════════════════════════════════════════════════════════════
// Tipos compartilhados — moreiraneto.adv.br
// ═══════════════════════════════════════════════════════════════════════════

export type UserRole = 'admin' | 'editor' | 'voluntaria_amaa'

export type ArticleStatus = 'pending' | 'published' | 'rejected'

export type AnimalStatus = 'pending' | 'published' | 'adopted' | 'rejected'

export type DenunciaStatus = 'nova' | 'em_apuracao' | 'encerrada'

export type ArticleCategory =
  | 'agrario'
  | 'civil'
  | 'trabalhista'
  | 'familia'
  | 'animal'
  | 'advocacia'
  | 'oab'

export type PortalTheme = 'light' | 'dark' | 'sepia'

// ── Mapeamentos de exibição ──────────────────────────────────────────────────

export const CATEGORY_LABELS: Record<ArticleCategory, string> = {
  agrario:     'Direito Agrário',
  civil:       'Direito Civil',
  trabalhista: 'Direito Trabalhista',
  familia:     'Direito de Família',
  animal:      'Direito Animal',
  advocacia:   'Advocacia & Jurídico',
  oab:         'OAB & Carreira',
}

export const CATEGORY_COLORS: Record<ArticleCategory, string> = {
  agrario:     '#16a34a', // verde
  civil:       '#2563eb', // azul
  trabalhista: '#d97706', // âmbar
  familia:     '#9333ea', // roxo
  animal:      '#059669', // esmeralda
  advocacia:   '#E8941F', // laranja MNA
  oab:         '#dc2626', // vermelho
}

export const CATEGORY_SLUGS: Record<string, ArticleCategory> = {
  agrario:     'agrario',
  civil:       'civil',
  trabalhista: 'trabalhista',
  familia:     'familia',
  animal:      'animal',
  advocacia:   'advocacia',
  oab:         'oab',
}

// ── Entidades do banco ───────────────────────────────────────────────────────

export interface Profile {
  id:         string
  full_name:  string
  role:       UserRole
  avatar_url: string | null
  phone:      string | null
  active:     boolean
  created_at: string
  updated_at: string
}

export interface Article {
  id:            string
  title:         string
  slug:          string | null
  excerpt:       string | null
  content:       string | null
  category:      ArticleCategory
  image_url:     string | null
  source_url:    string | null
  source_name:   string | null
  rss_source_id: string | null
  author_id:     string | null
  status:        ArticleStatus
  featured:      boolean
  read_count:    number
  published_at:  string | null
  created_at:    string
  updated_at:    string
}

export interface RSSSource {
  id:           number
  nome:         string
  url:          string
  tipo:         'rss' | 'web'
  categoria_id: number | null
  ativo:        boolean
  ultima_busca: string | null
  created_at:   string
  updated_at:   string
}

export interface Animal {
  id:              string
  nome:            string
  especie:         string
  raca:            string | null
  sexo:            string
  porte:           string
  idade_categoria: string
  situacao:        string
  temperamento:    string[] | null
  convivencia:     string[] | null
  comportamento:   string | null
  castrado:        string
  vacinado:        string
  vermifugado:     string
  antipulga:       string
  microchip:       string
  tratamento_ativo: boolean
  obs_saude:       string | null
  descricao:       string
  adotante_ideal:  string | null
  fotos:           string[] | null
  urgencia:        string
  status:          AnimalStatus
  voluntaria_id:   string | null
  approved_by:     string | null
  approved_at:     string | null
  adopted_at:      string | null
  created_at:      string
  updated_at:      string
}

export interface Denuncia {
  id:            string
  endereco:      string
  bairro:        string | null
  cidade:        string | null
  estado:        string
  tipo_animal:   string
  qtd_animais:   string | null
  tipo_abuso:    string[]
  descricao:     string
  frequencia:    string | null
  suspeito_desc: string | null
  anonima:       boolean
  contato_nome:  string | null
  contato_tel:   string | null
  contato_email: string | null
  anexos:        string[] | null
  status:        DenunciaStatus
  atendida_por:  string | null
  obs_interna:   string | null
  created_at:    string
  updated_at:    string
}

// ── RSS ──────────────────────────────────────────────────────────────────────

export interface RssItem {
  title:       string
  link:        string
  pubDate:     string | null
  contentSnippet: string | null
  content:     string | null
  enclosure?:  { url: string; type?: string }
  'media:content'?: { $: { url: string } }
}
