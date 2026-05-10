import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import DenunciaForm from '@/app/amaa/DenunciaForm'

export const metadata: Metadata = {
  title: 'Denunciar Maus-Tratos a Animais | Moreira Neto Advocacia',
  description:
    'Denuncie maus-tratos a animais de forma anônima e gratuita. A AMAA e a Moreira Neto Advocacia analisam cada caso e tomam as providências legais cabíveis.',
  keywords: ['denúncia maus-tratos animais', 'AMAA', 'Realeza', 'Paraná', 'direito animal', 'Lei Sansão'],
  openGraph: {
    title: 'Denunciar Maus-Tratos a Animais',
    description: 'Denuncie de forma anônima e gratuita. Cada denúncia importa.',
    url: 'https://moreiraneto.adv.br/denuncia',
  },
}

const PASSOS = [
  { num: 1, icon: '📸', title: 'Registre evidências', desc: 'Fotografe ou filme o animal e o local sem se aproximar de forma arriscada. Data e hora ficam salvas automaticamente.' },
  { num: 2, icon: '📍', title: 'Anote o endereço', desc: 'Rua, número, bairro, ponto de referência e nome do responsável (se souber).' },
  { num: 3, icon: '📞', title: 'Acione a autoridade', desc: 'Polícia Militar (190), Polícia Ambiental (0800 041 2897) ou a AMAA diretamente.' },
  { num: 4, icon: '📝', title: 'Registre o B.O.', desc: 'Na Delegacia ou online em delegaciavirtual.pr.gov.br. O B.O. é essencial para o processo.' },
  { num: 5, icon: '🏛️', title: 'Fale com o Município', desc: 'A Prefeitura pode apreender o animal em situação de risco imediato via Vigilância Sanitária.' },
  { num: 6, icon: '🐾', title: 'Acione a AMAA', desc: 'A AMAA tem rede de voluntários e experiência em casos de Realeza e região.' },
  { num: 7, icon: '👁️', title: 'Acompanhe o caso', desc: 'Guarde o número do B.O. e monitore o desfecho. Se não houver resposta, insista.' },
  { num: 8, icon: '⚖️', title: 'Apoio Jurídico', desc: 'Em casos graves, o MP pode ser acionado. A Moreira Neto Advocacia oferece orientação às denúncias encaminhadas pela AMAA.' },
]

const PROVAS = [
  'Fotos/vídeos com data e hora',
  'Depoimento de testemunhas',
  'Laudos veterinários',
  'Print de publicações em redes',
  'Histórico de B.O.s anteriores',
  'Notas de moradores/vizinhos',
]

export default function DenunciaPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>

      {/* Header */}
      <header
        className="border-b px-4 py-4 sticky top-0 z-10"
        style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <div className="max-w-3xl mx-auto flex items-center justify-between">
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
          <div className="flex items-center gap-4">
            <Link href="/amaa" className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>
              Adoção AMAA
            </Link>
            <Link href="/" className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>
              ← Site
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10">

        {/* Hero */}
        <div className="mb-10">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-4"
            style={{ background: 'rgba(220,38,38,0.1)', color: '#DC2626' }}
          >
            🚨 Denúncia anônima · Gratuita · 24h
          </div>
          <h1 className="text-3xl sm:text-4xl font-black mb-3" style={{ color: 'var(--color-text)' }}>
            Denunciar Maus-Tratos<br />a Animais
          </h1>
          <p className="text-base leading-relaxed" style={{ color: 'var(--color-muted)' }}>
            <strong style={{ color: 'var(--color-text)' }}>Maus-tratos a animais é crime.</strong> A{' '}
            <strong style={{ color: 'var(--color-text)' }}>Lei Sansão (Lei nº 14.064/2020)</strong> e a{' '}
            <strong style={{ color: 'var(--color-text)' }}>Lei nº 9.605/98</strong> garantem proteção
            jurídica a todos os animais. Qualquer cidadão pode e deve denunciar — você não precisa
            ser dono do animal para agir.
          </p>
        </div>

        {/* Lei em destaque */}
        <div
          className="rounded-2xl p-5 mb-10 flex gap-4"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
        >
          <span className="text-3xl shrink-0">⚖️</span>
          <div>
            <h2 className="font-black text-base mb-1" style={{ color: 'var(--color-text)' }}>
              Lei Sansão (Lei nº 14.064/2020) — Penas Severas para Cães e Gatos
            </h2>
            <p className="text-sm mb-3" style={{ color: 'var(--color-muted)' }}>
              Abusos, maus-tratos, ferimentos ou mutilação de cães e gatos resultam em penas
              agravadas em relação à Lei de Crimes Ambientais.
            </p>
            <div className="flex flex-wrap gap-2">
              {['🔒 Reclusão 2 a 5 anos', '💸 Multa', '⚠️ Agravante se ocorrer morte', '📋 Lei 9.605/98 Art. 32 (demais animais)'].map(p => (
                <span
                  key={p}
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(220,38,38,0.1)', color: '#DC2626' }}
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Passo a passo */}
        <div className="mb-10">
          <h2 className="text-xl font-black mb-6 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
            <span>📋</span> Como denunciar — passo a passo
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {PASSOS.map(p => (
              <div
                key={p.num}
                className="flex gap-3 rounded-xl p-4"
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
              >
                <div
                  className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-sm font-black"
                  style={{ background: 'rgba(232,148,31,0.15)', color: '#E8941F' }}
                >
                  {p.num}
                </div>
                <div>
                  <h3 className="font-bold text-sm mb-0.5" style={{ color: 'var(--color-text)' }}>
                    {p.icon} {p.title}
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--color-muted)' }}>
                    {p.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-xl overflow-hidden">
            <Image
              src="/amaa-passos-web.jpg"
              alt="Passo a passo visual"
              width={800}
              height={300}
              className="w-full object-cover"
            />
          </div>
        </div>

        {/* Que provas colher */}
        <div
          className="rounded-2xl p-6 mb-10"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
        >
          <h2 className="font-black text-base mb-4" style={{ color: 'var(--color-text)' }}>
            📁 Que provas colher para fortalecer a denúncia
          </h2>
          <div className="flex flex-wrap gap-2">
            {PROVAS.map(p => (
              <span
                key={p}
                className="text-xs font-medium px-3 py-1.5 rounded-full"
                style={{
                  background: 'rgba(232,148,31,0.1)',
                  color: '#E8941F',
                  border: '1px solid rgba(232,148,31,0.2)',
                }}
              >
                {p}
              </span>
            ))}
          </div>
        </div>

        {/* Emergência */}
        <div
          className="rounded-2xl p-5 mb-10"
          style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)' }}
        >
          <p className="font-black text-sm mb-1" style={{ color: '#DC2626' }}>
            🚑 Situação de emergência?
          </p>
          <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
            Ligue agora para a{' '}
            <strong style={{ color: 'var(--color-text)' }}>Polícia Ambiental: 0800 041 2897</strong>
            {' '}ou{' '}
            <strong style={{ color: 'var(--color-text)' }}>PM: 190</strong>
          </p>
        </div>

        {/* Divisor */}
        <div className="border-t mb-10" style={{ borderColor: 'var(--color-border)' }} />

        {/* Formulário */}
        <div className="mb-4">
          <h2 className="text-2xl font-black mb-2" style={{ color: 'var(--color-text)' }}>
            Registrar denúncia online
          </h2>
          <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
            A AMAA e a Moreira Neto Advocacia analisarão sua denúncia e tomarão as providências cabíveis.
            Você pode denunciar de forma completamente anônima.
          </p>
        </div>

        <DenunciaForm />

      </main>

      {/* Footer */}
      <footer
        className="border-t mt-16 px-4 py-8 text-center text-xs"
        style={{ borderColor: 'var(--color-border)', color: 'var(--color-muted)' }}
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
