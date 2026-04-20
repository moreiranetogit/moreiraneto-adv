import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { getAreaBySlug, getAllAreasSlug, AREAS } from '@/lib/conteudo-areas';
import { notFound } from 'next/navigation';
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

export default async function AreaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const area = getAreaBySlug(slug);

  if (!area) {
    notFound();
  }

  const outrasAreas = AREAS.filter(a => a.slug !== area.slug);

  return (
    <div
      style={{
        backgroundColor: COLORS.areia,
        color: COLORS.cinzaEscuro,
        fontFamily: FONT_SERIF,
      }}
    >
      {/* ========== HEADER ========== */}
      <header
        style={{
          backgroundColor: '#2C2C2C',
          borderBottom: `3px solid ${COLORS.dourado}`,
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.15)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
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

          <nav
            style={{
              display: 'flex',
              gap: '32px',
              flex: 1,
              justifyContent: 'center',
            }}
          >
            <Link
              href="/"
              style={{
                padding: '8px 0',
                color: COLORS.branco,
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'color 0.3s ease',
              }}
            >
              Início
            </Link>
            <Link
              href="/#areas"
              style={{
                padding: '8px 0',
                color: COLORS.branco,
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'color 0.3s ease',
              }}
            >
              Áreas
            </Link>
            <Link
              href="/#contact"
              style={{
                padding: '8px 0',
                color: COLORS.branco,
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'color 0.3s ease',
              }}
            >
              Contato
            </Link>
          </nav>

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
              </svg>
            </a>
            <a
              href="mailto:contato@moreiraneto.adv.br"
              style={{
                color: COLORS.dourado,
                cursor: 'pointer',
                transition: 'color 0.3s ease',
              }}
              title="Email"
            >
              <Mail size={20} />
            </a>
          </div>
        </div>
      </header>

      {/* ========== HERO SECTION COM IMAGEM ========== */}
      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 20px 80px',
          backgroundColor: COLORS.branco,
        }}
      >
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
            src={area.imagem}
            alt={area.titulo}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              maxWidth: '100%',
              borderRadius: '8px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
            }}
          />
        </div>

        <div
          style={{
            maxWidth: '900px',
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              fontSize: '48px',
              fontWeight: '700',
              marginBottom: '24px',
              color: COLORS.cinzaEscuro,
              letterSpacing: '-1px',
            }}
          >
            {area.titulo}
          </h1>
          <p
            style={{
              fontSize: '18px',
              opacity: 0.8,
              lineHeight: 1.6,
              color: COLORS.cinzaMedio,
            }}
          >
            {area.descricaoCurta}
          </p>
        </div>
      </section>

      {/* ========== INTRODUÇÃO ========== */}
      <section
        style={{
          padding: '80px 20px',
          maxWidth: '1280px',
          margin: '0 auto',
        }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {area.introducao.map((paragrafo, idx) => (
            <p
              key={idx}
              style={{
                fontSize: '16px',
                marginBottom: '24px',
                opacity: 0.85,
                lineHeight: 1.8,
                textAlign: 'justify',
              }}
            >
              {paragrafo}
            </p>
          ))}
        </div>
      </section>

      {/* ========== QUESTÕES QUE RESOLVEMOS ========== */}
      <section
        style={{
          backgroundColor: COLORS.branco,
          padding: '80px 20px',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h2
            style={{
              fontSize: '40px',
              fontWeight: '700',
              marginBottom: '64px',
              textAlign: 'center',
              color: COLORS.cinzaEscuro,
              letterSpacing: '-1px',
            }}
          >
            Questões que Resolvemos
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '32px',
            }}
          >
            {area.questoes.map((questao, idx) => (
              <div
                key={idx}
                style={{
                  padding: '32px',
                  backgroundColor: COLORS.areia,
                  borderRadius: '8px',
                  borderLeft: `4px solid ${COLORS.dourado}`,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                  transition: 'all 0.3s ease',
                }}
              >
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    marginBottom: '12px',
                    color: COLORS.cinzaEscuro,
                  }}
                >
                  {questao.titulo}
                </h3>
                <p
                  style={{
                    fontSize: '15px',
                    opacity: 0.85,
                    lineHeight: 1.6,
                    color: COLORS.cinzaMedio,
                    margin: 0,
                  }}
                >
                  {questao.descricao}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== EXEMPLOS PRÁTICOS ========== */}
      <section
        style={{
          padding: '80px 20px',
          maxWidth: '1280px',
          margin: '0 auto',
        }}
      >
        <h2
          style={{
            fontSize: '40px',
            fontWeight: '700',
            marginBottom: '64px',
            textAlign: 'center',
            color: COLORS.cinzaEscuro,
            letterSpacing: '-1px',
          }}
        >
          Exemplos Práticos
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '32px',
          }}
        >
          {area.exemplos.map((exemplo, idx) => (
            <div
              key={idx}
              style={{
                padding: '32px',
                backgroundColor: COLORS.branco,
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                border: `1px solid ${COLORS.cinzaClaro}`,
              }}
            >
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  marginBottom: '16px',
                  color: COLORS.dourado,
                }}
              >
                {exemplo.cenario}
              </h3>
              <p
                style={{
                  fontSize: '15px',
                  opacity: 0.8,
                  lineHeight: 1.7,
                  color: COLORS.cinzaMedio,
                  margin: 0,
                }}
              >
                {exemplo.descricao}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ========== DIFERENCIAIS ========== */}
      <section
        style={{
          backgroundColor: COLORS.branco,
          padding: '80px 20px',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h2
            style={{
              fontSize: '40px',
              fontWeight: '700',
              marginBottom: '64px',
              textAlign: 'center',
              color: COLORS.cinzaEscuro,
              letterSpacing: '-1px',
            }}
          >
            Diferenciais Moreira Neto
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '48px',
              maxWidth: '1200px',
              margin: '0 auto',
            }}
          >
            {area.diferenciais.map((diferencial, idx) => (
              <div key={idx} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    backgroundColor: COLORS.dourado,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px',
                    fontSize: '28px',
                    fontWeight: '700',
                    color: COLORS.branco,
                  }}
                >
                  {idx + 1}
                </div>
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    marginBottom: '12px',
                    color: COLORS.cinzaEscuro,
                  }}
                >
                  {diferencial.titulo}
                </h3>
                <p
                  style={{
                    fontSize: '15px',
                    opacity: 0.8,
                    lineHeight: 1.7,
                    color: COLORS.cinzaMedio,
                  }}
                >
                  {diferencial.descricao}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== OUTRAS ÁREAS ========== */}
      <section
        style={{
          padding: '80px 20px',
          maxWidth: '1280px',
          margin: '0 auto',
        }}
      >
        <h2
          style={{
            fontSize: '40px',
            fontWeight: '700',
            marginBottom: '64px',
            textAlign: 'center',
            color: COLORS.cinzaEscuro,
            letterSpacing: '-1px',
          }}
        >
          Outras Áreas de Atuação
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
          }}
        >
          {outrasAreas.map((outraArea) => (
            <Link
              key={outraArea.slug}
              href={`/areas/${outraArea.slug}`}
              style={{
                padding: '32px',
                backgroundColor: COLORS.branco,
                borderRadius: '8px',
                border: `2px solid ${outraArea.cor}`,
                textDecoration: 'none',
                color: 'inherit',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    marginBottom: '12px',
                    color: outraArea.cor,
                  }}
                >
                  {outraArea.titulo}
                </h3>
                <p
                  style={{
                    fontSize: '14px',
                    opacity: 0.8,
                    lineHeight: 1.6,
                    color: COLORS.cinzaMedio,
                    marginBottom: '16px',
                  }}
                >
                  {outraArea.descricaoCurta}
                </p>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: outraArea.cor,
                  fontWeight: '600',
                  fontSize: '14px',
                }}
              >
                Saiba Mais <ChevronRight size={16} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ========== CONTATO ========== */}
      <ContactSection subject={area.titulo} />

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
              <li style={{ marginBottom: '8px' }}>
                <Link
                  href="/"
                  style={{
                    color: COLORS.branco,
                    textDecoration: 'none',
                    fontSize: '14px',
                    opacity: 0.8,
                  }}
                >
                  Início
                </Link>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <Link
                  href="/#areas"
                  style={{
                    color: COLORS.branco,
                    textDecoration: 'none',
                    fontSize: '14px',
                    opacity: 0.8,
                  }}
                >
                  Áreas de Atuação
                </Link>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <Link
                  href="/#contact"
                  style={{
                    color: COLORS.branco,
                    textDecoration: 'none',
                    fontSize: '14px',
                    opacity: 0.8,
                  }}
                >
                  Contato
                </Link>
              </li>
            </ul>
          </div>

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
          <p>© 2024 O Moreira Neto Advocacia. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export async function generateStaticParams() {
  return getAllAreasSlug().map((slug) => ({
    slug: slug,
  }));
}
