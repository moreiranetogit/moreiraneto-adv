import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Página não encontrada',
}

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
      style={{ background: '#0D0D0F' }}
    >
      {/* Monograma */}
      <div
        className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-8"
        style={{
          background: 'rgba(232,148,31,0.1)',
          border: '1px solid rgba(232,148,31,0.25)',
        }}
      >
        <span className="text-3xl font-black">
          <span style={{ color: '#9CA3AF' }}>M</span>
          <span style={{ color: '#E8941F' }}>N</span>
        </span>
      </div>

      {/* Código */}
      <p
        className="text-8xl font-black mb-2 tabular-nums"
        style={{ color: '#E8941F', lineHeight: 1 }}
      >
        404
      </p>

      <h1 className="text-xl font-bold text-white mb-3">
        Página não encontrada
      </h1>

      <p className="text-sm max-w-xs mb-10" style={{ color: '#6B7280' }}>
        O endereço que você acessou não existe ou foi movido.
      </p>

      {/* Links */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90"
          style={{ background: '#E8941F', color: '#fff' }}
        >
          Ir para o site
        </Link>
        <Link
          href="/noticias-e-opinioes"
          className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
          style={{
            background: 'transparent',
            border: '1.5px solid #3F3F46',
            color: '#9CA3AF',
          }}
        >
          Portal de notícias
        </Link>
        <Link
          href="/amaa"
          className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
          style={{
            background: 'transparent',
            border: '1.5px solid #3F3F46',
            color: '#9CA3AF',
          }}
        >
          🐾 AMAA
        </Link>
      </div>

      <p className="text-xs mt-16" style={{ color: '#374151' }}>
        Moreira Neto Advocacia · Realeza/PR
      </p>
    </div>
  )
}
