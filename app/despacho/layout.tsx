'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CATEGORY_LABELS, type ArticleCategory, type PortalTheme } from '@/types'

const CATEGORIES = Object.entries(CATEGORY_LABELS) as [ArticleCategory, string][]

const THEME_ICONS: Record<PortalTheme, string> = {
  light: '☀️',
  dark:  '🌙',
  sepia: '📜',
}

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [theme, setTheme] = useState<PortalTheme>('light')
  const [menuOpen, setMenuOpen] = useState(false)

  // Carrega tema salvo
  useEffect(() => {
    const saved = localStorage.getItem('mn-theme') as PortalTheme | null
    if (saved && ['light', 'dark', 'sepia'].includes(saved)) {
      applyTheme(saved)
    }
  }, [])

  function applyTheme(t: PortalTheme) {
    document.documentElement.setAttribute('data-theme', t)
    localStorage.setItem('mn-theme', t)
    setTheme(t)
  }

  function cycleTheme() {
    const order: PortalTheme[] = ['light', 'dark', 'sepia']
    const next = order[(order.indexOf(theme) + 1) % order.length]
    applyTheme(next)
  }

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>

      {/* ── HEADER ── */}
      <header style={{
        background: 'var(--header-bg)',
        color: 'var(--header-text)',
        borderBottom: '4px solid #E8941F',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">

            {/* Logo + Nome */}
            <Link href="/despacho" className="flex items-center gap-3">
              {/* Monograma MN */}
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-black"
                style={{ background: 'rgba(232,148,31,0.2)', border: '1px solid rgba(232,148,31,0.4)' }}>
                <span style={{ color: '#9CA3AF' }}>M</span>
                <span style={{ color: '#E8941F' }}>N</span>
              </div>
              <div>
                <span className="font-black text-base tracking-tight"
                  style={{ color: 'var(--header-text)' }}>
                  Despacho
                </span>
                <span className="text-xs ml-1.5 font-medium"
                  style={{ color: '#E8941F' }}>
                  por MNA
                </span>
              </div>
            </Link>

            {/* Nav desktop */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/despacho"
                className="px-3 py-1.5 rounded text-sm font-medium transition-colors"
                style={{
                  color: pathname === '/despacho' ? '#E8941F' : 'rgba(255,255,255,0.7)',
                  background: pathname === '/despacho' ? 'rgba(232,148,31,0.1)' : 'transparent',
                }}
              >
                Início
              </Link>
              {CATEGORIES.map(([slug, label]) => (
                <Link
                  key={slug}
                  href={`/despacho/${slug}`}
                  className="px-3 py-1.5 rounded text-sm font-medium transition-colors"
                  style={{
                    color: pathname === `/despacho/${slug}` ? '#E8941F' : 'rgba(255,255,255,0.7)',
                    background: pathname === `/despacho/${slug}` ? 'rgba(232,148,31,0.1)' : 'transparent',
                  }}
                >
                  {label.replace('Direito ', '')}
                </Link>
              ))}
              <Link
                href="/amaa"
                className="px-3 py-1.5 rounded text-sm font-medium transition-colors"
                style={{
                  color: pathname === '/amaa' ? '#E8941F' : 'rgba(255,255,255,0.7)',
                  background: pathname === '/amaa' ? 'rgba(232,148,31,0.1)' : 'transparent',
                }}
              >
                🐾 AMAA
              </Link>
            </nav>

            {/* Ações */}
            <div className="flex items-center gap-2">
              {/* Theme switcher */}
              <button
                onClick={cycleTheme}
                title={`Tema: ${theme}`}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-base transition-colors"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                }}
              >
                {THEME_ICONS[theme]}
              </button>

              {/* Menu mobile */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--header-text)' }}
              >
                {menuOpen ? '✕' : '☰'}
              </button>
            </div>

          </div>
        </div>

        {/* Menu mobile */}
        {menuOpen && (
          <div className="md:hidden border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
            <div className="px-4 py-2 flex flex-col gap-1">
              <Link href="/despacho" onClick={() => setMenuOpen(false)}
                className="py-2 px-3 rounded text-sm font-medium"
                style={{ color: 'rgba(255,255,255,0.8)' }}>
                Início
              </Link>
              {CATEGORIES.map(([slug, label]) => (
                <Link key={slug} href={`/despacho/${slug}`} onClick={() => setMenuOpen(false)}
                  className="py-2 px-3 rounded text-sm font-medium"
                  style={{ color: 'rgba(255,255,255,0.8)' }}>
                  {label}
                </Link>
              ))}
              <Link href="/amaa" onClick={() => setMenuOpen(false)}
                className="py-2 px-3 rounded text-sm font-medium"
                style={{ color: '#E8941F' }}>
                🐾 AMAA — Adoção & Denúncias
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ── BANNER AMAA ── */}
      <div className="text-center text-xs font-bold py-1.5 tracking-wide"
        style={{ background: '#DC2626', color: '#fff' }}>
        <Link href="/amaa#denuncia" className="hover:underline">
          🚨 DENUNCIE MAUS-TRATOS A ANIMAIS — Anônimo · Gratuito · 24h &rarr; Saiba como
        </Link>
      </div>

      {/* ── CONTEÚDO ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {children}
      </main>

      {/* ── FOOTER ── */}
      <footer style={{ background: 'var(--header-bg)', borderTop: '1px solid rgba(255,255,255,0.1)' }}
        className="mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm font-bold mb-1" style={{ color: '#E8941F' }}>
            Despacho, por MNA
          </p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Portal de notícias jurídicas da Moreira Neto Advocacia · Realeza/PR ·{' '}
            <Link href="https://moreiraneto.adv.br"
              className="hover:underline" style={{ color: 'rgba(255,255,255,0.6)' }}>
              moreiraneto.adv.br
            </Link>
          </p>
          <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.3)' }}>
            As notícias são curadas editorialmente e não constituem aconselhamento jurídico.
          </p>
        </div>
      </footer>

    </div>
  )
}
