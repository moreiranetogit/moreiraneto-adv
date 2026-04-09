'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ChevronRight, MapPin, Phone, Mail } from 'lucide-react';

const COLORS = {
  dourado: '#E8941F',
  branco: '#FFFFFF',
  cinzaClaro: '#F5F5F5',
  cinzaEscuro: '#2D2D2D',
  cinzaMedio: '#666666',
  azulProfundo: '#1e3a5f',
  verdeAMAA: '#2D6A4F',
};

interface Noticia {
  id: string;
  titulo: string;
  slug: string;
  categoria: string;
  data_publicacao: string;
}

interface NavItem {
  label: string;
  href: string;
  externo?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Bem-vindo', href: '#home' },
  { label: 'Quem Somos', href: '#about' },
  { label: 'Áreas de Atuação', href: '#areas' },
  { label: 'Notícias e Opiniões', href: '/noticias-e-opinioes' },
  { label: 'AMAA', href: '/amaa' },
  { label: 'Fale Conosco', href: '#contact' },
];

const AREAS = [
  {
    titulo: 'Direito Agrário',
    desc: 'Assessoria completa em negócios rurais, arrendamento, parceria agrícola e financiamento.',
    icone: '🌾',
    imagem: '/area-agrario.jpg',
  },
  {
    titulo: 'Direito Civil',
    desc: 'Consultoria em contratos, sucessões, responsabilidade civil e questões patrimoniais.',
    icone: '⚖️',
    imagem: '/area-civil.jpg',
  },
  {
    titulo: 'Direito do Trabalho',
    desc: 'Defesa trabalhista, cumprimento de NR-31 e conformidade regulatória rural.',
    icone: '👷',
    imagem: '/area-trabalhista.jpg',
  },
  {
    titulo: 'Direito de Família',
    desc: 'Assistência em separações, heranças, guarda e acordos familiares.',
    icone: '👨‍👩‍👧',
    imagem: '/area-familia.jpg',
  },
  {
    titulo: 'Direito Animal',
    desc: 'Proteção animal, denúncia de maus-tratos e conformidade legal com bem-estar animal.',
    icone: '🐾',
    imagem: '/area-animal.jpg',
  },
  {
    titulo: 'Direito Geral',
    desc: 'Consultoria em diversos temas jurídicos e assessoria administrativa.',
    icone: '📋',
    imagem: '/area-geral.jpg',
  },
];

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
    <div style={{ backgroundColor: COLORS.branco, color: COLORS.cinzaEscuro }}>
      {/* HEADER */}
      <header
        style={{ backgroundColor: COLORS.cinzaEscuro, color: COLORS.branco }}
        className="sticky top-0 z-50 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: COLORS.dourado,
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '20px',
                color: COLORS.cinzaEscuro,
              }}
            >
              MNA
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold">Moreira Neto</h1>
              <p className="text-xs opacity-75">Advocacia</p>
            </div>
          </div>

          {/* Nav Desktop */}
          <nav className="hidden md:flex space-x-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm font-medium hover:bg-opacity-20 rounded transition"
                style={{
                  color: COLORS.branco,
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuAberto(!menuAberto)}
            className="md:hidden"
            style={{ color: COLORS.branco }}
          >
            {menuAberto ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuAberto && (
          <nav
            className="md:hidden px-4 pb-4 space-y-2"
            style={{ backgroundColor: COLORS.cinzaEscuro }}
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuAberto(false)}
                className="block px-3 py-2 rounded text-sm font-medium hover:bg-opacity-20 transition"
                style={{ color: COLORS.branco }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      {/* NEWS TICKER */}
      {!carregando && noticias.length > 0 && noticiaExibindo && (
        <div
          className="px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-4 overflow-x-auto"
          style={{ backgroundColor: COLORS.cinzaClaro, borderBottom: `3px solid ${COLORS.dourado}` }}
        >
          <span
            className="text-xs font-bold uppercase whitespace-nowrap"
            style={{ color: COLORS.dourado }}
          >
            📰 Última Notícia
          </span>
          <Link
            href={`/noticias-e-opinioes/artigo/${noticiaExibindo.slug}`}
            className="flex-1 text-sm truncate hover:underline transition"
            style={{ color: COLORS.azulProfundo }}
          >
            {noticiaExibindo.titulo}
          </Link>
          <ChevronRight
            size={16}
            style={{ color: COLORS.dourado, flexShrink: 0 }}
          />
        </div>
      )}

      {/* HERO */}
      <section
        id="home"
        className="relative h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: 'url(/mna-logo-araucaria-web.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          minHeight: '600px',
        }}
      >
        {/* Overlay suave */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, rgba(0,0,0,0.5) 0%, rgba(232,148,31,0.2) 100%)`,
          }}
        />

        {/* Conteúdo (texto abaixo ou ao lado da imagem) */}
        <div className="relative z-10 text-center px-4 max-w-2xl">
          <h1
            className="text-5xl sm:text-6xl font-bold mb-6 drop-shadow-lg"
            style={{ color: COLORS.branco }}
          >
            Moreira Neto Advocacia
          </h1>
          <p
            className="text-lg sm:text-xl mb-8 drop-shadow-md opacity-95"
            style={{ color: COLORS.branco }}
          >
            Estratégia jurídica profissional para agricultores, empresas e indivíduos
            em Realeza, PR
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#contact"
              className="px-8 py-3 rounded font-bold text-center transition hover:shadow-lg transform hover:scale-105"
              style={{
                backgroundColor: COLORS.dourado,
                color: COLORS.cinzaEscuro,
              }}
            >
              Agende uma Consulta
            </Link>
            <Link
              href="#areas"
              className="px-8 py-3 rounded font-bold text-center transition hover:shadow-lg transform hover:scale-105 border-2"
              style={{
                borderColor: COLORS.dourado,
                color: COLORS.branco,
                backgroundColor: 'transparent',
              }}
            >
              Conheça Nossas Áreas
            </Link>
          </div>
        </div>
      </section>

      {/* SEÇÃO BEM-VINDO / QUEM SOMOS */}
      <section
        id="about"
        className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      >
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2
              className="text-4xl font-bold mb-6"
              style={{ color: COLORS.cinzaEscuro }}
            >
              Bem-vindo à Moreira Neto
            </h2>
            <p className="text-lg mb-4 opacity-85">
              Somos um escritório de advocacia especializado em Direito Agrário, Agronegócio
              e assessoria jurídica completa. Desde nossa fundação, atendemos produtores rurais,
              cooperativas e empresas com soluções estratégicas e criativas.
            </p>
            <p className="text-lg opacity-85 mb-6">
              Nossa abordagem combina profundo conhecimento do mercado local com expertise
              jurídica de alto nível. Buscamos soluções eficientes, dentro da lei e ajustadas
              à realidade de nossos clientes.
            </p>
            <Link
              href="/noticias-e-opinioes"
              className="inline-block px-6 py-2 rounded font-bold transition hover:shadow-lg"
              style={{
                backgroundColor: COLORS.dourado,
                color: COLORS.cinzaEscuro,
              }}
            >
              Leia Notícias e Opiniões →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {DIFERENCIAIS.slice(0, 6).map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded border-l-4 bg-white"
                style={{
                  borderColor: COLORS.dourado,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              >
                <p className="text-sm font-semibold" style={{ color: COLORS.cinzaEscuro }}>
                  ✓ {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ÁREAS DE ATUAÇÃO */}
      <section
        id="areas"
        className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8"
        style={{ backgroundColor: COLORS.cinzaClaro }}
      >
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-4xl font-bold text-center mb-4"
            style={{ color: COLORS.cinzaEscuro }}
          >
            Áreas de Atuação
          </h2>
          <p className="text-center text-lg opacity-75 mb-12 max-w-2xl mx-auto">
            Expertise especializada em diversos ramos do Direito
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {AREAS.map((area, idx) => (
              <div
                key={idx}
                className="bg-white rounded overflow-hidden shadow-lg hover:shadow-xl transition transform hover:-translate-y-2"
              >
                {/* Imagem */}
                <div className="h-40 bg-gray-300 overflow-hidden relative">
                  <div
                    style={{
                      backgroundImage: `url(${area.imagem})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      width: '100%',
                      height: '100%',
                    }}
                  />
                  {/* Overlay com ícone */}
                  <div
                    className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition"
                    style={{
                      backgroundColor: 'rgba(0,0,0,0.6)',
                    }}
                  >
                    <span className="text-5xl">{area.icone}</span>
                  </div>
                </div>

                {/* Conteúdo */}
                <div className="p-6">
                  <h3
                    className="text-xl font-bold mb-3"
                    style={{ color: COLORS.cinzaEscuro }}
                  >
                    {area.titulo}
                  </h3>
                  <p className="text-sm opacity-80 mb-4">{area.desc}</p>
                  <Link
                    href="#contact"
                    className="text-sm font-bold flex items-center gap-2 transition hover:gap-3"
                    style={{ color: COLORS.dourado }}
                  >
                    Saiba Mais <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO CONTATO */}
      <section
        id="contact"
        className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      >
        <h2
          className="text-4xl font-bold text-center mb-4"
          style={{ color: COLORS.cinzaEscuro }}
        >
          Fale Conosco
        </h2>
        <p className="text-center text-lg opacity-75 mb-12">
          Entre em contato para uma consulta estratégica
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Informações */}
          <div className="space-y-8">
            <div className="flex gap-4">
              <MapPin
                size={24}
                style={{ color: COLORS.dourado, flexShrink: 0 }}
              />
              <div>
                <h3 className="font-bold mb-2">Localização</h3>
                <p className="opacity-75">
                  Realeza, Paraná — Brasil
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Phone
                size={24}
                style={{ color: COLORS.dourado, flexShrink: 0 }}
              />
              <div>
                <h3 className="font-bold mb-2">WhatsApp / Telefone</h3>
                <a
                  href="https://wa.me/5546999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-75 hover:opacity-100 transition"
                  style={{ color: COLORS.dourado }}
                >
                  (46) 99999-9999
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <Mail
                size={24}
                style={{ color: COLORS.dourado, flexShrink: 0 }}
              />
              <div>
                <h3 className="font-bold mb-2">E-mail</h3>
                <a
                  href="mailto:contato@moreiraneto.adv.br"
                  className="opacity-75 hover:opacity-100 transition"
                  style={{ color: COLORS.dourado }}
                >
                  contato@moreiraneto.adv.br
                </a>
              </div>
            </div>
          </div>

          {/* Formulário */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert('Formulário enviado! Entraremos em contato em breve.');
            }}
            className="space-y-4"
          >
            <input
              type="text"
              placeholder="Seu nome"
              required
              className="w-full px-4 py-3 border rounded focus:outline-none transition"
              style={{ borderColor: COLORS.cinzaMedio, color: COLORS.cinzaEscuro }}
            />
            <input
              type="email"
              placeholder="Seu e-mail"
              required
              className="w-full px-4 py-3 border rounded focus:outline-none transition"
              style={{ borderColor: COLORS.cinzaMedio, color: COLORS.cinzaEscuro }}
            />
            <textarea
              placeholder="Sua mensagem"
              rows={4}
              required
              className="w-full px-4 py-3 border rounded focus:outline-none transition resize-none"
              style={{ borderColor: COLORS.cinzaMedio, color: COLORS.cinzaEscuro }}
            />
            <button
              type="submit"
              className="w-full px-4 py-3 rounded font-bold transition hover:shadow-lg transform hover:scale-105"
              style={{
                backgroundColor: COLORS.dourado,
                color: COLORS.cinzaEscuro,
              }}
            >
              Enviar Mensagem
            </button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        className="py-12 px-4 sm:px-6 lg:px-8"
        style={{ backgroundColor: COLORS.cinzaEscuro, color: COLORS.branco }}
      >
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold mb-4">Moreira Neto</h3>
            <p className="text-sm opacity-75">
              Advocacia especializada em Direito Agrário e Agronegócio
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-4">Navegação</h3>
            <ul className="space-y-2 text-sm opacity-75">
              <li>
                <Link href="/" className="hover:opacity-100 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/noticias-e-opinioes" className="hover:opacity-100 transition">
                  Notícias
                </Link>
              </li>
              <li>
                <Link href="/amaa" className="hover:opacity-100 transition">
                  AMAA
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm opacity-75">
              <li>
                <Link href="#" className="hover:opacity-100 transition">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:opacity-100 transition">
                  Termos de Uso
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Redes Sociais</h3>
            <div className="flex gap-4 text-sm opacity-75">
              <a href="#" className="hover:opacity-100 transition">
                LinkedIn
              </a>
              <a href="#" className="hover:opacity-100 transition">
                Instagram
              </a>
            </div>
          </div>
        </div>

        <div
          className="border-t pt-8 text-center text-sm opacity-75"
          style={{ borderColor: COLORS.cinzaMedio }}
        >
          <p>
            © {new Date().getFullYear()} Moreira Neto Advocacia. Todos os direitos
            reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
