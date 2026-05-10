import type { Metadata } from 'next'
import Link from 'next/link'
import DenunciaForm from '@/app/amaa/DenunciaForm'

export const metadata: Metadata = {
  title: 'Denunciar Maus-Tratos a Animais | Moreira Neto Advocacia',
  description:
    'Denuncie maus-tratos a animais de forma anônima e gratuita. A AMAA e a Moreira Neto Advocacia analisam cada caso e tomam as providências legais cabíveis.',
  keywords: ['denúncia maus-tratos animais', 'AMAA', 'Realeza', 'Paraná', 'direito animal'],
  openGraph: {
    title: 'Denunciar Maus-Tratos a Animais',
    description: 'Denuncie de forma anônima e gratuita. Cada denúncia importa.',
    url: 'https://moreiraneto.adv.br/denuncia',
  },
}

export default function DenunciaPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>

      {/* Header */}
      <header
        className="border-b px-4 py-4"
        style={{
          background: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black"
              style={{ background: 'rgba(232,148,31,0.15)', border: '1px solid rgba(232,148,31,0.3)' }}
            >
              <span style={{ color: '#9CA3AF' }}>M</span>
              <span style={{ color: '#E8941F' }}>N</span>
            </div>
            <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
              Moreira Neto Advocacia
            </span>
          </Link>
          <Link
            href="/amaa"
            className="text-xs font-medium transition-colors"
            style={{ color: 'var(--color-muted)' }}
          >
            ← Ver AMAA
          </Link>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="max-w-2xl mx-auto px-4 py-10">

        {/* Título */}
        <div className="mb-8">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-4"
            style={{ background: 'rgba(220,38,38,0.1)', color: '#DC2626' }}
          >
            🚨 Denúncia anônima e gratuita
          </div>
          <h1
            className="text-3xl font-black mb-3"
            style={{ color: 'var(--color-text)' }}
          >
            Denunciar Maus-Tratos a Animais
          </h1>
          <p className="text-base" style={{ color: 'var(--color-muted)' }}>
            Sua denúncia será analisada pela <strong style={{ color: 'var(--color-text)' }}>AMAA</strong> e
            pela <strong style={{ color: 'var(--color-text)' }}>Moreira Neto Advocacia</strong>.
            Você pode denunciar anonimamente — nenhum dado seu será armazenado se preferir.
          </p>
        </div>

        {/* Avisos legais */}
        <div
          className="rounded-xl p-4 mb-8 text-sm"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-muted)',
          }}
        >
          <p className="mb-1">
            <strong style={{ color: 'var(--color-text)' }}>⚖️ Amparo legal:</strong>{' '}
            Maus-tratos a animais é crime previsto na Lei 9.605/98 (Lei de Crimes Ambientais),
            com pena de 2 a 5 anos de reclusão.
          </p>
          <p>
            <strong style={{ color: 'var(--color-text)' }}>🚑 Emergência?</strong>{' '}
            Ligue agora para a Polícia Ambiental: <strong style={{ color: '#E8941F' }}>0800 041 2897</strong> ou
            PM: <strong style={{ color: '#E8941F' }}>190</strong>
          </p>
        </div>

        {/* Formulário */}
        <DenunciaForm />

      </main>

      {/* Footer */}
      <footer
        className="border-t mt-16 px-4 py-8 text-center text-xs"
        style={{
          borderColor: 'var(--color-border)',
          color: 'var(--color-muted)',
        }}
      >
        <p>Moreira Neto Advocacia · Realeza/PR · Apoio jurídico à AMAA</p>
        <div className="flex justify-center gap-4 mt-3">
          <Link href="/" style={{ color: 'var(--color-muted)' }}>Site institucional</Link>
          <Link href="/amaa" style={{ color: 'var(--color-muted)' }}>AMAA</Link>
          <Link href="/noticias-e-opinioes" style={{ color: 'var(--color-muted)' }}>Portal de notícias</Link>
        </div>
      </footer>

    </div>
  )
}
