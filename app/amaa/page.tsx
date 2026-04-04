// ═══════════════════════════════════════════════════════════════════════════
// AMAA — Seção Pública: Adoção + Denúncia de Maus-Tratos
// moreiraneto.adv.br/amaa
// ═══════════════════════════════════════════════════════════════════════════

import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { Animal } from '@/types'
import DenunciaForm from './DenunciaForm'

export const metadata: Metadata = {
  title: 'AMAA — Adoção e Denúncia de Maus-Tratos | Realeza/PR',
  description:
    'Associação Melhores Amigos dos Animais de Realeza/PR. Adote um animal, denuncie maus-tratos e ajude a proteger os animais da nossa região.',
  openGraph: {
    title: 'AMAA — Melhores Amigos dos Animais · Realeza/PR',
    description: 'Adote, denuncie e apoie a causa animal em Realeza/PR.',
    url: 'https://moreiraneto.adv.br/amaa',
    type: 'website',
  },
}

export const revalidate = 300 // revalida a cada 5 minutos

// ── Busca de animais disponíveis ────────────────────────────────────────────

async function getAnimaisDisponiveis(): Promise<Animal[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('animals')
      .select('*')
      .eq('status', 'published')
      .order('urgencia', { ascending: false }) // urgente primeiro
      .order('created_at', { ascending: false })
      .limit(24)

    if (error) throw error
    return (data as Animal[]) ?? []
  } catch {
    return []
  }
}

// ── Sub-componente: Card de animal ─────────────────────────────────────────

function AnimalCard({ animal }: { animal: Animal }) {
  const fotos = animal.fotos ?? []
  const foto = fotos[0] ?? null

  const urgenciaColor: Record<string, string> = {
    critica:  'bg-red-100 text-red-700 border-red-200',
    alta:     'bg-orange-100 text-orange-700 border-orange-200',
    normal:   'bg-green-100 text-green-700 border-green-200',
  }

  const porteLabel: Record<string, string> = {
    pequeno: 'Pequeno',
    medio:   'Médio',
    grande:  'Grande',
  }

  const sexoLabel: Record<string, string> = {
    macho:  '♂ Macho',
    femea:  '♀ Fêmea',
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col">

      {/* Foto */}
      <div className="aspect-[4/3] bg-gray-100 relative">
        {foto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={foto} alt={animal.nome} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">
            {animal.especie === 'gato' ? '🐱' : '🐶'}
          </div>
        )}

        {/* Badge urgência */}
        {animal.urgencia && animal.urgencia !== 'normal' && (
          <div className={`absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full border ${urgenciaColor[animal.urgencia] ?? ''}`}>
            {animal.urgencia === 'critica' ? '🚨 Urgente' : '⚡ Alta prioridade'}
          </div>
        )}

        {/* Badge espécie */}
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-xs font-semibold px-2 py-0.5 rounded-full text-gray-700">
          {animal.especie === 'gato' ? '🐱 Gato' : animal.especie === 'cachorro' ? '🐶 Cachorro' : animal.especie}
        </div>
      </div>

      {/* Dados */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 text-lg mb-1">{animal.nome}</h3>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
            {sexoLabel[animal.sexo] ?? animal.sexo}
          </span>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
            {porteLabel[animal.porte] ?? animal.porte}
          </span>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
            {animal.idade_categoria}
          </span>
        </div>

        <p className="text-sm text-gray-500 leading-relaxed flex-1 line-clamp-3">
          {animal.descricao}
        </p>

        {/* Saúde */}
        <div className="flex flex-wrap gap-1 mt-3">
          {animal.castrado === 'sim' && (
            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">✓ Castrado</span>
          )}
          {animal.vacinado === 'sim' && (
            <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">✓ Vacinado</span>
          )}
          {animal.microchip === 'sim' && (
            <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">✓ Microchip</span>
          )}
        </div>

        {/* CTA adoção */}
        <a
          href={`https://wa.me/5546999779865?text=Ol%C3%A1!+Tenho+interesse+em+adotar+o+${encodeURIComponent(animal.nome)}+🐾`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 w-full bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-2.5 rounded-xl text-sm text-center transition-colors"
        >
          💚 Quero adotar {animal.nome}
        </a>
      </div>
    </div>
  )
}

// ── Página principal ────────────────────────────────────────────────────────

export default async function AmaaPage() {
  const animais = await getAnimaisDisponiveis()
  const cachorros = animais.filter(a => a.especie === 'cachorro')
  const gatos = animais.filter(a => a.especie === 'gato')
  const outros = animais.filter(a => a.especie !== 'cachorro' && a.especie !== 'gato')

  return (
    <main className="min-h-screen bg-gray-50">

      {/* ── NAVBAR ──────────────────────────────────────────────────────── */}
      <nav className="bg-emerald-900 border-b border-emerald-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/amaa-logo-web.png" alt="AMAA" className="w-9 h-9 rounded-2xl bg-white p-0.5 object-contain" />
            <div>
              <div className="text-white font-bold text-sm leading-tight">AMAA</div>
              <div className="text-emerald-300 text-xs">Melhores Amigos dos Animais</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a href="#adocao" className="text-emerald-200 hover:text-white text-sm transition-colors">Adoção</a>
            <a href="#denuncia" className="text-emerald-200 hover:text-white text-sm transition-colors">Denúncia</a>
            <Link href="/" className="text-emerald-200 hover:text-white text-sm transition-colors">← MNA</Link>
          </div>
        </div>
      </nav>

      {/* ── HERO AMAA ───────────────────────────────────────────────────── */}
      <section className="bg-emerald-900 relative overflow-hidden py-16">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-400 rounded-full translate-x-1/3 -translate-y-1/3" />
          <div className="absolute left-0 bottom-0 w-56 h-56 bg-emerald-400 rounded-full -translate-x-1/3 translate-y-1/3" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/amaa-logo-web.png" alt="Logo AMAA" className="h-20 w-auto rounded-2xl bg-white p-1.5 object-contain shadow-lg" />
              <div>
                <p className="text-emerald-300 text-sm font-semibold uppercase tracking-wider">Realeza/PR</p>
                <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">
                  Associação Melhores<br />Amigos dos Animais
                </h1>
              </div>
            </div>

            <p className="text-emerald-100 text-lg mb-8 leading-relaxed">
              Resgate, cuidado, adoção responsável e proteção legal dos animais de Realeza e região.
              Adote um peludo, denuncie maus-tratos ou apoie nossa causa.
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href="#adocao"
                className="bg-white hover:bg-gray-100 text-emerald-900 font-bold px-6 py-3 rounded-xl transition-colors"
              >
                🐾 Ver animais para adoção
              </a>
              <a
                href="#denuncia"
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
              >
                🚨 Denunciar maus-tratos
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── CARTILHA BANNER ─────────────────────────────────────────────── */}
      <div className="bg-amber-50 border-b border-amber-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-amber-800 text-sm">
            📋 <strong>Saiba seus direitos:</strong> baixe nossa Cartilha sobre como denunciar maus-tratos a animais.
          </p>
          <a
            href="/cartilha-denuncia-maus-tratos.html"
            target="_blank"
            className="flex-shrink-0 bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors"
          >
            Baixar Cartilha →
          </a>
        </div>
      </div>

      {/* ── SEÇÃO ADOÇÃO ────────────────────────────────────────────────── */}
      <section id="adocao" className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-gray-900">Animais para Adoção</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              Todos os nossos animais são resgatados, castrados, vacinados e cuidados com muito amor.
              Adote com responsabilidade — é para toda a vida! 🐾
            </p>
          </div>

          {animais.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🐾</div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">Nenhum animal disponível no momento</h3>
              <p className="text-gray-500 text-sm mb-6">
                Nossos animais encontraram lar! Mas sempre chegam novos — volte em breve
                ou entre em contato com a AMAA para se cadastrar como adotante.
              </p>
              <a
                href="https://wa.me/5546999779865?text=Ol%C3%A1!+Quero+me+cadastrar+como+adotante+na+AMAA"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl transition-colors"
              >
                📲 Cadastrar como adotante
              </a>
            </div>
          ) : (
            <div className="space-y-12">

              {/* Cachorros */}
              {cachorros.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span>🐶</span> Cachorros ({cachorros.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {cachorros.map(animal => (
                      <AnimalCard key={animal.id} animal={animal} />
                    ))}
                  </div>
                </div>
              )}

              {/* Gatos */}
              {gatos.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span>🐱</span> Gatos ({gatos.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {gatos.map(animal => (
                      <AnimalCard key={animal.id} animal={animal} />
                    ))}
                  </div>
                </div>
              )}

              {/* Outros */}
              {outros.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span>🐾</span> Outros ({outros.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {outros.map(animal => (
                      <AnimalCard key={animal.id} animal={animal} />
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      </section>

      {/* ── COMO FUNCIONA ADOÇÃO ────────────────────────────────────────── */}
      <section className="py-12 bg-emerald-50 border-y border-emerald-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-black text-emerald-900 mb-8">Como funciona a adoção?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            {[
              { num: '1', icon: '💚', titulo: 'Escolha', desc: 'Veja os animais disponíveis e se apaixone!' },
              { num: '2', icon: '📲', titulo: 'Entre em contato', desc: 'Fale com a AMAA pelo WhatsApp.' },
              { num: '3', icon: '🤝', titulo: 'Entrevista', desc: 'Conversamos para garantir o lar ideal para o animal.' },
              { num: '4', icon: '🏠', titulo: 'Adoção!', desc: 'Bem-vindo ao lar! A AMAA acompanha o pós-adoção.' },
            ].map(step => (
              <div key={step.num} className="flex flex-col items-center">
                <div className="w-12 h-12 bg-emerald-700 text-white rounded-full flex items-center justify-center font-black text-lg mb-3">
                  {step.num}
                </div>
                <div className="text-2xl mb-2">{step.icon}</div>
                <h4 className="font-bold text-emerald-900">{step.titulo}</h4>
                <p className="text-sm text-emerald-700 mt-1">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FORMULÁRIO DE DENÚNCIA ──────────────────────────────────────── */}
      <section id="denuncia" className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">

          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl mb-4">
              <span className="text-3xl">🚨</span>
            </div>
            <h2 className="text-3xl font-black text-gray-900">Denunciar Maus-Tratos</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              Viu um animal sofrendo? Denuncie! Todas as denúncias são encaminhadas à AMAA
              e, quando necessário, às autoridades competentes.
              <strong className="text-gray-700"> Você pode fazer a denúncia anonimamente.</strong>
            </p>
          </div>

          {/* Box de lei */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 flex gap-3 items-start">
            <span className="text-xl mt-0.5">⚖️</span>
            <div>
              <p className="text-amber-800 font-semibold text-sm">Lei Sansão (Lei nº 14.064/2020)</p>
              <p className="text-amber-700 text-sm mt-1">
                Maus-tratos a cães e gatos resultam em <strong>reclusão de 2 a 5 anos</strong> + multa.
                Sua denúncia faz diferença — e pode salvar uma vida.
              </p>
            </div>
          </div>

          {/* Formulário de denúncia — componente client */}
          <DenunciaForm />

        </div>
      </section>

      {/* ── FOOTER AMAA ─────────────────────────────────────────────────── */}
      <footer className="bg-emerald-900 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/amaa-logo-web.png" alt="AMAA" className="w-12 h-12 rounded-2xl bg-white p-1 object-contain" />
            <div>
              <p className="text-white font-bold">AMAA — Melhores Amigos dos Animais</p>
              <p className="text-emerald-300 text-sm">Realeza/PR · Apoio jurídico: Moreira Neto Advocacia</p>
            </div>
          </div>
          <div className="text-center md:text-right">
            <Link href="/" className="text-emerald-300 hover:text-white text-sm transition-colors">
              moreiraneto.adv.br
            </Link>
            <p className="text-emerald-500 text-xs mt-1">
              Material educativo — reprodução livre
            </p>
          </div>
        </div>
      </footer>

    </main>
  )
}
