// ═══════════════════════════════════════════════════════════════════════════
// Homepage Institucional — Moreira Neto Advocacia
// moreiraneto.adv.br/
// Design: carvão escuro, acento dourado/laranja, tipografia elegante
// ═══════════════════════════════════════════════════════════════════════════

import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import NewsTicker from './NewsTicker'

export const metadata: Metadata = {
  title: 'Moreira Neto Advocacia — Realeza/PR',
  description:
    'Escritório de advocacia em Realeza/PR. Atuação em Direito Agrário, Civil, Trabalhista, Família e Direito Animal. Assessoria jurídica completa para pessoas físicas e empresas do agronegócio.',
  openGraph: {
    title: 'Moreira Neto Advocacia',
    description: 'Advocacia especializada em Realeza/PR e região sudoeste do Paraná.',
    url: 'https://moreiraneto.adv.br',
    type: 'website',
  },
}

export const revalidate = 300

// ── Paleta ────────────────────────────────────────────────────────────────
// Carvão base:  #111111
// Carvão card:  #1a1a1a
// Carvão borda: #2a2a2a
// Dourado MNA:  #E8941F
// Prata MNA:    #9CA3AF
// Verde AMAA:   #14532d (emerald-900)

// ── Dados estáticos ──────────────────────────────────────────────────────

const AREAS = [
  {
    titulo: 'Direito Agrário',
    desc: 'Contratos rurais, arrendamento, parceria agrícola, regularização fundiária e disputas envolvendo propriedades rurais no sudoeste paranaense.',
    icone: '🌾',
  },
  {
    titulo: 'Direito Civil',
    desc: 'Contratos, responsabilidade civil, direitos do consumidor, cobranças, indenizações e relações entre particulares.',
    icone: '⚖️',
  },
  {
    titulo: 'Direito Trabalhista',
    desc: 'Reclamações trabalhistas, rescisão contratual, verbas rescisórias, horas extras e relações de emprego rural e urbano.',
    icone: '👷',
  },
  {
    titulo: 'Direito de Família',
    desc: 'Divórcio, guarda de filhos, alimentos, inventários, partilha de bens e todas as questões do direito sucessório e familiar.',
    icone: '👨‍👩‍👧',
  },
  {
    titulo: 'Direito Animal',
    desc: 'Proteção jurídica de animais, suporte às denúncias de maus-tratos, parceria com a AMAA e crimes ambientais contra animais.',
    icone: '🐾',
  },
  {
    titulo: 'Advocacia Geral',
    desc: 'Assessoria preventiva, elaboração e revisão de contratos, consultas jurídicas e acompanhamento processual em todas as instâncias.',
    icone: '🏛️',
  },
]

const DIFERENCIAIS = [
  {
    titulo: 'Formação Sólida',
    desc: 'Conhecimento técnico atualizado e especialização nas áreas de atuação, com foco em resultados éticos e eficientes.',
  },
  {
    titulo: 'Raízes Regionais',
    desc: 'Escritório em Realeza/PR com profundo conhecimento das particularidades jurídicas do sudoeste paranaense.',
  },
  {
    titulo: 'Atendimento Pessoal',
    desc: 'Cada cliente é tratado com atenção individual. Sem intermediários, sem burocracia desnecessária.',
  },
  {
    titulo: 'Agilidade Estratégica',
    desc: 'Soluções jurídicas eficientes e menos custosas, dentro da lei, com criatividade estratégica quando necessário.',
  },
]

const WA_LINK     = 'https://wa.me/5546999779865'
const WA_LINK_MSG = 'https://wa.me/5546999779865?text=Ol%C3%A1!+Gostaria+de+uma+consulta+jur%C3%ADdica.'

// ── SVG WhatsApp (componente reutilizável inline) ─────────────────────────
const WaIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.558 4.117 1.528 5.849L0 24l6.335-1.511A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.823 9.823 0 01-5.006-1.368l-.358-.214-3.762.897.944-3.66-.236-.375A9.818 9.818 0 012.182 12C2.182 6.58 6.58 2.182 12 2.182S21.818 6.58 21.818 12 17.42 21.818 12 21.818z"/>
  </svg>
)

// ── Busca últimas notícias para o ticker ──────────────────────────────────

async function getUltimasNoticias() {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('articles')
      .select('title, slug')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(10)
    return data ?? []
  } catch {
    return []
  }
}

// ── Componente principal ──────────────────────────────────────────────────

export default async function HomePage() {
  const noticias = await getUltimasNoticias()

  return (
    <main className="min-h-screen text-gray-100" style={{ backgroundColor: '#111111' }}>

      {/* ── NAVBAR ──────────────────────────────────────────────────────── */}
      <nav style={{ backgroundColor: '#0d0d0d', borderBottom: '1px solid #2a2a2a' }}
        className="sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">

          {/* Logo MNA */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/mna-logo-web.png"
              alt="Moreira Neto Advocacia"
              style={{ height: '40px', width: 'auto', maxWidth: '155px', objectFit: 'contain' }}
            />
          </Link>

          {/* Links desktop */}
          <div className="hidden md:flex items-center gap-6 text-sm">
            <a href="#areas"   className="text-gray-400 hover:text-white transition-colors">Áreas</a>
            <a href="#sobre"   className="text-gray-400 hover:text-white transition-colors">Sobre</a>
            <a href="#contato" className="text-gray-400 hover:text-white transition-colors">Contato</a>
            <Link href="/noticias-e-opinioes"
              className="text-gray-400 hover:text-amber-400 transition-colors">
              Notícias e Opiniões
            </Link>
            <Link href="/amaa"
              className="text-gray-400 hover:text-emerald-400 transition-colors">
              AMAA
            </Link>
          </div>

          {/* WhatsApp — navbar */}
          <a
            href={WA_LINK_MSG}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-all flex-shrink-0 bg-green-600 hover:bg-green-700"
          >
            <WaIcon size={16} />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>

        </div>
      </nav>

      {/* ── TICKER DE NOTÍCIAS ───────────────────────────────────────────── */}
      <NewsTicker noticias={noticias} />

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundImage: 'url(/mna-logo-araucaria-web.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay escuro para legibilidade */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(13, 13, 13, 0.85) 0%, rgba(13, 13, 13, 0.75) 40%, rgba(13, 13, 13, 0.6) 100%)',
          }}
        />

        {/* Detalhe luminoso sutil */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-5"
            style={{ background: 'radial-gradient(circle, #E8941F 0%, transparent 70%)' }} />
        </div>

        {/* Fio dourado no topo */}
        <div className="absolute top-0 inset-x-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, #E8941F 40%, #E8941F 60%, transparent)' }} />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-24 md:py-36 relative z-10">
          <div className="max-w-2xl">

            <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-6"
              style={{ color: '#E8941F' }}>
              Advocacia · Realeza/PR · Sudoeste do Paraná
            </p>

            <h1 className="text-5xl md:text-6xl font-black text-white leading-[1.05] mb-6"
              style={{ letterSpacing: '-0.02em' }}>
              Advocacia com<br />
              <span style={{ color: '#E8941F' }}>estratégia</span> e<br />
              <span style={{ color: '#E8941F' }}>resultado.</span>
            </h1>

            <p className="text-lg leading-relaxed mb-10" style={{ color: '#9ca3af' }}>
              Soluções jurídicas eficientes para pessoas físicas e empresas do agronegócio
              no sudoeste paranaense. Direito Agrário, Civil, Trabalhista, Família e Direito Animal.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href={WA_LINK_MSG}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 text-white font-bold px-7 py-3.5 rounded-xl text-sm transition-all"
                style={{ backgroundColor: '#16a34a' }}
              >
                <WaIcon size={18} />
                Consulta pelo WhatsApp
              </a>
              <a
                href="#areas"
                className="inline-flex items-center gap-2 font-semibold px-7 py-3.5 rounded-xl text-sm border transition-colors"
                style={{ color: '#e5e7eb', borderColor: '#2a2a2a', backgroundColor: 'transparent' }}
              >
                Áreas de atuação
              </a>
            </div>

          </div>
        </div>

        {/* Separador sutil */}
        <div className="absolute bottom-0 inset-x-0 h-px" style={{ backgroundColor: '#1f1f1f' }} />
      </section>

      {/* ── ÁREAS DE ATUAÇÃO ────────────────────────────────────────────── */}
      <section id="areas" className="py-24" style={{ backgroundColor: '#111111' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          <div className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-3"
              style={{ color: '#E8941F' }}>
              Especialidades
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-white">
              Áreas de Atuação
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed" style={{ color: '#6b7280' }}>
              Cobertura jurídica completa para as demandas mais frequentes no cotidiano de
              produtores rurais, famílias e empresas do sudoeste paranaense.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Primeiro card (Direito Agrário) com imagem */}
            <div
              className="rounded-2xl p-6 transition-all duration-200 cursor-default relative overflow-hidden border border-[#2a2a2a] hover:border-orange-500/25 group lg:row-span-1"
              style={{
                backgroundImage: 'url(/mna-direito-agrario.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '280px',
              }}
            >
              {/* Overlay escuro */}
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(180deg, rgba(13, 13, 13, 0.92) 0%, rgba(13, 13, 13, 0.7) 100%)' }}
              />
              <div className="relative z-10">
                <div className="text-2xl mb-4">{AREAS[0].icone}</div>
                <h3 className="font-bold text-white text-base mb-2">{AREAS[0].titulo}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#d1d5db' }}>{AREAS[0].desc}</p>
              </div>
            </div>

            {/* Demais cards com imagens de fundo */}
            {AREAS.slice(1).map((area, idx) => {
              // Mapa de imagens para cada área (índice no array AREAS)
              const imageMap: { [key: string]: string } = {
                'Direito Civil': '/mna-area-civil-web.jpg',
                'Direito Trabalhista': '/mna-area-trabalhista.jpg',
                'Direito de Família': '/mna-area-familia-web.jpg',
                'Direito Animal': '/mna-area-animal-web.jpg',
                'Advocacia Geral': '/mna-area-geral-web.jpg',
              }
              const bgImage = imageMap[area.titulo]

              return (
                <div
                  key={area.titulo}
                  className="rounded-2xl p-6 transition-all duration-200 cursor-default relative overflow-hidden border border-[#2a2a2a] hover:border-orange-500/25"
                  style={bgImage ? {
                    backgroundImage: `url(${bgImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '280px',
                  } : { backgroundColor: '#1a1a1a', minHeight: '280px' }}
                >
                  {/* Overlay escuro para legibilidade */}
                  {bgImage && (
                    <div className="absolute inset-0 pointer-events-none"
                      style={{ background: 'linear-gradient(180deg, rgba(13, 13, 13, 0.92) 0%, rgba(13, 13, 13, 0.7) 100%)' }}
                    />
                  )}
                  <div className="relative z-10">
                    <div className="text-2xl mb-4">{area.icone}</div>
                    <h3 className="font-bold text-white text-base mb-2">{area.titulo}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: bgImage ? '#d1d5db' : '#6b7280' }}>{area.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-10">
            <a
              href={WA_LINK_MSG}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium transition-colors"
              style={{ color: '#E8941F' }}
            >
              Tem dúvida sobre sua situação? Fale conosco pelo WhatsApp →
            </a>
          </div>
        </div>
      </section>

      {/* ── SOBRE ───────────────────────────────────────────────────────── */}
      <section id="sobre" className="py-24" style={{ backgroundColor: '#161616', borderTop: '1px solid #1f1f1f', borderBottom: '1px solid #1f1f1f' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-3"
                style={{ color: '#E8941F' }}>
                Quem somos
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight">
                Comprometidos com<br />
                <span style={{ color: '#E8941F' }}>Realeza e região</span>
              </h2>
              <div className="space-y-4 text-sm leading-relaxed" style={{ color: '#9ca3af' }}>
                <p>
                  O <strong className="text-white">Moreira Neto Advocacia</strong> é um escritório com
                  raízes profundas no sudoeste paranaense, dedicado a oferecer assessoria jurídica de
                  qualidade a produtores rurais, famílias e empresas que precisam de suporte legal confiável.
                </p>
                <p>
                  Nossa atuação combina conhecimento técnico atualizado com visão prática: buscamos sempre
                  a solução mais eficiente e menos custosa para cada cliente, dentro dos limites da lei
                  e com criatividade estratégica quando necessário.
                </p>
                <p>
                  Além da advocacia privada, o escritório é parceiro jurídico da{' '}
                  <strong className="text-emerald-400">AMAA — Associação Melhores Amigos dos Animais
                  de Realeza/PR</strong>, atuando na proteção legal de animais e no suporte às
                  denúncias de maus-tratos.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-4">
                <Link href="/amaa"
                  className="inline-flex items-center gap-2 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
                  style={{ backgroundColor: '#14532d' }}>
                  🐾 Conheça a AMAA
                </Link>
                <Link href="/noticias-e-opinioes"
                  className="text-sm font-semibold transition-colors"
                  style={{ color: '#E8941F' }}>
                  Portal de Notícias →
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {DIFERENCIAIS.map((d, i) => (
                <div
                  key={d.titulo}
                  className="rounded-2xl p-6"
                  style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a' }}
                >
                  <div className="w-8 h-px mb-5" style={{ backgroundColor: '#E8941F', opacity: i < 2 ? 1 : 0.4 }} />
                  <h4 className="font-bold text-white text-sm mb-2">{d.titulo}</h4>
                  <p className="text-xs leading-relaxed" style={{ color: '#6b7280' }}>{d.desc}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── PORTAL DESPACHO ─────────────────────────────────────────────── */}
      <section className="py-16 relative overflow-hidden" style={{ backgroundColor: '#0d0d0d' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute right-0 top-0 w-80 h-80 rounded-full opacity-5"
            style={{ background: 'radial-gradient(circle, #E8941F 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
            style={{ borderLeft: '3px solid #E8941F', paddingLeft: '1.5rem' }}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-2"
                style={{ color: '#E8941F' }}>Portal de notícias jurídicas</p>
              <h2 className="text-2xl md:text-3xl font-black text-white mb-2">Notícias e Opiniões</h2>
              <p className="text-sm leading-relaxed max-w-lg" style={{ color: '#6b7280' }}>
                Notícias jurídicas curadas pelo escritório. Direito Agrário, Civil, Trabalhista,
                Família e mais — com foco no que interessa ao sudoeste do Paraná.
              </p>
            </div>
            <Link
              href="/noticias-e-opinioes"
              className="flex-shrink-0 text-sm font-bold px-6 py-3 rounded-xl transition-colors whitespace-nowrap"
              style={{ backgroundColor: '#E8941F', color: '#fff' }}
            >
              Acessar o portal →
            </Link>
          </div>
        </div>
      </section>

      {/* ── AMAA ────────────────────────────────────────────────────────── */}
      <section className="py-16 relative overflow-hidden"
        style={{ backgroundColor: '#0a1f12', borderTop: '1px solid #14532d40' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="flex items-start gap-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/amaa-logo-web.png"
                alt="Logo AMAA"
                style={{ height: '64px', width: 'auto', objectFit: 'contain', borderRadius: '12px', backgroundColor: '#fff', padding: '4px', flexShrink: 0 }}
              />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-2 text-emerald-400">
                  Parceria institucional
                </p>
                <h2 className="text-2xl font-black text-white mb-2">
                  AMAA — Melhores Amigos dos Animais
                </h2>
                <p className="text-sm leading-relaxed max-w-lg" style={{ color: '#6b7280' }}>
                  Adote um animal, denuncie maus-tratos, apoie a causa. A AMAA cuida dos animais de
                  Realeza/PR e o Moreira Neto Advocacia garante o respaldo jurídico da associação.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 flex-shrink-0">
              <Link href="/amaa"
                className="text-sm font-bold px-6 py-2.5 rounded-xl transition-colors text-center whitespace-nowrap"
                style={{ backgroundColor: '#16a34a', color: '#fff' }}>
                🐾 Adotar / Denunciar
              </Link>
              <a href="/cartilha-denuncia-maus-tratos.html" target="_blank"
                className="text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors text-center whitespace-nowrap text-emerald-300"
                style={{ backgroundColor: '#14532d' }}>
                📋 Cartilha de denúncia
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTATO ─────────────────────────────────────────────────────── */}
      <section id="contato" className="py-24" style={{ backgroundColor: '#111111', borderTop: '1px solid #1f1f1f' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          <div className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-3"
              style={{ color: '#E8941F' }}>
              Fale conosco
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-white">Entre em Contato</h2>
            <p className="mt-4 text-sm" style={{ color: '#6b7280' }}>
              Atendemos em Realeza/PR e região. Consulta inicial sem compromisso.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Dados de contato */}
            <div className="space-y-8">

              <div>
                <p className="text-xs uppercase tracking-widest mb-1" style={{ color: '#E8941F' }}>WhatsApp</p>
                <p className="text-white font-semibold text-lg">(46) 9 9977-9865</p>
                <p className="text-sm mt-1 mb-3" style={{ color: '#6b7280' }}>Consultas rápidas e agendamentos</p>
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
                  style={{ backgroundColor: '#16a34a' }}
                >
                  <WaIcon size={16} />
                  Chamar no WhatsApp
                </a>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest mb-1" style={{ color: '#E8941F' }}>E-mail</p>
                <a href="mailto:contato@moreiraneto.adv.br"
                  className="text-white font-semibold hover:opacity-80 transition-opacity">
                  contato@moreiraneto.adv.br
                </a>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest mb-1" style={{ color: '#E8941F' }}>Localização</p>
                <p className="text-white font-semibold">Realeza — PR</p>
                <p className="text-sm" style={{ color: '#6b7280' }}>Sudoeste do Paraná</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest mb-1" style={{ color: '#E8941F' }}>Horário</p>
                <p className="text-sm leading-relaxed" style={{ color: '#9ca3af' }}>
                  Segunda a Sexta: 08h às 18h<br />
                  Sábado: 08h às 12h (com agendamento)
                </p>
              </div>

            </div>

            {/* Formulário */}
            <div className="rounded-2xl p-8" style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a' }}>
              <h3 className="font-bold text-white mb-6 text-lg">Envie uma mensagem</h3>
              <form className="space-y-4" action="mailto:contato@moreiraneto.adv.br" method="post" encType="text/plain">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: '#9ca3af' }}>
                      Nome *
                    </label>
                    <input
                      type="text" name="nome" required placeholder="Seu nome completo"
                      className="w-full rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 transition-all"
                      style={{ backgroundColor: '#111111', border: '1px solid #2a2a2a' }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: '#9ca3af' }}>
                      Telefone
                    </label>
                    <input
                      type="tel" name="telefone" placeholder="(46) 9 ..."
                      className="w-full rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 transition-all"
                      style={{ backgroundColor: '#111111', border: '1px solid #2a2a2a' }}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: '#9ca3af' }}>E-mail *</label>
                  <input
                    type="email" name="email" required placeholder="seu@email.com"
                    className="w-full rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 transition-all"
                    style={{ backgroundColor: '#111111', border: '1px solid #2a2a2a' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: '#9ca3af' }}>Área de interesse</label>
                  <select
                    name="area"
                    className="w-full rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 transition-all"
                    style={{ backgroundColor: '#111111', border: '1px solid #2a2a2a' }}
                  >
                    <option value="">Selecione...</option>
                    <option>Direito Agrário</option>
                    <option>Direito Civil</option>
                    <option>Direito Trabalhista</option>
                    <option>Direito de Família</option>
                    <option>Direito Animal / AMAA</option>
                    <option>Outro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: '#9ca3af' }}>Mensagem *</label>
                  <textarea
                    name="mensagem" required rows={4} placeholder="Descreva brevemente sua situação..."
                    className="w-full rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 resize-none transition-all"
                    style={{ backgroundColor: '#111111', border: '1px solid #2a2a2a' }}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full text-white font-bold py-3 rounded-xl text-sm transition-colors"
                  style={{ backgroundColor: '#E8941F' }}
                >
                  Enviar mensagem →
                </button>
                <p className="text-xs text-center" style={{ color: '#4b5563' }}>
                  Suas informações são tratadas com confidencialidade absoluta.
                </p>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer style={{ backgroundColor: '#0d0d0d', borderTop: '1px solid #1f1f1f' }} className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/mna-logo-web.png"
                alt="Moreira Neto Advocacia"
                style={{ height: '36px', width: 'auto', objectFit: 'contain', marginBottom: '12px' }}
              />
              <p className="text-sm leading-relaxed" style={{ color: '#4b5563' }}>
                Escritório de advocacia em Realeza/PR.<br />
                Comprometidos com resultados éticos e eficientes.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">Links rápidos</h4>
              <ul className="space-y-2">
                {[
                  { href: '#areas',     label: 'Áreas de atuação' },
                  { href: '#sobre',     label: 'Sobre o escritório' },
                  { href: '#contato',   label: 'Contato' },
                  { href: '/noticias-e-opinioes',  label: 'Portal Despacho', next: true },
                  { href: '/amaa',      label: 'AMAA — Adoção Animal', next: true },
                ].map(item => (
                  <li key={item.href}>
                    {item.next
                      ? <Link href={item.href}
                          className="text-sm transition-colors text-gray-600 hover:text-amber-400"
                        >{item.label}</Link>
                      : <a href={item.href}
                          className="text-sm transition-colors text-gray-600 hover:text-amber-400"
                        >{item.label}</a>
                    }
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">Parceiros</h4>
              <div className="flex items-center gap-3 rounded-xl p-3"
                style={{ backgroundColor: '#0a1f12', border: '1px solid #14532d40' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/amaa-logo-web.png"
                  alt="AMAA"
                  style={{ height: '40px', width: 'auto', objectFit: 'contain', borderRadius: '8px', backgroundColor: '#fff', padding: '3px', flexShrink: 0 }}
                />
                <div>
                  <p className="text-emerald-400 font-semibold text-xs">AMAA</p>
                  <p className="text-xs" style={{ color: '#4b5563' }}>Melhores Amigos dos Animais de Realeza/PR</p>
                </div>
              </div>
            </div>

          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-6"
            style={{ borderTop: '1px solid #1f1f1f' }}>
            <p className="text-xs" style={{ color: '#374151' }}>
              © {new Date().getFullYear()} Moreira Neto Advocacia · Realeza/PR · OAB/PR
            </p>
            <p className="text-xs" style={{ color: '#374151' }}>
              <Link href="/noticias-e-opinioes" className="hover:text-amber-400 transition-colors">Portal Despacho</Link>
              {' · '}
              <Link href="/amaa" className="hover:text-emerald-400 transition-colors">AMAA</Link>
              {' · '}
              <Link href="/login" className="hover:text-gray-400 transition-colors">Área restrita</Link>
            </p>
          </div>

        </div>
      </footer>

      {/* ── BOTÃO FLUTUANTE WHATSAPP ─────────────────────────────────────── */}
      <a
        href={WA_LINK_MSG}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chamar no WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center rounded-full shadow-2xl transition-transform hover:scale-110"
        style={{
          width: '52px',
          height: '52px',
          backgroundColor: '#16a34a',
        }}
      >
        <WaIcon size={26} />
      </a>

    </main>
  )
}
