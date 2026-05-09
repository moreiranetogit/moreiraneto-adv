'use client'

import { useEffect, useState } from 'react'
import { Heart, Trash2, Check, Clock, Phone, User, Dog } from 'lucide-react'

interface Interesse {
  id: string
  animal_id: string
  animal_nome: string
  nome: string
  cpf: string
  telefone?: string
  ip_address?: string
  status: 'pendente' | 'em_contato' | 'concluido' | 'descartado'
  mensagem_enviada: boolean
  created_at: string
}

type Filtro = 'todos' | Interesse['status']

const STATUS_LABEL: Record<Interesse['status'], string> = {
  pendente:    '🕐 Pendente',
  em_contato:  '📞 Em contato',
  concluido:   '✅ Concluído',
  descartado:  '❌ Descartado',
}

const STATUS_COLORS: Record<Interesse['status'], { bg: string; text: string }> = {
  pendente:   { bg: '#FFF7ED', text: '#C2410C' },
  em_contato: { bg: '#EFF6FF', text: '#1D4ED8' },
  concluido:  { bg: '#F0FDF4', text: '#15803D' },
  descartado: { bg: '#F9FAFB', text: '#6B7280' },
}

export default function InteressesAdocaoPage() {
  const [interesses, setInteresses] = useState<Interesse[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState<Filtro>('todos')
  const [selecionado, setSelecionado] = useState<Interesse | null>(null)

  useEffect(() => {
    fetchInteresses()
  }, [])

  async function fetchInteresses() {
    try {
      const res = await fetch('/api/amaa/adoption-interests')
      if (res.ok) setInteresses(await res.json())
    } catch (err) {
      console.error('Erro ao carregar interesses:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdateStatus(id: string, newStatus: Interesse['status']) {
    try {
      const res = await fetch(`/api/amaa/adoption-interests?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        await fetchInteresses()
        setSelecionado(null)
      }
    } catch {
      alert('Erro ao atualizar status.')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Deletar este interesse? Esta ação não pode ser desfeita.')) return
    try {
      const res = await fetch(`/api/amaa/adoption-interests?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        await fetchInteresses()
        setSelecionado(null)
      }
    } catch {
      alert('Erro ao deletar.')
    }
  }

  function formatCpf(cpf: string) {
    const n = cpf.replace(/\D/g, '')
    return `${n.slice(0, 3)}.${n.slice(3, 6)}.${n.slice(6, 9)}-${n.slice(9)}`
  }

  const filtrados = filtro === 'todos'
    ? interesses
    : interesses.filter(i => i.status === filtro)

  const contadores = {
    pendente:   interesses.filter(i => i.status === 'pendente').length,
    em_contato: interesses.filter(i => i.status === 'em_contato').length,
    concluido:  interesses.filter(i => i.status === 'concluido').length,
    descartado: interesses.filter(i => i.status === 'descartado').length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Heart className="text-emerald-700" size={28} />
          <div>
            <h1 className="text-2xl font-black text-gray-900">Interesses de Adoção</h1>
            <p className="text-sm text-gray-500">Pessoas que manifestaram interesse em adotar um animal</p>
          </div>
        </div>

        {/* Cards de resumo */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {(Object.entries(contadores) as [Interesse['status'], number][]).map(([status, count]) => (
            <button
              key={status}
              onClick={() => setFiltro(filtro === status ? 'todos' : status)}
              className="bg-white rounded-xl p-4 border-2 text-left transition-all hover:shadow-md"
              style={{
                borderColor: filtro === status ? '#059669' : '#E5E7EB',
              }}
            >
              <p className="text-2xl font-black text-gray-900">{count}</p>
              <p className="text-xs text-gray-500 mt-1">{STATUS_LABEL[status]}</p>
            </button>
          ))}
        </div>

        {/* Filtros */}
        <div className="flex gap-2 flex-wrap mb-6">
          {(['todos', 'pendente', 'em_contato', 'concluido', 'descartado'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: filtro === f ? '#059669' : '#F3F4F6',
                color: filtro === f ? '#fff' : '#374151',
              }}
            >
              {f === 'todos' ? `Todos (${interesses.length})` : STATUS_LABEL[f as Interesse['status']]}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400">⏳ Carregando...</div>
        ) : filtrados.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Heart size={40} className="mx-auto mb-3 opacity-30" />
            <p>Nenhum interesse {filtro !== 'todos' ? `com status "${STATUS_LABEL[filtro as Interesse['status']]}"` : 'registrado'}</p>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {filtrados.map(interesse => {
              const colors = STATUS_COLORS[interesse.status]
              return (
                <div
                  key={interesse.id}
                  onClick={() => setSelecionado(interesse)}
                  className="bg-white rounded-xl border border-gray-200 p-5 cursor-pointer hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Dog size={16} className="text-emerald-700 shrink-0" />
                        <span className="font-bold text-gray-900 truncate">{interesse.animal_nome}</span>
                        <span
                          className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full shrink-0"
                          style={{ background: colors.bg, color: colors.text }}
                        >
                          {STATUS_LABEL[interesse.status]}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <User size={13} className="shrink-0" />
                        <span>{interesse.nome}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="font-mono text-xs">{formatCpf(interesse.cpf)}</span>
                        {interesse.mensagem_enviada && (
                          <span className="text-xs text-emerald-600">· WhatsApp enviado ✓</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 mt-3">
                    {new Date(interesse.created_at).toLocaleString('pt-BR')}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Modal de detalhe */}
      {selecionado && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setSelecionado(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-black text-gray-900">Interesse de Adoção</h2>
              <button onClick={() => setSelecionado(null)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex gap-2 text-sm">
                <Dog size={16} className="text-emerald-700 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Animal</p>
                  <p className="font-semibold text-gray-900">{selecionado.animal_nome}</p>
                </div>
              </div>
              <div className="flex gap-2 text-sm">
                <User size={16} className="text-emerald-700 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Interessado</p>
                  <p className="font-semibold text-gray-900">{selecionado.nome}</p>
                  <p className="text-gray-500 font-mono text-xs">{formatCpf(selecionado.cpf)}</p>
                </div>
              </div>
              {selecionado.telefone && (
                <div className="flex gap-2 text-sm">
                  <Phone size={16} className="text-emerald-700 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Telefone</p>
                    <p className="font-semibold text-gray-900">{selecionado.telefone}</p>
                  </div>
                </div>
              )}
              <div className="flex gap-2 text-sm">
                <Clock size={16} className="text-emerald-700 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Data do interesse</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(selecionado.created_at).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>

            {/* Ações de status */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              {(['pendente', 'em_contato', 'concluido', 'descartado'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => handleUpdateStatus(selecionado.id, s)}
                  disabled={selecionado.status === s}
                  className="py-2 rounded-lg text-xs font-semibold transition-all disabled:opacity-40"
                  style={{
                    background: selecionado.status === s ? '#059669' : '#F3F4F6',
                    color: selecionado.status === s ? '#fff' : '#374151',
                  }}
                >
                  {STATUS_LABEL[s]}
                </button>
              ))}
            </div>

            <button
              onClick={() => handleDelete(selecionado.id)}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold text-red-600 border border-red-200 hover:bg-red-50 transition-all"
            >
              <Trash2 size={13} />
              Deletar registro
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
