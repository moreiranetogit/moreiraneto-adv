'use client'

import { useEffect, useState } from 'react'
import { Eye, Trash2, Check, Clock } from 'lucide-react'
import type { Denuncia, DenunciaStatus } from '@/types'

export default function DenunciasAdminPage() {
  const [denuncias, setDenuncias] = useState<Denuncia[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState<DenunciaStatus | 'todas'>('todas')
  const [selecionada, setSelecionada] = useState<Denuncia | null>(null)

  // ── Carregar denúncias ──────────────────────────────────────────────────

  useEffect(() => {
    fetchDenuncias()
  }, [])

  async function fetchDenuncias() {
    try {
      const res = await fetch('/api/admin/denuncias')
      if (res.ok) {
        const data = await res.json()
        setDenuncias(data)
      }
    } catch (err) {
      console.error('Erro ao carregar denúncias:', err)
    } finally {
      setLoading(false)
    }
  }

  // ── Atualizar status ────────────────────────────────────────────────────

  async function handleUpdateStatus(id: string, newStatus: DenunciaStatus) {
    try {
      const res = await fetch(`/api/admin/denuncias/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (res.ok) {
        await fetchDenuncias()
        setSelecionada(null)
      }
    } catch (err) {
      console.error('Erro:', err)
      alert('Erro ao atualizar')
    }
  }

  // ── Deletar denúncia ────────────────────────────────────────────────────

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que quer deletar esta denúncia?')) return

    try {
      const res = await fetch(`/api/admin/denuncias/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        await fetchDenuncias()
        setSelecionada(null)
      }
    } catch (err) {
      console.error('Erro:', err)
      alert('Erro ao deletar')
    }
  }

  // ── Renderizar ───────────────────────────────────────────────────────────

  const STATUS_CONFIG: Record<DenunciaStatus, { label: string; cor: string; icon: string }> = {
    'nova': { label: '🆕 Nova', cor: '#EF4444', icon: '●' },
    'em_apuracao': { label: '🔍 Em Apuração', cor: '#F59E0B', icon: '◐' },
    'encerrada': { label: '✓ Encerrada', cor: '#10B981', icon: '✓' },
  }

  const filtradas = filtro === 'todas'
    ? denuncias
    : denuncias.filter(d => d.status === filtro)

  const porStatus = {
    'nova': denuncias.filter(d => d.status === 'nova').length,
    'em_apuracao': denuncias.filter(d => d.status === 'em_apuracao').length,
    'encerrada': denuncias.filter(d => d.status === 'encerrada').length,
  }

  return (
    <div style={{ backgroundColor: '#F5E6D3', color: '#2D2D2D', minHeight: '100vh', padding: '32px 20px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

        {/* ── CABEÇALHO ── */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
            🚨 Denúncias de Maus-Tratos
          </h1>
          <p style={{ fontSize: '14px', opacity: 0.7 }}>
            Visualize e processe denúncias recebidas pela seção AMAA
          </p>
        </div>

        {/* ── FILTROS/ESTATÍSTICAS ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '12px',
          marginBottom: '32px',
        }}>
          <button
            onClick={() => setFiltro('todas')}
            style={{
              padding: '12px',
              borderRadius: '8px',
              border: filtro === 'todas' ? '2px solid #E8941F' : '1px solid #D3D3D3',
              background: filtro === 'todas' ? '#FFF5E6' : '#FFFFFF',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
            }}
          >
            📋 Todas ({denuncias.length})
          </button>
          {(Object.entries(porStatus) as [DenunciaStatus, number][]).map(([status, count]) => (
            <button
              key={status}
              onClick={() => setFiltro(status)}
              style={{
                padding: '12px',
                borderRadius: '8px',
                border: filtro === status ? `2px solid ${STATUS_CONFIG[status].cor}` : '1px solid #D3D3D3',
                background: filtro === status ? STATUS_CONFIG[status].cor + '10' : '#FFFFFF',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px',
                color: STATUS_CONFIG[status].cor,
              }}
            >
              {STATUS_CONFIG[status].label} ({count})
            </button>
          ))}
        </div>

        {/* ── LISTA ── */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', opacity: 0.6 }}>
            Carregando denúncias...
          </div>
        ) : filtradas.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', opacity: 0.6 }}>
            <p style={{ fontSize: '18px', marginBottom: '8px' }}>🎉 Nenhuma denúncia</p>
            <p style={{ fontSize: '14px' }}>
              {filtro === 'todas'
                ? 'Nenhuma denúncia recebida.'
                : `Nenhuma denúncia com status "${STATUS_CONFIG[filtro as DenunciaStatus].label}".`}
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {filtradas.map((den) => (
              <div
                key={den.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '8px',
                  padding: '16px',
                  border: `3px solid ${STATUS_CONFIG[den.status].cor}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onClick={() => setSelecionada(selecionada?.id === den.id ? null : den)}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{
                        display: 'inline-block',
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: STATUS_CONFIG[den.status].cor,
                      }} />
                      <span style={{ fontWeight: 'bold', fontSize: '14px' }}>
                        {den.tipo_animal} — {den.tipo_abuso.join(', ')}
                      </span>
                      <span style={{ fontSize: '12px', opacity: 0.6 }}>
                        {new Date(den.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <p style={{ fontSize: '13px', opacity: 0.7, marginBottom: '8px' }}>
                      📍 {den.endereco}, {den.bairro ? den.bairro + ', ' : ''}{den.cidade || 'Realeza'}, {den.estado}
                    </p>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: '600',
                      background: STATUS_CONFIG[den.status].cor + '20',
                      color: STATUS_CONFIG[den.status].cor,
                    }}>
                      {STATUS_CONFIG[den.status].label}
                    </span>
                  </div>

                  {/* AÇÕES RÁPIDAS */}
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        if (den.status !== 'em_apuracao') {
                          handleUpdateStatus(den.id, 'em_apuracao')
                        }
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '18px',
                        color: '#F59E0B',
                        opacity: den.status === 'em_apuracao' ? 1 : 0.5,
                      }}
                      title="Iniciar apuração"
                    >
                      <Clock size={20} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        if (den.status !== 'encerrada') {
                          handleUpdateStatus(den.id, 'encerrada')
                        }
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '18px',
                        color: '#10B981',
                        opacity: den.status === 'encerrada' ? 1 : 0.5,
                      }}
                      title="Encerrar"
                    >
                      <Check size={20} />
                    </button>
                  </div>
                </div>

                {/* ── DETALHE EXPANDIDO ── */}
                {selecionada?.id === den.id && (
                  <div style={{
                    marginTop: '16px',
                    paddingTop: '16px',
                    borderTop: '1px solid #E5E7EB',
                    fontSize: '14px',
                  }}>
                    <div style={{ display: 'grid', gap: '12px', marginBottom: '16px' }}>
                      <div>
                        <span style={{ fontWeight: '600', opacity: 0.7 }}>Descrição:</span>
                        <p style={{ marginTop: '4px' }}>{den.descricao}</p>
                      </div>

                      {den.frequencia && (
                        <div>
                          <span style={{ fontWeight: '600', opacity: 0.7 }}>Frequência:</span>
                          <p style={{ marginTop: '4px' }}>{den.frequencia}</p>
                        </div>
                      )}

                      {den.suspeito_desc && (
                        <div>
                          <span style={{ fontWeight: '600', opacity: 0.7 }}>Descrição do Suspeito:</span>
                          <p style={{ marginTop: '4px' }}>{den.suspeito_desc}</p>
                        </div>
                      )}

                      {!den.anonima && (
                        <div>
                          <span style={{ fontWeight: '600', opacity: 0.7 }}>Contato:</span>
                          <p style={{ marginTop: '4px' }}>
                            {den.contato_nome && <>
                              👤 {den.contato_nome}<br />
                            </>}
                            {den.contato_tel && <>
                              📱 {den.contato_tel}<br />
                            </>}
                            {den.contato_email && <>
                              📧 {den.contato_email}
                            </>}
                          </p>
                        </div>
                      )}

                      {den.anonima && (
                        <div>
                          <span style={{ color: '#9CA3AF', fontSize: '12px', fontWeight: '600' }}>
                            🔒 Denúncia anônima
                          </span>
                        </div>
                      )}

                      {den.obs_interna && (
                        <div style={{ background: '#FEF3C7', padding: '8px', borderRadius: '4px' }}>
                          <span style={{ fontWeight: '600', opacity: 0.7 }}>Notas internas:</span>
                          <p style={{ marginTop: '4px' }}>{den.obs_interna}</p>
                        </div>
                      )}
                    </div>

                    {/* ── AÇÕES ── */}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          const obs = prompt('Adicionar nota interna:')
                          if (obs) {
                            // TODO: Atualizar com nota
                          }
                        }}
                        style={{
                          flex: 1,
                          padding: '8px',
                          background: '#E5E7EB',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '600',
                        }}
                      >
                        📝 Adicionar nota
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(den.id)
                        }}
                        style={{
                          padding: '8px 12px',
                          background: '#FEE2E2',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          color: '#EF4444',
                          fontWeight: '600',
                          fontSize: '12px',
                        }}
                      >
                        <Trash2 size={16} style={{ display: 'inline' }} /> Deletar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
