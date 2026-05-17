'use client'

import { useState } from 'react'
import Link from 'next/link'
import DenunciaForm from './DenunciaForm'
import AdoptionInterestModal from './AdoptionInterestModal'

// ─── Sample adoptable animals (replaced by real photos when published) ─────
const ANIMALS = [
  {
    id: 'mel',
    name: 'Mel',
    species: 'cachorro' as const,
    sex: 'fêmea' as const,
    age: '2 anos',
    size: 'médio',
    photoBg: 'linear-gradient(135deg, #d8a888 0%, #b07a52 100%)',
    tagline: 'Brincalhona, ama crianças e passeios longos.',
    badges: ['Vacinada', 'Castrada', 'Vermifugada'],
    bio: 'A Mel chegou desconfiada, magra, com medo. Hoje, depois de 4 meses no lar temporário, é uma cachorrona apaixonada que distribui lambida pra quem chega perto. Ela se dá bem com outros cães.',
    rescue: 'Encontrada amarrada em um poste no centro de Realeza.',
  },
  {
    id: 'theo',
    name: 'Theo',
    species: 'gato' as const,
    sex: 'macho' as const,
    age: '8 meses',
    size: 'pequeno',
    photoBg: 'linear-gradient(135deg, #b8a3d6 0%, #6f5d8a 100%)',
    tagline: 'Filhote sem pressa, mas cheio de carinho.',
    badges: ['Castrado', 'FIV/FeLV neg.'],
    bio: 'O Theo passou os primeiros meses sozinho na beira da PR-182. Hoje é um gato curioso, gosta de janela aberta e dorme em qualquer colo disponível.',
    rescue: 'Resgatado de uma estrada na zona rural.',
  },
  {
    id: 'pipoca',
    name: 'Pipoca',
    species: 'cachorro' as const,
    sex: 'fêmea' as const,
    age: '5 meses',
    size: 'pequeno',
    photoBg: 'linear-gradient(135deg, #f0c97c 0%, #c98e3a 100%)',
    tagline: 'Filhotinha esperta — cabe no colo, vai crescer pouco.',
    badges: ['Vacinada', 'Será castrada'],
    bio: 'A Pipoca é da última ninhada que resgatamos. Pequena, viva, aprendeu rápido. Procura uma família com paciência pra fase filhote — e muito carinho.',
    rescue: 'Nascida nas ruas, mãe também resgatada.',
  },
  {
    id: 'belinha',
    name: 'Belinha',
    species: 'cachorro' as const,
    sex: 'fêmea' as const,
    age: '7 anos',
    size: 'médio',
    photoBg: 'linear-gradient(135deg, #c8b89a 0%, #8a7858 100%)',
    tagline: 'Companheira tranquila, ideal para casas calmas.',
    badges: ['Vacinada', 'Castrada'],
    bio: 'A Belinha foi devolvida quando a família mudou de cidade. É uma cachorra educada, sabe sentar, anda na guia, dorme bem. Procura uma segunda família que entenda que ela não é filhote.',
    rescue: 'Devolvida pela família anterior depois de 6 anos juntos.',
  },
  {
    id: 'noir',
    name: 'Noir',
    species: 'gato' as const,
    sex: 'macho' as const,
    age: '3 anos',
    size: 'médio',
    photoBg: 'linear-gradient(135deg, #4a4a4a 0%, #1f1a24 100%)',
    tagline: 'Discreto, dorme muito, conversa baixinho.',
    badges: ['Castrado', 'FIV/FeLV neg.'],
    bio: 'O Noir é um gato preto desses que ninguém adota. A gente quer mudar isso. Discreto, curioso, gosta de janelas altas. Ronrona pra quem ele conhece. Ideal pra apartamento.',
    rescue: 'Resgatado de uma fábrica abandonada.',
  },
  {
    id: 'bento',
    name: 'Bento',
    species: 'cachorro' as const,
    sex: 'macho' as const,
    age: '4 anos',
    size: 'grande',
    photoBg: 'linear-gradient(135deg, #6b8e6b 0%, #3a5a3a 100%)',
    tagline: 'Cachorrão dócil, trabalha por petisco.',
    badges: ['Vacinado', 'Castrado'],
    bio: 'O Bento ficou anos preso numa corrente curta. Agora redescobre o que é caminhar e brincar. É um cachorrão calmo, gentil, que precisa de espaço e paciência pra construir confiança.',
    rescue: 'Vivia preso a uma corrente de 1m no fundo de um quintal.',
  },
]

const FILTERS = [
  { id: 'todos', label: 'Todos' },
  { id: 'cachorro', label: 'Cães' },
  { id: 'gato', label: 'Gatos' },
  { id: 'filhote', label: 'Filhotes' },
  { id: 'adulto', label: 'Adultos' },
]

const STORIES = [
  {
    id: 's1',
    petName: 'Lulu',
    family: 'Família Schmidt',
    when: 'Adotada em jul/2024',
    photoBg: 'linear-gradient(135deg, #f0c97c 0%, #c98e3a 100%)',
    quote: 'A Lulu chegou em casa pequena e medrosa. Hoje, é a primeira a receber a gente na porta. Mudou a casa inteira.',
  },
  {
    id: 's2',
    petName: 'Romeu',
    family: 'Beatriz, Realeza',
    when: 'Adotado em mar/2025',
    photoBg: 'linear-gradient(135deg, #d8a888 0%, #b07a52 100%)',
    quote: 'Eu queria um gato. Acabei encontrando o Romeu na AMAA. Não imaginava que daria tanto certo. Ele dorme no meu pé enquanto escrevo isso.',
  },
  {
    id: 's3',
    petName: 'Tobias',
    family: 'Família Pereira',
    when: 'Adotado em out/2024',
    photoBg: 'linear-gradient(135deg, #b8a3d6 0%, #6f5d8a 100%)',
    quote: 'Adotamos o Tobias com 9 anos, depois que a tutora dele faleceu. Algumas pessoas acham que cachorro velho não se acostuma. Acostuma sim. E a gratidão é diferente.',
  },
]

const TIERS = [
  { value: 100, desc: 'Castra um pet de porte pequeno' },
  { value: 200, desc: 'Cuida de um bichinho por 2 meses, ou castra um macho de porte médio', featured: true, tag: 'Mais escolhida' },
  { value: 350, desc: 'Castra uma fêmea de porte médio' },
  { value: 500, desc: 'Castra uma fêmea de porte grande, ou cuida de um amigo por 150 dias' },
]

// ─── Icons ─────────────────────────────────────────────────────────────────
function HeartIcon({ filled, size = 18 }: { filled?: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>
    </svg>
  )
}

function XIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
    </svg>
  )
}

function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6"/>
    </svg>
  )
}

// ─── Animal Card ────────────────────────────────────────────────────────────
function AnimalCard({ animal, onOpen }: { animal: typeof ANIMALS[number]; onOpen: (a: typeof ANIMALS[number]) => void }) {
  const [liked, setLiked] = useState(false)
  return (
    <button className="amaa-animal-card" onClick={() => onOpen(animal)}>
      <div className="amaa-animal-photo" style={{ background: animal.photoBg }}>
        <span
          className="amaa-heart-btn"
          role="button"
          tabIndex={0}
          style={{ position: 'absolute', top: 12, right: 12 }}
          onClick={(e) => { e.stopPropagation(); setLiked(!liked) }}
        >
          <HeartIcon filled={liked} size={16} />
        </span>
        <span style={{
          position: 'absolute', top: 12, left: 12,
          background: '#fff', color: 'var(--amaa-magenta-600)',
          padding: '5px 10px', borderRadius: 'var(--radius-pill)',
          fontSize: 11, fontWeight: 700, letterSpacing: '0.04em'
        }}>Disponível</span>
      </div>
      <div className="amaa-animal-body">
        <div className="amaa-animal-name">
          {animal.name}
          <small>· {animal.age} · {animal.sex}</small>
        </div>
        <div className="amaa-animal-tagline">{animal.tagline}</div>
        <div className="amaa-badges">
          {animal.badges.map((b) => <span key={b} className="amaa-badge">{b}</span>)}
        </div>
      </div>
    </button>
  )
}

// ─── Animal Detail ──────────────────────────────────────────────────────────
function AnimalDetail({
  animal,
  onBack,
  onAdopt,
}: {
  animal: typeof ANIMALS[number]
  onBack: () => void
  onAdopt: () => void
}) {
  return (
    <div className="amaa-section">
      <div className="amaa-container">
        <button
          onClick={onBack}
          style={{
            background: 'none', border: 0, cursor: 'pointer',
            fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600,
            color: 'var(--amaa-ink-2)', display: 'inline-flex', alignItems: 'center',
            gap: 6, marginBottom: 24
          }}
        >
          <ChevronLeft /> Voltar
        </button>
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 48, alignItems: 'start' }}
          className="detail-grid">
          <div style={{
            aspectRatio: '4/3', borderRadius: 'var(--radius-xl)',
            background: animal.photoBg, display: 'grid', placeItems: 'center',
            boxShadow: 'var(--shadow-md)', fontSize: 120
          }} />
          <div>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontWeight: 700,
              fontSize: 'clamp(2.25rem, 4vw, 3rem)', letterSpacing: '-0.02em',
              color: 'var(--amaa-ink)', marginBottom: 6
            }}>{animal.name}</h1>
            <p style={{ fontSize: 17, color: 'var(--amaa-ink-3)', marginBottom: 16 }}>
              {animal.age} · {animal.sex} · porte {animal.size}
            </p>
            <div className="amaa-badges" style={{ marginBottom: 20 }}>
              {animal.badges.map(b => <span key={b} className="amaa-badge">{b}</span>)}
            </div>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--amaa-ink-2)', marginBottom: 12 }}>
              {animal.bio}
            </p>
            <div style={{
              background: 'var(--amaa-magenta-50)', borderRadius: 16, padding: '16px 18px',
              borderLeft: '3px solid var(--amaa-magenta)', fontSize: 14, lineHeight: 1.6,
              color: 'var(--amaa-ink-2)', margin: '18px 0 28px'
            }}>
              <strong style={{ color: 'var(--amaa-magenta-600)' }}>Como nos conhecemos: </strong>
              {animal.rescue}
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button className="amaa-btn amaa-btn-primary amaa-btn-lg" onClick={onAdopt}>
                <HeartIcon filled size={18} />
                Quero adotar {animal.name}
              </button>
              <button className="amaa-btn amaa-btn-ghost">
                <ShareIcon /> Compartilhar
              </button>
            </div>
          </div>
        </div>
      </div>
      <style>{`.detail-grid { @media (max-width: 880px) { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  )
}

// ─── Main Page ──────────────────────────────────────────────────────────────
export default function AmaaPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [filter, setFilter] = useState('todos')
  const [donateMode, setDonateMode] = useState<'monthly' | 'once'>('monthly')
  const [activeAnimal, setActiveAnimal] = useState<typeof ANIMALS[number] | null>(null)
  const [view, setView] = useState<'home' | 'detail'>('home')
  const [adoptModalOpen, setAdoptModalOpen] = useState(false)

  function openAnimal(a: typeof ANIMALS[number]) {
    setActiveAnimal(a)
    setView('detail')
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  function goHome() {
    setView('home')
    setActiveAnimal(null)
  }

  const visible = ANIMALS.filter(a => {
    if (filter === 'todos') return true
    if (filter === 'cachorro' || filter === 'gato') return a.species === filter
    const isMonths = a.age.includes('mes')
    const num = parseInt(a.age)
    if (filter === 'filhote') return isMonths || num < 1
    if (filter === 'adulto') return !isMonths && num >= 1
    return true
  })

  return (
    <div className="amaa">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="amaa-header">
        <div className="amaa-container">
          <div className="amaa-header-inner">
            <button
              className="amaa-brand"
              style={{ background: 'none', border: 0, padding: 0 }}
              onClick={goHome}
            >
              <img src="/amaa-mark.png" alt="AMAA" style={{ height: 38 }} />
              <span className="amaa-brand-label">
                AMAA
                <small className="amaa-brand-sub">Realeza · PR</small>
              </span>
            </button>

            <nav className="amaa-nav">
              <a href="#adocao" onClick={() => { setView('home'); setFilter('todos') }}>Adotar</a>
              <a href="#como-adotar">Como adotar</a>
              <a href="#doe">Doe</a>
              <a href="#denuncia">Denúncia</a>
              <Link href="/" style={{ color: 'var(--amaa-ink-3)', fontSize: 13 }}>← MNA</Link>
            </nav>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button
                className="amaa-btn amaa-btn-primary amaa-btn-sm"
                onClick={() => { goHome(); setTimeout(() => document.getElementById('adocao')?.scrollIntoView({ behavior: 'smooth' }), 50) }}
              >
                <HeartIcon size={15} /> Adote
              </button>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                style={{
                  display: 'none', background: 'none', border: 0, cursor: 'pointer',
                  color: 'var(--amaa-ink)', padding: 4
                }}
                className="amaa-menu-toggle"
                aria-label="Menu"
              >
                {menuOpen ? <XIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>

          {menuOpen && (
            <div className="amaa-mobile-menu">
              <a href="#adocao" className="magenta" onClick={() => setMenuOpen(false)}>Adotar</a>
              <a href="#como-adotar" onClick={() => setMenuOpen(false)}>Como adotar</a>
              <a href="#doe" onClick={() => setMenuOpen(false)}>Doe</a>
              <a href="#denuncia" onClick={() => setMenuOpen(false)}>Denúncia</a>
              <Link href="/" style={{ color: 'var(--amaa-ink-3)', fontSize: 13 }}>← Moreira Neto Advocacia</Link>
            </div>
          )}
        </div>
      </header>

      {/* ── Detail view ────────────────────────────────────────────────────── */}
      {view === 'detail' && activeAnimal && (
        <>
          <AnimalDetail
            animal={activeAnimal}
            onBack={goHome}
            onAdopt={() => setAdoptModalOpen(true)}
          />
          {adoptModalOpen && (
            <AdoptionInterestModal
              animalId={activeAnimal.id}
              animalName={activeAnimal.name}
              isOpen={adoptModalOpen}
              onClose={() => setAdoptModalOpen(false)}
            />
          )}
        </>
      )}

      {/* ── Home sections ──────────────────────────────────────────────────── */}
      {view === 'home' && (
        <>
          {/* ── Hero ─────────────────────────────────────────────────────── */}
          <section className="amaa-hero">
            <div className="amaa-container">
              <div className="amaa-hero-grid">
                {/* Left: copy */}
                <div>
                  <div className="amaa-eyebrow">Adoção responsável em Realeza</div>
                  <h1>
                    Adote um amigo.<br />
                    <span className="accent">Mude duas vidas.</span>
                  </h1>
                  <p className="lead">
                    Conheça os cães e gatos resgatados pela AMAA — vacinados,
                    castrados e prontos para encontrar um lar de verdade.
                  </p>
                  <div className="amaa-hero-ctas">
                    <a href="#adocao" className="amaa-btn amaa-btn-primary amaa-btn-lg">
                      <HeartIcon size={18} /> Ver disponíveis
                    </a>
                    <a href="#doe" className="amaa-btn amaa-btn-ghost amaa-btn-lg">
                      Quero ajudar de outra forma
                    </a>
                  </div>
                </div>

                {/* Right: art */}
                <div className="amaa-hero-art">
                  <img src="/amaa-mark.png" alt="AMAA — cão e gato formando um coração" />
                  <div className="amaa-float-card amaa-float-tl">
                    <span className="num">127</span>
                    <span>amigos adotados<br/>em 2025</span>
                  </div>
                  <div className="amaa-float-card amaa-float-br">
                    <span className="num">{ANIMALS.length}</span>
                    <span>aguardando<br/>um lar agora</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── Animal grid ──────────────────────────────────────────────── */}
          <section id="adocao" className="amaa-section alt">
            <div className="amaa-container">
              <div className="amaa-section-head">
                <div className="amaa-eyebrow">Disponíveis para adoção</div>
                <h2>Conheça quem está esperando você</h2>
                <p>Todos vacinados, castrados e atendidos veterinariamente. A adoção é gratuita.</p>
              </div>

              <div className="amaa-filter-bar">
                {FILTERS.map(f => (
                  <button
                    key={f.id}
                    className={`amaa-chip${filter === f.id ? ' active' : ''}`}
                    onClick={() => setFilter(f.id)}
                  >{f.label}</button>
                ))}
              </div>

              {visible.length === 0 ? (
                <div className="amaa-empty">
                  Nenhum animal nesse filtro agora — mas chega gente nova toda semana 🐾
                </div>
              ) : (
                <div className="amaa-animal-grid">
                  {visible.map(a => <AnimalCard key={a.id} animal={a} onOpen={openAnimal} />)}
                </div>
              )}
            </div>
          </section>

          {/* ── How it works ─────────────────────────────────────────────── */}
          <section id="como-adotar" className="amaa-section">
            <div className="amaa-container">
              <div className="amaa-section-head">
                <div className="amaa-eyebrow">Como adotar</div>
                <h2>Três passos, sem complicação</h2>
                <p>Adoção responsável é simples — mas a gente conversa antes pra ter certeza que vai dar certo pra todo mundo.</p>
              </div>
              <div className="amaa-steps">
                {[
                  { n: '01', title: 'Conheça', body: 'Veja os animais disponíveis no site e escolha um que combine com a sua rotina.' },
                  { n: '02', title: 'Converse', body: 'Mande mensagem pra gente. Trocamos algumas perguntas pra fazer um match bom — pra você e pro animal.' },
                  { n: '03', title: 'Receba em casa', body: 'Assinamos juntos o termo de responsabilidade e combinamos a entrega. A adoção é gratuita.' },
                ].map(s => (
                  <div key={s.n} className="amaa-step-card">
                    <div className="amaa-step-num">{s.n}</div>
                    <h3>{s.title}</h3>
                    <p>{s.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Donate ───────────────────────────────────────────────────── */}
          <section id="doe" className="amaa-section alt">
            <div className="amaa-container">
              <div className="amaa-section-head">
                <div className="amaa-eyebrow">Doe</div>
                <h2>Cada real ajuda a manter um focinho alimentado</h2>
                <p>A AMAA é mantida por voluntários e doações. Toda contribuição vai direto pro cuidado dos animais.</p>
              </div>

              <div className="amaa-donate-toggle">
                <button
                  className={donateMode === 'monthly' ? 'active' : ''}
                  onClick={() => setDonateMode('monthly')}
                >Mensal</button>
                <button
                  className={donateMode === 'once' ? 'active' : ''}
                  onClick={() => setDonateMode('once')}
                >Única</button>
              </div>

              <div className="amaa-tiers">
                {TIERS.map(t => (
                  <div key={t.value} className={`amaa-tier${t.featured ? ' featured' : ''}`}>
                    {t.tag && <span className="amaa-tier-tag">{t.tag}</span>}
                    <div className="amaa-tier-price">
                      R$ {t.value}
                      <small>{donateMode === 'monthly' ? '/mês' : ''}</small>
                    </div>
                    <div className="amaa-tier-desc">{t.desc}</div>
                    <button className="amaa-tier-btn">Doar agora</button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Stories + stats ───────────────────────────────────────────── */}
          <section className="amaa-section">
            <div className="amaa-container">
              <div className="amaa-section-head">
                <div className="amaa-eyebrow">Histórias</div>
                <h2>Famílias que escolheram adotar</h2>
              </div>

              <div className="amaa-story-grid">
                {STORIES.map(s => (
                  <div key={s.id} className="amaa-story">
                    <div style={{
                      aspectRatio: '16/10',
                      background: s.photoBg,
                      display: 'grid', placeItems: 'center'
                    }} />
                    <div className="amaa-story-body">
                      <div className="amaa-story-quote">{s.quote}</div>
                      <div className="amaa-story-meta">
                        <span><strong>{s.petName}</strong> · {s.family}</span>
                        <span>{s.when}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="amaa-stats-strip">
                <div className="amaa-stat">
                  <div className="num">127</div>
                  <div className="label">amigos adotados em 2025</div>
                </div>
                <div className="amaa-stat">
                  <div className="num">{ANIMALS.length}</div>
                  <div className="label">animais aguardando lar</div>
                </div>
                <div className="amaa-stat">
                  <div className="num">8 anos</div>
                  <div className="label">de história em Realeza</div>
                </div>
                <div className="amaa-stat">
                  <div className="num">26</div>
                  <div className="label">voluntários ativos</div>
                </div>
              </div>
            </div>
          </section>

          {/* ── About ────────────────────────────────────────────────────── */}
          <section className="amaa-section alt">
            <div className="amaa-container">
              <div className="amaa-about-grid">
                <div>
                  <div className="amaa-eyebrow">Sobre a AMAA</div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', color: 'var(--amaa-ink)', marginBottom: 16 }}>
                    Voluntários, focinhos<br />e muito amor
                  </h2>
                  <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--amaa-ink-2)', marginBottom: 16 }}>
                    Somos um grupo de voluntários de Realeza, no sudoeste do Paraná, que resgata, cuida e encontra famílias para cães e gatos em situação de rua, abandono ou maus-tratos.
                  </p>
                  <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--amaa-ink-2)' }}>
                    A AMAA é hospedada pelo escritório{' '}
                    <Link href="/" style={{ color: 'var(--amaa-magenta)', fontWeight: 600 }}>
                      Moreira Neto Advocacia
                    </Link>
                    , que oferece estrutura administrativa e jurídica para a associação.
                  </p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {[
                    { label: 'Adoções em 2025', value: '127', color: 'var(--amaa-magenta)' },
                    { label: 'Voluntários ativos', value: '26', color: 'var(--amaa-cyan)' },
                    { label: 'Anos de história', value: '8', color: 'var(--amaa-cyan)' },
                    { label: 'À espera de lar', value: String(ANIMALS.length), color: 'var(--amaa-magenta)' },
                  ].map(item => (
                    <div key={item.label} style={{
                      background: 'var(--amaa-surface)',
                      border: '1px solid var(--amaa-line)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '20px 18px',
                      boxShadow: 'var(--shadow-xs)'
                    }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 36, color: item.color, letterSpacing: '-0.02em', lineHeight: 1 }}>{item.value}</div>
                      <div style={{ fontSize: 12, color: 'var(--amaa-ink-3)', marginTop: 6, lineHeight: 1.4 }}>{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── Denúncia ─────────────────────────────────────────────────── */}
          <section id="denuncia" className="amaa-section">
            <div className="amaa-container">
              <div className="amaa-section-head">
                <div className="amaa-eyebrow" style={{ color: 'var(--amaa-danger)' }}>Denúncia</div>
                <h2>Viu um animal sofrendo? Denuncie.</h2>
                <p>
                  Todas as denúncias são encaminhadas à AMAA e, quando necessário, às autoridades competentes.
                  Você pode fazer a denúncia de forma anônima.
                </p>
              </div>

              <div className="amaa-denuncia-card">
                <div className="amaa-lei-box">
                  <div className="amaa-lei-label">Lei Sansão (Lei nº 14.064/2020)</div>
                  <p>
                    Maus-tratos a cães e gatos resultam em <strong>reclusão de 2 a 5 anos</strong> + multa.
                    Sua denúncia faz diferença — e pode salvar uma vida.
                  </p>
                </div>
                <DenunciaForm />
              </div>
            </div>
          </section>
        </>
      )}

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="amaa-footer">
        <div className="amaa-container">
          <div className="amaa-footer-grid">
            <div className="amaa-footer-blurb">
              <img src="/amaa-mark.png" alt="AMAA" />
              <p>Associação Melhores Amigos dos Animais — voluntários de Realeza, no sudoeste do Paraná, dedicados ao resgate, cuidado e adoção de cães e gatos.</p>
            </div>
            <div>
              <h4>Adoção</h4>
              <ul>
                <li><a href="#adocao">Disponíveis</a></li>
                <li><a href="#como-adotar">Como adotar</a></li>
              </ul>
            </div>
            <div>
              <h4>Ajude</h4>
              <ul>
                <li><a href="#doe">Doe (PIX)</a></li>
                <li><a href="#doe">Apadrinhar</a></li>
              </ul>
            </div>
            <div>
              <h4>Contato</h4>
              <ul>
                <li><a href="https://wa.me/5546999999999" target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
                <li><a href="#denuncia">Denúncia</a></li>
                <li><Link href="/">Moreira Neto Advocacia</Link></li>
              </ul>
            </div>
          </div>
          <div className="amaa-footer-legal">
            <span>© {new Date().getFullYear()} AMAA — Associação Melhores Amigos dos Animais</span>
            <span>Hospedado por <Link href="/" style={{ color: 'rgba(255,255,255,0.6)' }}>Moreira Neto Advocacia</Link></span>
          </div>
        </div>
      </footer>

      {/* ── Responsive override for menu toggle ────────────────────────────── */}
      <style>{`
        @media (max-width: 880px) {
          .amaa-menu-toggle { display: flex !important; }
        }
      `}</style>
    </div>
  )
}
