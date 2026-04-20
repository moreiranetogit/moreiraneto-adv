'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronRight, Mail, Phone } from 'lucide-react';
import { AREAS } from '@/lib/conteudo-areas';
import ContactSection from '@/components/ContactSection';

const COLORS = {
  dourado: '#E8941F',
  branco: '#FFFFFF',
  areia: '#F5E6D3',
  cinzaClaro: '#D3D3D3',
  cinzaEscuro: '#2D2D2D',
  cinzaMedio: '#666666',
  preto: '#000000',
};

const FONT_SERIF = 'var(--font-serif)';

interface Noticia {
  id: string;
  title: string;
  slug: string;
  category: string;
  published_at: string;
}

const NAV_ITEMS = [
  { label: 'Início', href: '#home' },
  { label: 'Quem Somos', href: '#about' },
  { label: 'Áreas de Atuação', href: '#areas' },
  { label: 'Notícias e Opiniões', href: '/noticias-e-opinioes' },
  { label: 'Adoção AMAA', href: '/amaa' },
  { label: 'Denúncia de Maus-Tratos', href: '/amaa#denuncia' },
  { label: 'Contato', href: '#contact' },
];

// AREAS importado de lib/conteudo-areas.ts

const DIFERENCIAIS = [
  'Experiência de 20+ anos em Direito Agrário e Agronegócio',
  'Equipe especializada em conformidade rural',
  'Atendimento personalizado e estratégico',
  'Soluções criativas dentro da lei',
  'Foco em eficiência e redução de custos',
  'Conhecimento profundo do mercado local',
];

export default function HomePage() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [noticiaAtual, setNoticiaAtual] = useState(0);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarNoticias();
  }, []);

  const carregarNoticias = async () => {
    try {
      const res = await fetch('/api/noticias?limit=5');
      if (res.ok) {
        const data = await res.json();
        setNoticias(data);
      }
    } catch (err) {
      console.error('Erro ao carregar notícias:', err);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    if (noticias.length === 0) return;
    const intervalo = setInterval(() => {
      setNoticiaAtual((prev) => (prev + 1) % noticias.length);
    }, 8000);
    return () => clearInterval(intervalo);
  }, [noticias]);

  const noticiaExibindo = noticias[noticiaAtual];

  return (
    <div
      style={{
        backgroundColor: COLORS.areia,
        color: COLORS.cinzaEscuro,
        fontFamily: FONT_SERIF,
      }}
    >
      {/* ========== HEADER PREMIUM - CHUMBO ========== */}
      <header
        style={{
          backgroundColor: '#2C2C2C',
          borderBottom: `3px solid ${COLORS.dourado}`,
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.15)',
        }}
        className="sticky top-0 z-50"
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '12px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '32px',
          }}
        >
          {/* Logo Imagem */}
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              cursor: 'pointer',
              opacity: 1,
              transition: 'opacity 0.3s ease',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.8';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            <img
              src="/mna-logo-web.png"
              alt="MNA Logo"
              style={{
                height: '50px',
                width: 'auto',
                display: 'block',
              }}
            />
          </Link>

          {/* Nav Desktop - Centro */}
          <nav
            style={{
              display: 'flex',
              gap: '32px',
              flex: 1,
              justifyContent: 'center',
            }}
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  padding: '8px 0',
                  color: COLORS.branco,
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'color 0.3s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = COLORS.dourado;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = COLORS.branco;
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Contato Icons - Direita */}
          <div
            style={{
              display: 'flex',
              gap: '20px',
              alignItems: 'center',
              flexShrink: 0,
            }}
          >
            <a
              href="https://wa.me/5546999779865?text=Olá,%20gostaria%20de%20agendar%20uma%20consulta"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                cursor: 'pointer',
                transition: 'opacity 0.3s ease',
                display: 'flex',
                alignItems: 'center',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.7';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
              title="WhatsApp"
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke={COLORS.dourado}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                <path d="M9 10h.01"></path>
                <path d="M12 10h.01"></path>
                <path d="M15 10h.01"></path>
              </svg>
            </a>
            <a
              href="mailto:contato@moreiraneto.adv.br"
              style={{
                color: COLORS.dourado,
                cursor: 'pointer',
                transition: 'color 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
              title="Email"
            >
              <Mail size={20} />
            </a>
          </div>
        </div>
      </header>

      {/* ========== NEWS TICKER ========== */}
      <div
        style={{
          backgroundColor: COLORS.cinzaClaro,
          padding: '12px 20px',
          overflow: 'hidden',
          borderBottom: `1px solid ${COLORS.cinzaMedio}`,
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
          }}
        >
          <span
            style={{
              fontSize: '11px',
              fontWeight: '600',
              color: COLORS.cinzaMedio,
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            ÚLTIMAS NOTÍCIAS
          </span>
          <div
            style={{
              flex: 1,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: '48px',
                animation: 'ticker-scroll 30s linear infinite',
                whiteSpace: 'nowrap',
              }}
            >
              {noticias.length > 0 ? (
                <>
                  {noticias.map((noticia, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: '12px',
                        color: COLORS.cinzaMedio,
                        flexShrink: 0,
                      }}
                    >
                      • {noticia.title}
                    </span>
                  ))}
                  {noticias.map((noticia, idx) => (
                    <span
                      key={`repeat-${idx}`}
                      style={{
                        fontSize: '12px',
                        color: COLORS.cinzaMedio,
                        flexShrink: 0,
                      }}
                    >
                      • {noticia.title}
                    </span>
                  ))}
                </>
              ) : (
                <>
                  <span
                    style={{
                      fontSize: '12px',
                      color: COLORS.cinzaMedio,
                      flexShrink: 0,
                    }}
                  >
                    Acompanhe as últimas notícias e opiniões do Radar Jurídico
                  </span>
                  <span
                    style={{
                      fontSize: '12px',
                      color: COLORS.cinzaMedio,
                      flexShrink: 0,
                    }}
                  >
                    Acompanhe as últimas notícias e opiniões do Radar Jurídico
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        <style>{`
          @keyframes ticker-scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </div>

      {/* ========== HERO GRANDE - IMAGEM INTEIRA ========== */}
      <section
        id="home"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'auto',
          padding: '60px 20px 80px',
          color: COLORS.branco,
          backgroundColor: COLORS.branco,
        }}
      >
        {/* Container centralizado para a imagem */}
        <div
          style={{
            width: '100%',
            maxWidth: '1000px',
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '40px',
          }}
        >
          <img
            src="/mna-logo-araucaria-web.jpg"
            alt="Moreira Neto Advocacia - Logo integrado em composição com araucária"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              maxWidth: '100%',
            }}
          />
        </div>

        {/* Content - Buttons */}
        <div
          style={{
            position: 'relative',
            textAlign: 'center',
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            width: '100%',
            maxWidth: '600px',
          }}
        >
          <Link
            href="#contact"
            style={{
              padding: '16px 32px',
              backgroundColor: COLORS.dourado,
              color: COLORS.cinzaEscuro,
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              display: 'inline-block',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(232, 148, 31, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Agende uma Consulta
          </Link>
          <Link
            href="#areas"
            style={{
              padding: '16px 32px',
              backgroundColor: '#1a1a1a',
              color: COLORS.dourado,
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: '600',
              border: `2px solid ${COLORS.dourado}`,
              transition: 'all 0.3s ease',
              display: 'inline-block',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = COLORS.dourado;
              e.currentTarget.style.color = '#1a1a1a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#1a1a1a';
              e.currentTarget.style.color = COLORS.dourado;
            }}
          >
            Conheça Nossas Áreas
          </Link>
        </div>
      </section>

      {/* ========== SEÇÃO BEM-VINDO / QUEM SOMOS ========== */}
      <section
        id="about"
        style={{
          padding: '80px 20px',
          maxWidth: '1280px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '64px',
            alignItems: 'center',
          }}
        >
          <div>
            <h2
              style={{
                fontSize: '48px',
                fontWeight: '700',
                marginBottom: '32px',
                color: COLORS.cinzaEscuro,
                letterSpacing: '-1px',
              }}
            >
              Seja bem vindo ao Moreira Neto Advocacia
            </h2>
            <p
              style={{
                fontSize: '16px',
                marginBottom: '24px',
                opacity: 0.85,
                lineHeight: 1.7,
              }}
            >
              Somos um escritório de advocacia especializado em Direito Agrário, Agronegócio e assessoria jurídica
              completa. Desde nossa fundação, atendemos produtores rurais, cooperativas e empresas com soluções
              estratégicas e criativas.
            </p>
            <p
              style={{
                fontSize: '16px',
                marginBottom: '32px',
                opacity: 0.85,
                lineHeight: 1.7,
              }}
            >
              Nossa abordagem combina profundo conhecimento do mercado local com expertise jurídica de alto nível.
              Buscamos soluções eficientes, dentro da lei e ajustadas à realidade de nossos clientes.
            </p>
            <Link
              href="/noticias-e-opinioes"
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                backgroundColor: COLORS.dourado,
                color: COLORS.cinzaEscuro,
                textDecoration: 'none',
                borderRadius: '6px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(232, 148, 31, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Notícias e Opiniões →
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px',
            }}
          >
            {DIFERENCIAIS.map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: '20px',
                  borderRadius: '8px',
                  backgroundColor: COLORS.branco,
                  borderLeft: `4px solid ${COLORS.dourado}`,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <p
                  style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: COLORS.cinzaEscuro,
                    margin: 0,
                  }}
                >
                  ✓ {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== ÁREAS DE ATUAÇÃO ========== */}
      <section
        id="areas"
        style={{
          backgroundColor: COLORS.branco,
          padding: '80px 20px',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <p
              style={{
                fontSize: '13px',
                fontWeight: '600',
                letterSpacing: '2px',
                color: COLORS.dourado,
                textTransform: 'uppercase',
                marginBottom: '12px',
              }}
            >
              Expertise Jurídica
            </p>
            <h2
              style={{
                fontSize: '48px',
                fontWeight: '700',
                color: COLORS.cinzaEscuro,
                letterSpacing: '-1px',
                marginBottom: '16px',
              }}
            >
              Áreas de Atuação
            </h2>
            <p
              style={{
                fontSize: '18px',
                opacity: 0.75,
                maxWidth: '800px',
                margin: '0 auto',
                lineHeight: 1.6,
              }}
            >
              Expertise especializada em diversos ramos do Direito, oferecendo soluções estratégicas e personalizadas
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '32px',
            }}
          >
            {AREAS.map((area, idx) => (
              <Link
                key={idx}
                href={`/areas/${area.slug}`}
                style={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  backgroundColor: 'white',
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.15)';
                  e.currentTarget.style.transform = 'translateY(-8px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Imagem Grande - Hero */}
                <div
                  style={{
                    width: '100%',
                    height: '280px',
                    overflow: 'hidden',
                    backgroundColor: '#f0f0f0',
                  }}
                >
                  <img
                    src={area.imagem}
                    alt={area.titulo}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center',
                      display: 'block',
                    }}
                  />
                </div>

                {/* Conteúdo */}
                <div style={{ padding: '32px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3
                    style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      marginBottom: '12px',
                      color: COLORS.cinzaEscuro,
                    }}
                  >
                    {area.titulo}
                  </h3>
                  <p
                    style={{
                      fontSize: '15px',
                      opacity: 0.8,
                      marginBottom: '24px',
                      lineHeight: 1.6,
                      color: COLORS.cinzaEscuro,
                      flex: 1,
                    }}
                  >
                    {area.descricaoCurta}
                  </p>
                  <div
                    style={{
                      fontSize: '15px',
                      fontWeight: '600',
                      color: COLORS.dourado,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'gap 0.3s ease',
                    }}
                  >
                    Saiba Mais <ChevronRight size={18} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========== SEÇÃO CONTATO ========== */}
      <ContactSection />

      {/* ========== FOOTER ========== */}
      <footer
        style={{
          backgroundColor: COLORS.cinzaEscuro,
          color: COLORS.branco,
          padding: '60px 20px 20px',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '40px',
            marginBottom: '40px',
          }}
        >
          {/* Sobre */}
          <div>
            <h4
              style={{
                fontSize: '16px',
                fontWeight: '700',
                marginBottom: '16px',
                color: COLORS.dourado,
              }}
            >
              O Moreira Neto
            </h4>
            <p style={{ fontSize: '14px', opacity: 0.8, lineHeight: 1.6 }}>
              Advocacia especializada em Direito Agrário, Agronegócio e assessoria jurídica completa.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4
              style={{
                fontSize: '16px',
                fontWeight: '700',
                marginBottom: '16px',
                color: COLORS.dourado,
              }}
            >
              Navegação
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {NAV_ITEMS.map((item) => (
                <li key={item.href} style={{ marginBottom: '8px' }}>
                  <Link
                    href={item.href}
                    style={{
                      color: COLORS.branco,
                      textDecoration: 'none',
                      fontSize: '14px',
                      opacity: 0.8,
                      transition: 'opacity 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '1';
                      e.currentTarget.style.color = COLORS.dourado;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '0.8';
                      e.currentTarget.style.color = COLORS.branco;
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* AMAA */}
          <div>
            <h4
              style={{
                fontSize: '16px',
                fontWeight: '700',
                marginBottom: '16px',
                color: COLORS.dourado,
              }}
            >
              Responsabilidade Social
            </h4>
            <p style={{ fontSize: '14px', opacity: 0.8, lineHeight: 1.6 }}>
              Apoiamos a AMAA (Associação de Amigos dos Animais de Realeza/PR) na proteção e denúncia de maus-tratos
              animal.
            </p>
          </div>
        </div>

        <div
          style={{
            borderTop: `1px solid rgba(255, 255, 255, 0.1)`,
            paddingTop: '20px',
            textAlign: 'center',
            fontSize: '12px',
            opacity: 0.6,
          }}
        >
          <p>© {new Date().getFullYear()} Moreira Neto Advocacia. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
