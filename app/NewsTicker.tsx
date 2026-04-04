'use client'
// ═══════════════════════════════════════════════════════════════════════════
// NewsTicker — Barra de rolagem horizontal com últimas notícias do Despacho
// Recebe array de { title, slug } do Server Component (page.tsx)
// ═══════════════════════════════════════════════════════════════════════════

import Link from 'next/link'

interface NoticiaItem {
  title: string
  slug: string
}

interface NewsTickerProps {
  noticias: NoticiaItem[]
}

// Fallback para quando o banco ainda não tem artigos
const PLACEHOLDER: NoticiaItem[] = [
  { title: 'Portal Despacho em breve — notícias jurídicas selecionadas para você', slug: '' },
  { title: 'Acompanhe as novidades do Direito Agrário, Civil, Trabalhista e Ambiental', slug: '' },
  { title: 'Moreira Neto Advocacia — Realeza/PR', slug: '' },
]

export default function NewsTicker({ noticias }: NewsTickerProps) {
  const items = noticias.length > 0 ? noticias : PLACEHOLDER

  // Duplica os itens para criar efeito de loop contínuo
  const doubled = [...items, ...items]

  // Duração proporcional à quantidade de itens (≈4s por item, mín 20s)
  const duration = Math.max(20, items.length * 4)

  return (
    <div className="bg-[#E8941F] text-white overflow-hidden flex items-center h-9">

      {/* Rótulo fixo à esquerda */}
      <Link
        href="/despacho"
        className="flex-shrink-0 bg-gray-900 text-[#E8941F] font-black text-xs uppercase tracking-wider px-4 h-full flex items-center hover:bg-gray-800 transition-colors whitespace-nowrap"
      >
        📰 Despacho MNA
      </Link>

      {/* Separador */}
      <div className="flex-shrink-0 w-px h-full bg-orange-400 opacity-50" />

      {/* Área de scroll */}
      <div className="flex-1 overflow-hidden relative">
        <div
          className="flex items-center gap-0 whitespace-nowrap will-change-transform"
          style={{
            animation: `ticker-scroll ${duration}s linear infinite`,
          }}
        >
          {doubled.map((noticia, idx) => (
            <span key={idx} className="flex items-center">
              {noticia.slug ? (
                <Link
                  href={`/despacho/artigo/${noticia.slug}`}
                  className="text-xs font-medium hover:text-gray-900 transition-colors cursor-pointer px-2"
                >
                  {noticia.title}
                </Link>
              ) : (
                <span className="text-xs font-medium px-2">{noticia.title}</span>
              )}
              {/* Separador entre itens */}
              <span className="text-orange-300 text-xs px-2 select-none">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* Link "ver mais" fixo à direita */}
      <Link
        href="/despacho"
        className="flex-shrink-0 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold px-3 h-full flex items-center transition-colors whitespace-nowrap"
      >
        Ver mais →
      </Link>

      {/* CSS da animação — injetado inline no componente */}
      <style>{`
        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ticker-scroll-inner { animation: none !important; }
        }
      `}</style>
    </div>
  )
}
