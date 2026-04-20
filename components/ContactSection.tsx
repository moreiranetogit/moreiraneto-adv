'use client';

import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

const COLORS = {
  dourado: '#E8941F',
  branco: '#FFFFFF',
  cinzaEscuro: '#2D2D2D',
  cinzaMedio: '#666666',
};

const FONT_SERIF = 'var(--font-serif)';
const WHATSAPP_NUMBER = '5546999779865'; // Número real do escritório
const EMAIL = 'contato@moreiraneto.adv.br';

interface ContactSectionProps {
  subject?: string; // Assunto opcional para WhatsApp
}

export default function ContactSection({ subject }: ContactSectionProps) {
  const whatsappMessage = subject
    ? `Olá! Gostaria de esclarecer dúvidas sobre ${subject}.`
    : 'Olá! Gostaria de esclarecer dúvidas sobre os serviços do Moreira Neto Advocacia.';

  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;
  const mapsLink = 'https://maps.app.goo.gl/XZj8Rt4UUsKg2d3M6'; // Link direto para o escritório no Google Maps
  // Google Maps Embed API - usando coordenadas de Realeza, PR
  const mapsEmbed = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3619.821!2d-53.9645!3d-26.0797!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94f78a1b1bcc1b1b%3A0x1b1b1b1b1b1b1b1b!2sRua%20Belém%2C%202963%2C%20Realeza%2C%20State%20of%20Paraná%2C%20Brazil!5e0!3m2!1sen!2sus!4v1712000000000';

  return (
    <section
      id="contact"
      style={{
        backgroundColor: COLORS.cinzaEscuro,
        color: COLORS.branco,
        padding: '4rem 1rem',
        fontFamily: FONT_SERIF,
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Título */}
        <h2 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          marginBottom: '3rem',
          textAlign: 'center',
          color: COLORS.dourado,
        }}>
          Contato
        </h2>

        {/* Grid: Minimapa + Informações */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem',
          alignItems: 'start',
        }}>
          {/* Minimapa Google Maps */}
          <div style={{
            borderRadius: '0.5rem',
            overflow: 'hidden',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
            minHeight: '300px',
          }}>
            <iframe
              width="100%"
              height="300"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen=""
              referrerPolicy="no-referrer-when-downgrade"
              src={mapsEmbed}
              title="Localização do Moreira Neto Advocacia"
            />
          </div>

          {/* Informações de Contato */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
          }}>
            {/* Endereço */}
            <div>
              <h3 style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '1.25rem',
                fontWeight: '600',
                marginBottom: '0.5rem',
                color: COLORS.dourado,
              }}>
                <MapPin size={24} />
                Endereço
              </h3>
              <a
                href={mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: COLORS.branco,
                  textDecoration: 'none',
                  fontSize: '1rem',
                  lineHeight: '1.6',
                  transition: 'color 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.dourado)}
                onMouseLeave={(e) => (e.currentTarget.style.color = COLORS.branco)}
              >
                Rua Belém, nº 2963, sala 22<br />
                Centro — Realeza, PR
              </a>
            </div>

            {/* Telefone/WhatsApp */}
            <div>
              <h3 style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '1.25rem',
                fontWeight: '600',
                marginBottom: '0.5rem',
                color: COLORS.dourado,
              }}>
                <MessageCircle size={24} />
                WhatsApp
              </h3>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: COLORS.branco,
                  textDecoration: 'none',
                  fontSize: '1rem',
                  transition: 'color 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.dourado)}
                onMouseLeave={(e) => (e.currentTarget.style.color = COLORS.branco)}
              >
                (46) 99977-9865
              </a>
            </div>

            {/* Email */}
            <div>
              <h3 style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '1.25rem',
                fontWeight: '600',
                marginBottom: '0.5rem',
                color: COLORS.dourado,
              }}>
                <Mail size={24} />
                E-mail
              </h3>
              <a
                href={`mailto:${EMAIL}`}
                style={{
                  color: COLORS.branco,
                  textDecoration: 'none',
                  fontSize: '1rem',
                  transition: 'color 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.dourado)}
                onMouseLeave={(e) => (e.currentTarget.style.color = COLORS.branco)}
              >
                {EMAIL}
              </a>
            </div>
          </div>
        </div>

        {/* CTA: Botões de Ação */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          justifyContent: 'center',
          marginTop: '2rem',
          paddingTop: '2rem',
          borderTop: `1px solid ${COLORS.cinzaMedio}`,
        }}>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#25D366',
              color: COLORS.branco,
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'background-color 0.3s ease, transform 0.2s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1fa857';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#25D366';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <MessageCircle size={20} />
            WhatsApp
          </a>

          <a
            href={`mailto:${EMAIL}${subject ? `?subject=Dúvidas sobre ${subject}` : ''}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: COLORS.dourado,
              color: COLORS.cinzaEscuro,
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'background-color 0.3s ease, transform 0.2s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#d47a0f';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = COLORS.dourado;
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <Mail size={20} />
            E-mail
          </a>

          <a
            href={mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'transparent',
              color: COLORS.dourado,
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              border: `2px solid ${COLORS.dourado}`,
              textDecoration: 'none',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = COLORS.dourado;
              e.currentTarget.style.color = COLORS.cinzaEscuro;
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = COLORS.dourado;
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <MapPin size={20} />
            Ver no Mapa
          </a>
        </div>
      </div>
    </section>
  );
}
