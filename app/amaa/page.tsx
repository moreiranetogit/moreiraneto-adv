// ═══════════════════════════════════════════════════════════════════════════
// AMAA — Seção Pública: Adoção + Denúncia de Maus-Tratos (REDESENHO)
// Style: Premium + Professional + Branco & Azul AMAA
// ═══════════════════════════════════════════════════════════════════════════

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, ChevronRight } from 'lucide-react'

const COLORS = {
  azulAMAA: '#2D6A4F',      // Verde/Azul da AMAA (primário)
  azulEscuro: '#1B3A2E',    // Mais escuro para navbar
  branco: '#FFFFFF',
  cinzaClaro: '#F8F9FA',
  cinzaMedio: '#666666',
  cinzaEscuro: '#2C2C2C',
  vermelho: '#DC2626',
  verde: '#16A34A',
}

const FONT_SERIF = 'var(--font-serif)'

export default function AmaaPage() {
  const [menuAberto, setMenuAberto] = useState(false)
  const [abaAtiva, setAbaAtiva] = useState<'adocao' | 'denuncia'>('adocao')

  return (
    <div
      style={{
        backgroundColor: COLORS.cinzaClaro,
        color: COLORS.cinzaEscuro,
        fontFamily: FONT_SERIF,
      }}
    >
      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* HEADER PREMIUM */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <header
        style={{
          backgroundColor: COLORS.azulEscuro,
          borderBottom: `3px solid ${COLORS.azulAMAA}`,
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.15)',
        }}
        className="sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div
                style={{ backgroundColor: COLORS.branco }}
                className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg"
              >
                🐾
              </div>
              <div className="hidden sm:block">
                <p style={{ color: COLORS.branco }} className="font-bold text-sm">
                  AMAA
                </p>
                <p style={{ color: COLORS.azulAMAA }} className="text-xs leading-none">
                  Melhores Amigos
                </p>
              </div>
            </div>

            {/* Menu Desktop */}
            <nav className="hidden md:flex items-center gap-8">
              <a
                href="#adocao"
                style={{ color: COLORS.branco }}
                className="text-sm font-medium hover:text-gray-200 transition"
              >
                Adoção
              </a>
              <a
                href="#denuncia"
                style={{ color: COLORS.branco }}
                className="text-sm font-medium hover:text-gray-200 transition"
              >
                Denúncia
              </a>
              <Link
                href="/"
                style={{ color: COLORS.branco }}
                className="text-sm font-medium hover:text-gray-200 transition"
              >
                ← MNA
              </Link>
            </nav>

            {/* Menu Mobile */}
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
            <div style={{ borderTop: `1px solid ${COLORS.azulAMAA}` }} className="md:hidden py-4 space-y-3">
              <a
                href="#adocao"
                style={{ color: COLORS.azulAMAA }}
                className="block text-sm font-medium"
              >
                🐾 Adoção
              </a>
              <a
                href="#denuncia"
                style={{ color: COLORS.vermelho }}
                className="block text-sm font-medium"
              >
                🚨 Denúncia
              </a>
              <Link href="/" className="block text-sm font-medium" style={{ color: COLORS.cinzaMedio }}>
                ← Voltar ao MNA
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* HERO SECTION */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <section
        style={{
          background: `linear-gradient(135deg, ${COLORS.azulEscuro} 0%, ${COLORS.azulAMAA} 100%)`,
          minHeight: '400px',
        }}
        className="flex items-center justify-center py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <img
              src="/amaa-logo-web.png"
              alt="Logo AMAA"
              className="h-24 mx-auto mb-6 drop-shadow-lg"
            />
          </div>
          <h1 style={{ color: COLORS.branco }} className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Associação Melhores Amigos dos Animais
          </h1>
          <p
            style={{ color: '#E8F5E9' }}
            className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Resgate, cuidado, adoção responsável e proteção legal dos animais de Realeza e região.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#adocao"
              style={{
                backgroundColor: COLORS.branco,
                color: COLORS.azulAMAA,
              }}
              className="inline-flex items-center justify-center font-bold px-8 py-3 rounded-lg hover:shadow-lg transition text-lg"
            >
              🐾 Animais para Adoção
              <ChevronRight size={20} className="ml-2" />
            </a>
            <a
              href="#denuncia"
              style={{
                backgroundColor: COLORS.vermelho,
                color: COLORS.branco,
              }}
              className="inline-flex items-center justify-center font-bold px-8 py-3 rounded-lg hover:shadow-lg transition text-lg"
            >
              🚨 Denunciar Maus-Tratos
              <ChevronRight size={20} className="ml-2" />
            </a>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* TABS SECTION */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tab Buttons */}
        <div className="flex gap-4 mb-12 border-b" style={{ borderColor: COLORS.cinzaMedio }}>
          <button
            onClick={() => setAbaAtiva('adocao')}
            style={{
              borderBottom: abaAtiva === 'adocao' ? `3px solid ${COLORS.azulAMAA}` : 'none',
              color: abaAtiva === 'adocao' ? COLORS.azulAMAA : COLORS.cinzaMedio,
            }}
            className="px-6 py-3 font-bold text-lg transition"
          >
            🐾 Adoção de Animais
          </button>
          <button
            onClick={() => setAbaAtiva('denuncia')}
            style={{
              borderBottom: abaAtiva === 'denuncia' ? `3px solid ${COLORS.vermelho}` : 'none',
              color: abaAtiva === 'denuncia' ? COLORS.vermelho : COLORS.cinzaMedio,
            }}
            className="px-6 py-3 font-bold text-lg transition"
          >
            🚨 Denúncia de Maus-Tratos
          </button>
        </div>

        {/* ────────────────────────────────────────────────────────────────── */}
        {/* ABA 1: ADOÇÃO */}
        {/* ────────────────────────────────────────────────────────────────── */}
        {abaAtiva === 'adocao' && (
          <div id="adocao" className="space-y-12">
            {/* Header */}
            <div className="text-center mb-12">
              <h2 style={{ color: COLORS.azulAMAA }} className="text-3xl font-bold mb-4">
                Encontre seu novo melhor amigo
              </h2>
              <p style={{ color: COLORS.cinzaMedio }} className="text-lg max-w-2xl mx-auto">
                Todos os nossos animais são resgatados, castrados, vacinados e cuidados com muito amor.
                <br />
                <strong>Adote com responsabilidade — é para toda a vida!</strong>
              </p>
            </div>

            {/* Grid de Animais */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[
                { nome: 'Rex', tipo: '🐶 Cachorro', sexo: '♂ Macho', desc: 'Dócil e carinhoso' },
                { nome: 'Miau', tipo: '🐱 Gato', sexo: '♀ Fêmea', desc: 'Brincalhona e dócil' },
                { nome: 'Luna', tipo: '🐱 Gato', sexo: '♀ Fêmea', desc: 'Tranquila e dócil' },
                { nome: 'Max', tipo: '🐶 Cachorro', sexo: '♂ Macho', desc: 'Energético e feliz' },
              ].map((animal) => (
                <div
                  key={animal.nome}
                  style={{ borderColor: COLORS.cinzaMedio }}
                  className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition"
                >
                  <div
                    style={{ backgroundColor: COLORS.cinzaClaro }}
                    className="aspect-square flex items-center justify-center text-6xl"
                  >
                    {animal.tipo.split(' ')[0]}
                  </div>
                  <div className="p-5">
                    <h3 style={{ color: COLORS.azulAMAA }} className="font-bold text-lg mb-2">
                      {animal.nome}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {animal.tipo} • {animal.sexo}
                    </p>
                    <p className="text-sm text-gray-700 mb-4">{animal.desc}</p>

                    {/* Health badges */}
                    <div className="flex gap-2 mb-4 flex-wrap">
                      <span style={{ backgroundColor: `${COLORS.verde}20`, color: COLORS.verde }} className="text-xs font-semibold px-2 py-1 rounded">
                        ✓ Vacinado
                      </span>
                      <span style={{ backgroundColor: `${COLORS.azulAMAA}20`, color: COLORS.azulAMAA }} className="text-xs font-semibold px-2 py-1 rounded">
                        ✓ Castrado
                      </span>
                    </div>

                    {/* CTA Button */}
                    <button
                      style={{
                        backgroundColor: COLORS.azulAMAA,
                        color: COLORS.branco,
                      }}
                      className="w-full py-2.5 font-bold rounded-lg hover:opacity-90 transition text-sm"
                    >
                      💚 Quero adotar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Como funciona */}
            <div
              style={{
                backgroundColor: COLORS.branco,
                borderLeft: `5px solid ${COLORS.azulAMAA}`,
              }}
              className="rounded-lg p-8 shadow-sm"
            >
              <h3 style={{ color: COLORS.azulAMAA }} className="text-2xl font-bold mb-8 text-center">
                Como funciona a adoção?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                {[
                  { num: 1, icon: '💚', titulo: 'Escolha', desc: 'Conheça nossos animais' },
                  { num: 2, icon: '📲', titulo: 'Contato', desc: 'Fale pelo WhatsApp' },
                  { num: 3, icon: '🤝', titulo: 'Entrevista', desc: 'Garantimos o lar ideal' },
                  { num: 4, icon: '🏠', titulo: 'Adoção', desc: 'Bem-vindo ao lar!' },
                ].map((step) => (
                  <div key={step.num} className="text-center">
                    <div
                      style={{ backgroundColor: COLORS.azulAMAA, color: COLORS.branco }}
                      className="w-12 h-12 rounded-full flex items-center justify-center font-bold mx-auto mb-3 text-lg"
                    >
                      {step.num}
                    </div>
                    <p className="text-2xl mb-2">{step.icon}</p>
                    <h4 style={{ color: COLORS.azulAMAA }} className="font-bold mb-1">
                      {step.titulo}
                    </h4>
                    <p className="text-sm text-gray-600">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ────────────────────────────────────────────────────────────────── */}
        {/* ABA 2: DENÚNCIA */}
        {/* ────────────────────────────────────────────────────────────────── */}
        {abaAtiva === 'denuncia' && (
          <div id="denuncia" className="space-y-8">
            {/* Header */}
            <div className="text-center mb-12">
              <h2 style={{ color: COLORS.vermelho }} className="text-3xl font-bold mb-4">
                Denuncie Maus-Tratos
              </h2>
              <p style={{ color: COLORS.cinzaMedio }} className="text-lg max-w-2xl mx-auto">
                Viu um animal sofrendo? Denuncie! Todas as denúncias são encaminhadas à AMAA e, quando necessário,
                <br />
                <strong>às autoridades competentes. Você pode fazer a denúncia anonimamente.</strong>
              </p>
            </div>

            {/* Lei Box */}
            <div
              style={{
                backgroundColor: COLORS.branco,
                borderLeft: `5px solid ${COLORS.vermelho}`,
                borderRadius: '8px',
              }}
              className="p-6 shadow-sm"
            >
              <p style={{ color: COLORS.vermelho }} className="font-bold text-sm mb-2">
                ⚖️ Lei Sansão (Lei nº 14.064/2020)
              </p>
              <p style={{ color: COLORS.cinzaEscuro }} className="text-base leading-relaxed">
                Maus-tratos a cães e gatos resultam em <strong>reclusão de 2 a 5 anos</strong> + multa.
                <br />
                Sua denúncia faz diferença — e pode salvar uma vida.
              </p>
            </div>

            {/* Formulário */}
            <div
              style={{ backgroundColor: COLORS.branco }}
              className="rounded-lg p-8 shadow-sm"
            >
              <h3 style={{ color: COLORS.cinzaEscuro }} className="text-2xl font-bold mb-6">
                Preencha o formulário
              </h3>

              <form className="space-y-6">
                {/* Localização */}
                <div>
                  <label style={{ color: COLORS.cinzaEscuro }} className="block font-bold mb-3 text-sm">
                    Onde o abuso acontece?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="Rua/Avenida"
                      style={{ borderColor: COLORS.cinzaMedio }}
                      className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <input
                      type="text"
                      placeholder="Bairro"
                      style={{ borderColor: COLORS.cinzaMedio }}
                      className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <input
                      type="text"
                      placeholder="Cidade"
                      style={{ borderColor: COLORS.cinzaMedio }}
                      className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                {/* Tipo de Animal */}
                <div>
                  <label style={{ color: COLORS.cinzaEscuro }} className="block font-bold mb-3 text-sm">
                    Tipo de animal
                  </label>
                  <select
                    style={{ borderColor: COLORS.cinzaMedio }}
                    className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option>Selecione...</option>
                    <option>🐶 Cachorro</option>
                    <option>🐱 Gato</option>
                    <option>🐦 Passarinho</option>
                    <option>Outro</option>
                  </select>
                </div>

                {/* Tipo de Abuso */}
                <div>
                  <label style={{ color: COLORS.cinzaEscuro }} className="block font-bold mb-3 text-sm">
                    Tipo de abuso (selecione todos que se aplicam)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {['Espancamento', 'Negligência', 'Falta de comida/água', 'Confinamento', 'Outro'].map((tipo) => (
                      <label key={tipo} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded" />
                        <span className="text-sm">{tipo}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Descrição */}
                <div>
                  <label style={{ color: COLORS.cinzaEscuro }} className="block font-bold mb-3 text-sm">
                    Descreva o ocorrido *
                  </label>
                  <textarea
                    placeholder="Máximo detalhe possível..."
                    rows={4}
                    style={{ borderColor: COLORS.cinzaMedio }}
                    className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                {/* Dados do denunciante */}
                <div>
                  <label className="flex items-center gap-2 mb-4 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded" defaultChecked />
                    <span className="text-sm font-medium">Quero fazer denúncia anônima</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="Seu nome"
                      style={{ borderColor: COLORS.cinzaMedio }}
                      className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <input
                      type="tel"
                      placeholder="(46) 99999-9999"
                      style={{ borderColor: COLORS.cinzaMedio }}
                      className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <input
                      type="email"
                      placeholder="seu@email.com"
                      style={{ borderColor: COLORS.cinzaMedio }}
                      className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  style={{
                    backgroundColor: COLORS.vermelho,
                    color: COLORS.branco,
                  }}
                  className="w-full font-bold py-3.5 rounded-lg hover:opacity-90 transition text-base"
                >
                  🚨 Enviar Denúncia
                </button>
              </form>
            </div>
          </div>
        )}
      </section>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* FOOTER */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <footer
        style={{
          backgroundColor: COLORS.cinzaEscuro,
          borderTop: `3px solid ${COLORS.azulAMAA}`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div
                style={{ backgroundColor: COLORS.azulAMAA }}
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
              >
                🐾
              </div>
              <div>
                <p style={{ color: COLORS.branco }} className="font-bold">
                  AMAA — Melhores Amigos dos Animais
                </p>
                <p style={{ color: COLORS.cinzaMedio }} className="text-sm">
                  Realeza/PR · Apoio jurídico: Moreira Neto Advocacia
                </p>
              </div>
            </div>
            <div className="text-center sm:text-right">
              <Link href="/" style={{ color: COLORS.azulAMAA }} className="text-sm font-medium hover:opacity-75 transition">
                moreiraneto.adv.br
              </Link>
              <p style={{ color: COLORS.cinzaMedio }} className="text-xs mt-1">
                Material educativo — reprodução livre
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
