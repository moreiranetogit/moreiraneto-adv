'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, Edit2, Eye, EyeOff } from 'lucide-react'
import type { RSSSource } from '@/types'

export default function FontesAdminPage() {
  const [fontes, setFontes] = useState<RSSSource[]>([])
  const [loading, setLoading] = useState(true)
  const [editando, setEditando] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState({
    nome: '',
    url: '',
    tipo: 'rss' as 'rss' | 'web',
    categoria: 'direito-geral',
    ativo: true,
  })

  // ── Carregar fontes ──────────────────────────────────────────────────────

  useEffect(() => {
    fetchFontes()
  }, [])

  async function fetchFontes() {
    try {
      const res = await fetch('/api/rss/fontes')
      if (res.ok) {
        const data = await res.json()
        setFontes(data)
      }
    } catch (err) {
      console.error('Erro ao carregar fontes:', err)
    } finally {
      setLoading(false)
    }
  }

  // ── Criar/Atualizar fonte ────────────────────────────────────────────────

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!form.nome.trim() || !form.url.trim()) {
      alert('Preencha todos os campos obrigatórios')
      return
    }

    try {
      const method = editId ? 'PATCH' : 'POST'
      const endpoint = editId ? `/api/rss/fontes/${editId}` : '/api/rss/fontes'

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        setForm({ nome: '', url: '', tipo: 'rss', categoria: 'direito-geral', ativo: true })
        setEditId(null)
        setEditando(false)
        await fetchFontes()
      } else {
        alert('Erro ao salvar fonte')
      }
    } catch (err) {
      console.error('Erro:', err)
      alert('Erro ao salvar fonte')
    }
  }

  // ── Editar ───────────────────────────────────────────────────────────────

  function handleEdit(fonte: RSSSource) {
    setForm({
      nome: fonte.nome,
      url: fonte.url,
      tipo: fonte.tipo as 'rss' | 'web',
      categoria: fonte.categoria_id ? 'direito-' + fonte.categoria_id : 'direito-geral',
      ativo: fonte.ativo,
    })
    setEditId(fonte.id)
    setEditando(true)
  }

  // ── Deletar ──────────────────────────────────────────────────────────────

  async function handleDelete(id: number) {
    if (!confirm('Tem certeza que quer deletar esta fonte?')) return

    try {
      const res = await fetch(`/api/rss/fontes/${id}`, { method: 'DELETE' })
      if (res.ok) {
        await fetchFontes()
      }
    } catch (err) {
      console.error('Erro:', err)
      alert('Erro ao deletar')
    }
  }

  // ── Toggle ativo/inativo ─────────────────────────────────────────────────

  async function handleToggle(fonte: RSSSource) {
    try {
      const res = await fetch(`/api/rss/fontes/${fonte.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ativo: !fonte.ativo }),
      })

      if (res.ok) {
        await fetchFontes()
      }
    } catch (err) {
      console.error('Erro:', err)
    }
  }

  // ── Renderizar ───────────────────────────────────────────────────────────

  const CATEGORIAS: Record<string, string> = {
    'direito-agrario': 'Direito Agrário',
    'direito-civil': 'Direito Civil',
    'direito-trabalhista': 'Direito Trabalhista',
    'direito-familia': 'Direito de Família',
    'direito-animal': 'Direito Animal',
    'direito-geral': 'Direito Geral',
  }

  return (
    <div style={{ backgroundColor: '#F5E6D3', color: '#2D2D2D', minHeight: '100vh', padding: '32px 20px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

        {/* ── CABEÇALHO ── */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
            📡 Gerenciar Fontes RSS
          </h1>
          <p style={{ fontSize: '14px', opacity: 0.7 }}>
            Configure quais portais jurídicos monitorar para novas notícias
          </p>
        </div>

        {/* ── BOTÃO ADICIONAR ── */}
        <button
          onClick={() => {
            setEditando(true)
            setEditId(null)
            setForm({ nome: '', url: '', tipo: 'rss', categoria: 'direito-geral', ativo: true })
          }}
          style={{
            backgroundColor: '#E8941F',
            color: '#2D2D2D',
            padding: '10px 16px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '600',
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Plus size={18} /> Adicionar Fonte
        </button>

        {/* ── FORMULÁRIO ── */}
        {editando && (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              padding: '24px',
              marginBottom: '32px',
              border: '2px solid #E8941F',
            }}
          >
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
              {editId ? 'Editar Fonte' : 'Adicionar Nova Fonte'}
            </h2>
            <form onSubmit={handleSave} style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '600' }}>
                  Nome da Fonte *
                </label>
                <input
                  type="text"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  placeholder="Ex: STJ, Conjur, Migalhas"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #D3D3D3',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '600' }}>
                  URL RSS/Website *
                </label>
                <input
                  type="url"
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  placeholder="https://www.stj.jus.br/rss/..."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #D3D3D3',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '600' }}>
                    Tipo
                  </label>
                  <select
                    value={form.tipo}
                    onChange={(e) => setForm({ ...form, tipo: e.target.value as 'rss' | 'web' })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #D3D3D3',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="rss">RSS Feed</option>
                    <option value="web">Web Scraping</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '600' }}>
                    Categoria
                  </label>
                  <select
                    value={form.categoria}
                    onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #D3D3D3',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                    }}
                  >
                    {Object.entries(CATEGORIAS).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={form.ativo}
                  onChange={(e) => setForm({ ...form, ativo: e.target.checked })}
                  style={{ cursor: 'pointer' }}
                />
                <span>Ativo (monitorar esta fonte)</span>
              </label>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#10B981',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  {editId ? 'Atualizar' : 'Adicionar'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditando(false)
                    setEditId(null)
                    setForm({ nome: '', url: '', tipo: 'rss', categoria: 'direito-geral', ativo: true })
                  }}
                  style={{
                    backgroundColor: '#D3D3D3',
                    color: '#2D2D2D',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── LISTA DE FONTES ── */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', opacity: 0.6 }}>
            Carregando fontes...
          </div>
        ) : fontes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', opacity: 0.6 }}>
            Nenhuma fonte adicionada. Comece a monitorar portais jurídicos!
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {fontes.map((fonte) => (
              <div
                key={fonte.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '8px',
                  padding: '16px',
                  border: `1px solid ${fonte.ativo ? '#E8941F' : '#D3D3D3'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontWeight: 'bold', marginBottom: '4px', fontSize: '16px' }}>
                    {fonte.nome}
                  </h3>
                  <p style={{ fontSize: '12px', opacity: 0.7, marginBottom: '4px', wordBreak: 'break-all' }}>
                    {fonte.url}
                  </p>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '12px', opacity: 0.6 }}>
                    <span>
                      {fonte.tipo === 'rss' ? '📡 RSS' : '🕷️ Web Scraping'}
                    </span>
                    <span>{CATEGORIAS[fonte.categoria_id ? 'direito-' + fonte.categoria_id : 'direito-geral']}</span>
                    {fonte.ultima_busca && (
                      <span>
                        🕐 Última busca: {new Date(fonte.ultima_busca).toLocaleDateString('pt-BR', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    )}
                  </div>
                </div>

                {/* ── AÇÕES ── */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleToggle(fonte)}
                    title={fonte.ativo ? 'Desativar' : 'Ativar'}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '8px',
                      fontSize: '18px',
                      color: fonte.ativo ? '#10B981' : '#D3D3D3',
                    }}
                  >
                    {fonte.ativo ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                  <button
                    onClick={() => handleEdit(fonte)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '8px',
                      fontSize: '18px',
                      color: '#E8941F',
                    }}
                  >
                    <Edit2 size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(fonte.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '8px',
                      fontSize: '18px',
                      color: '#EF4444',
                    }}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
