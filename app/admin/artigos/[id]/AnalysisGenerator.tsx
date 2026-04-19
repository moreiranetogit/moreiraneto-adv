'use client'

import { useState } from 'react'
import { Sparkles, Loader, Copy, Check } from 'lucide-react'
import type { Article } from '@/types'

interface AnalysisGeneratorProps {
  artigo: Article
  analiseExistente?: string | null
  onAnaliseGerada?: (analise: string) => void
}

export default function AnalysisGenerator({
  artigo,
  analiseExistente,
  onAnaliseGerada,
}: AnalysisGeneratorProps) {
  const [gerando, setGerando] = useState(false)
  const [copiado, setCopiado] = useState(false)

  // Preparar contexto para a skill
  const contextoArtigo = `
### Artigo para Análise Jurídica

**Título:** ${artigo.title}

**Categoria:** ${artigo.category}

**Fonte:** ${artigo.source_name}

**URL Original:** ${artigo.source_url}

**Resumo:** ${artigo.excerpt}

**Conteúdo:**
${artigo.content}

---

**Instruções:**
1. Analise este artigo jurídico com profundidade
2. Identifique os temas principais e implicações legais
3. Relacione com jurisprudência do STJ, STF e TCU quando aplicável
4. Foque em Direito Agrário, Agronegócio e Civil
5. Considere o público: sudoeste paranaense (rural + agronegócio)
6. Gere uma análise clara, prática e acionável para leitura jurídica
7. Use tom profissional e acessível
`

  function copiarContexto() {
    navigator.clipboard.writeText(contextoArtigo)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  async function gerarAnalise() {
    setGerando(true)
    try {
      // Chamar a skill de análise jurídica
      // Esta função será executada no contexto do Cowork
      // Por enquanto, mostramos instruções ao usuário

      alert(`
📋 Contexto copiado!

Siga os passos:
1. Clique em "Usar IA para Análise" novamente
2. Cole o contexto em uma nova conversa com a skill
3. A análise gerada será colada aqui automaticamente

Para uma integração mais automática, você pode:
- Usar a skill /legal-moreira:analise-juridica diretamente
- Copiar os dados do artigo para o contexto
- Retornar com a análise finalizada
      `)
    } catch (err) {
      console.error('Erro:', err)
      alert('Erro ao gerar análise')
    } finally {
      setGerando(false)
    }
  }

  // Se já tem análise, mostra resumo
  if (analiseExistente) {
    return (
      <div
        style={{
          backgroundColor: '#E8F5E9',
          borderLeft: '4px solid #4CAF50',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Sparkles size={20} color="#4CAF50" />
          <span style={{ fontWeight: 'bold', color: '#2E7D32' }}>✓ Análise Gerada</span>
        </div>
        <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#1B5E20', margin: 0 }}>
          {analiseExistente.slice(0, 300)}
          {analiseExistente.length > 300 && '...'}
        </p>
        <p style={{ fontSize: '11px', color: '#558B2F', marginTop: '8px', marginBottom: 0 }}>
          Edite o campo de análise abaixo se desejar
        </p>
      </div>
    )
  }

  // Se não tem análise, oferece gerar
  return (
    <div
      style={{
        backgroundColor: '#FFF3E0',
        border: '2px dashed #FF9800',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <Sparkles size={20} color="#E65100" />
        <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#E65100' }}>
          Gerar Análise Jurídica Automática
        </span>
      </div>

      <p style={{ fontSize: '13px', color: '#BF360C', marginBottom: '12px', lineHeight: '1.5' }}>
        Use a skill <strong>/legal-moreira:analise-juridica</strong> para gerar uma análise profunda deste artigo.
        O contexto será copiado automaticamente.
      </p>

      <div
        style={{
          backgroundColor: '#FFECB3',
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '12px',
          fontSize: '12px',
          color: '#F57F17',
          fontFamily: 'monospace',
        }}
      >
        <strong>Dados disponíveis para análise:</strong>
        <ul style={{ margin: '6px 0 0 16px', padding: 0 }}>
          <li>📰 Título: {artigo.title}</li>
          <li>📂 Categoria: {artigo.category}</li>
          <li>🔗 Fonte: {artigo.source_name}</li>
          <li>📄 Conteúdo: {artigo.content?.length || 0} caracteres</li>
        </ul>
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button
          onClick={copiarContexto}
          disabled={gerando}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#FF9800',
            color: '#FFFFFF',
            border: 'none',
            padding: '10px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '13px',
            opacity: gerando ? 0.6 : 1,
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            if (!gerando) e.currentTarget.style.backgroundColor = '#F57C00'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#FF9800'
          }}
        >
          {copiado ? (
            <>
              <Check size={16} /> Contexto Copiado!
            </>
          ) : (
            <>
              <Copy size={16} /> Copiar Contexto
            </>
          )}
        </button>

        <button
          onClick={gerarAnalise}
          disabled={gerando}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#E65100',
            color: '#FFFFFF',
            border: 'none',
            padding: '10px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '13px',
            opacity: gerando ? 0.6 : 1,
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            if (!gerando) e.currentTarget.style.backgroundColor = '#BF360C'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#E65100'
          }}
        >
          {gerando ? (
            <>
              <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Gerando...
            </>
          ) : (
            <>
              <Sparkles size={16} /> Gerar com IA
            </>
          )}
        </button>
      </div>

      <p style={{ fontSize: '11px', color: '#BF360C', marginTop: '12px', marginBottom: 0 }}>
        💡 Dica: Cole o contexto copiado em uma nova conversa e use a skill para gerar a análise.
        Depois, cole o resultado no campo de análise abaixo.
      </p>
    </div>
  )
}
