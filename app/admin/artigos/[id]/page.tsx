'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, Save } from 'lucide-react';
import AnalysisGenerator from './AnalysisGenerator';
import type { Article } from '@/types';

const COLORS = {
  dourado: '#E8941F',
  branco: '#FFFFFF',
  areia: '#F5E6D3',
  cinzaClaro: '#D3D3D3',
  cinzaEscuro: '#2D2D2D',
  cinzaMedio: '#666666',
  verde: '#10B981',
  vermelho: '#EF4444',
};

const FONT_FAMILY = "'Sitka Text', Georgia, 'Times New Roman', serif";

export default function ArtigoReviewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [artigo, setArtigo] = useState<Article | null>(null);
  const [analise, setAnalise] = useState('');
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  // ── Carregar artigo ──────────────────────────────────────────────────

  useEffect(() => {
    async function fetchArtigo() {
      try {
        const res = await fetch(`/api/artigos/${id}`);
        if (!res.ok) throw new Error('Artigo não encontrado');

        const data = await res.json();
        setArtigo(data);
        setAnalise(data.analise_texto || '');
      } catch (err) {
        setErro(String(err));
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchArtigo();
  }, [id]);

  // ── Salvar rascunho ──────────────────────────────────────────────────

  async function handleSalvar() {
    if (!artigo) return;

    setSalvando(true);
    try {
      const res = await fetch(`/api/artigos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          analise_texto: analise,
          analise_editada_manualmente: true,
        }),
      });

      if (!res.ok) throw new Error('Erro ao salvar');

      alert('✓ Análise salva!');
    } catch (err) {
      alert(`Erro: ${err}`);
    } finally {
      setSalvando(false);
    }
  }

  // ── Aprovar e publicar ────────────────────────────────────────────────

  async function handleAprovar() {
    if (!artigo) return;

    if (!analise.trim()) {
      alert('⚠️ Adicione uma análise antes de publicar');
      return;
    }

    setSalvando(true);
    try {
      const res = await fetch(`/api/artigos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'publicado',
          analise_texto: analise,
          analise_editada_manualmente: true,
        }),
      });

      if (!res.ok) throw new Error('Erro ao publicar');

      alert('✓ Artigo publicado com sucesso!');
      router.push('/admin/artigos');
    } catch (err) {
      alert(`Erro: ${err}`);
    } finally {
      setSalvando(false);
    }
  }

  // ── Descartar ────────────────────────────────────────────────────────

  async function handleDescartar() {
    if (!confirm('Tem certeza? Esta ação não pode ser desfeita.')) return;

    setSalvando(true);
    try {
      const res = await fetch(`/api/artigos/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Erro ao descartar');

      alert('✓ Artigo descartado');
      router.push('/admin/artigos');
    } catch (err) {
      alert(`Erro: ${err}`);
    } finally {
      setSalvando(false);
    }
  }

  // ── Renderizar ───────────────────────────────────────────────────────

  return (
    <div style={{
      backgroundColor: COLORS.areia,
      color: COLORS.cinzaEscuro,
      fontFamily: FONT_FAMILY,
      minHeight: '100vh',
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: COLORS.cinzaEscuro,
        color: COLORS.branco,
        padding: '20px',
        borderBottom: `3px solid ${COLORS.dourado}`,
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}>
          <Link href="/admin/artigos" style={{
            color: COLORS.branco,
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <ArrowLeft size={20} /> Voltar
          </Link>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>📝 Revisar Notícia</h1>
        </div>
      </header>

      {/* Conteúdo */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 20px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', opacity: 0.6 }}>
            ⏳ Carregando artigo...
          </div>
        ) : erro ? (
          <div style={{
            backgroundColor: '#FFCDD2',
            color: '#C62828',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center',
          }}>
            ❌ {erro}
          </div>
        ) : !artigo ? (
          <div style={{
            backgroundColor: '#FFF3E0',
            color: '#E65100',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center',
          }}>
            📭 Artigo não encontrado
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px' }}>
            {/* ── CONTEÚDO PRINCIPAL ── */}
            <div>
              {/* NOTÍCIA ORIGINAL */}
              <div style={{
                backgroundColor: COLORS.branco,
                borderRadius: '8px',
                padding: '24px',
                marginBottom: '24px',
                border: `1px solid ${COLORS.cinzaClaro}`,
              }}>
                <h2 style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginBottom: '16px',
                  color: COLORS.dourado,
                }}>
                  📰 Notícia Original
                </h2>

                <p style={{
                  fontSize: '12px',
                  opacity: 0.6,
                  marginBottom: '8px',
                }}>
                  Fonte: <strong>{artigo.source_name}</strong> | {new Date(artigo.published_at || '').toLocaleDateString('pt-BR')}
                </p>

                <h3 style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  marginBottom: '12px',
                  lineHeight: 1.3,
                }}>
                  {artigo.title}
                </h3>

                {artigo.excerpt && (
                  <p style={{
                    fontSize: '14px',
                    fontStyle: 'italic',
                    opacity: 0.8,
                    marginBottom: '16px',
                    paddingLeft: '12px',
                    borderLeft: `3px solid ${COLORS.dourado}`,
                  }}>
                    {artigo.excerpt}
                  </p>
                )}

                {artigo.content && (
                  <div style={{
                    fontSize: '14px',
                    lineHeight: 1.7,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    maxHeight: '400px',
                    overflowY: 'auto',
                    paddingRight: '12px',
                  }}>
                    {artigo.content}
                  </div>
                )}

                {artigo.source_url && (
                  <a
                    href={artigo.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-block',
                      marginTop: '16px',
                      color: COLORS.dourado,
                      textDecoration: 'none',
                      fontSize: '13px',
                      fontWeight: '600',
                    }}
                  >
                    🔗 Ler artigo original →
                  </a>
                )}
              </div>

              {/* ANÁLISE */}
              <div style={{
                backgroundColor: COLORS.branco,
                borderRadius: '8px',
                padding: '24px',
                marginBottom: '24px',
                border: `1px solid ${COLORS.cinzaClaro}`,
              }}>
                <h2 style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginBottom: '16px',
                  color: COLORS.dourado,
                }}>
                  ⚖️ Análise Jurídica
                </h2>

                {/* Gerador de Análise */}
                <AnalysisGenerator
                  artigo={artigo}
                  analiseExistente={artigo.analise_texto}
                />

                {/* Textarea de edição */}
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '600',
                  marginBottom: '6px',
                  opacity: 0.7,
                }}>
                  Editar Análise:
                </label>

                <textarea
                  value={analise}
                  onChange={(e) => setAnalise(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `1px solid ${COLORS.cinzaClaro}`,
                    borderRadius: '6px',
                    fontSize: '14px',
                    lineHeight: 1.6,
                    minHeight: '280px',
                    boxSizing: 'border-box',
                    fontFamily: FONT_FAMILY,
                  }}
                  placeholder="Edite ou cole a análise jurídica gerada pela skill aqui..."
                />

                <p style={{
                  fontSize: '12px',
                  opacity: 0.6,
                  marginTop: '8px',
                  marginBottom: 0,
                }}>
                  💡 Clique em "Gerar com IA" acima para copiar os dados e usar a skill de análise.
                </p>
              </div>
            </div>

            {/* ── SIDEBAR ── */}
            <div style={{ position: 'sticky', top: '20px', height: 'fit-content' }}>
              {/* Card de Status */}
              <div style={{
                backgroundColor: COLORS.branco,
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '16px',
                border: `2px solid ${COLORS.dourado}`,
              }}>
                <p style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  opacity: 0.6,
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                }}>
                  Status
                </p>
                <span style={{
                  display: 'inline-block',
                  backgroundColor: '#FFF3E0',
                  color: '#E65100',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontWeight: '600',
                }}>
                  🆕 {artigo.status === 'pending' ? 'Pendente' : artigo.status}
                </span>

                <div style={{
                  marginTop: '12px',
                  fontSize: '12px',
                  opacity: 0.7,
                  lineHeight: 1.5,
                }}>
                  <p style={{ margin: '4px 0' }}>
                    📅 {new Date(artigo.published_at || '').toLocaleDateString('pt-BR')}
                  </p>
                  <p style={{ margin: '4px 0' }}>
                    👁️ {artigo.read_count || 0} leituras
                  </p>
                </div>
              </div>

              {/* Card de Ações */}
              <div style={{
                backgroundColor: COLORS.branco,
                borderRadius: '8px',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}>
                <p style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  marginBottom: '14px',
                  textTransform: 'uppercase',
                  opacity: 0.6,
                }}>
                  Ações
                </p>

                <div style={{ display: 'grid', gap: '10px' }}>
                  <button
                    onClick={handleAprovar}
                    disabled={salvando}
                    style={{
                      backgroundColor: COLORS.verde,
                      color: COLORS.branco,
                      padding: '12px 16px',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      opacity: salvando ? 0.6 : 1,
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      if (!salvando) e.currentTarget.style.backgroundColor = '#059669'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = COLORS.verde
                    }}
                  >
                    <CheckCircle size={16} />
                    {salvando ? 'Salvando...' : 'Publicar'}
                  </button>

                  <button
                    onClick={handleSalvar}
                    disabled={salvando}
                    style={{
                      backgroundColor: COLORS.dourado,
                      color: COLORS.cinzaEscuro,
                      padding: '12px 16px',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      opacity: salvando ? 0.6 : 1,
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      if (!salvando) e.currentTarget.style.backgroundColor = '#d47a0f'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = COLORS.dourado
                    }}
                  >
                    <Save size={16} />
                    {salvando ? 'Salvando...' : 'Salvar Rascunho'}
                  </button>

                  <button
                    onClick={handleDescartar}
                    disabled={salvando}
                    style={{
                      backgroundColor: COLORS.vermelho,
                      color: COLORS.branco,
                      padding: '12px 16px',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      opacity: salvando ? 0.6 : 1,
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      if (!salvando) e.currentTarget.style.backgroundColor = '#dc2626'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = COLORS.vermelho
                    }}
                  >
                    <XCircle size={16} />
                    Descartar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
