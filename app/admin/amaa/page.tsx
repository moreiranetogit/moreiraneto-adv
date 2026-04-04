// ═══════════════════════════════════════════════════════════════════════════
// Admin — Gestão de Animais AMAA (voluntárias + admin)
// moreiraneto.adv.br/admin/amaa
// ═══════════════════════════════════════════════════════════════════════════

import { createClient } from '@/lib/supabase/server'
import { requireRole } from '@/lib/auth'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { Animal } from '@/types'
import AnimalStatusActions from './AnimalStatusActions'
import AnimalFormModal from './AnimalFormModal'

export const dynamic = 'force-dynamic'

// ── Dados ────────────────────────────────────────────────────────────────────

async function getAnimais(status?: string) {
  await requireRole(['admin', 'editor', 'voluntaria_amaa'])
  const supabase = await createClient()

  let query = supabase
    .from('animals')
    .select('*')
    .order('created_at', { ascending: false })

  if (status && status !== 'all') {
    query = query.eq('status', status)
  }

  const { data, error } = await query
  if (error) throw error
  return (data as Animal[]) ?? []
}

async function getDenunciaCount() {
  const supabase = await createClient()
  const { count } = await supabase
    .from('denuncias')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'nova')
  return count ?? 0
}

// ── Página ───────────────────────────────────────────────────────────────────

export default async function AdminAmaaPage({
  searchParams,
}: {
  searchParams: { status?: string }
}) {
  const status  = searchParams.status || 'pending'
  const animais = await getAnimais(status)
  const denunciasNovas = await getDenunciaCount()

  const STATUS_TABS = [
    { key: 'pending',   label: 'Aguardando revisão' },
    { key: 'published', label: 'Publicados' },
    { key: 'adopted',   label: 'Adotados' },
    { key: 'rejected',  label: 'Rejeitados' },
    { key: 'all',       label: 'Todos' },
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/amaa-logo-web.png" alt="AMAA" className="w-8 h-8 rounded-2xl object-contain" />
            <h1 className="text-2xl font-black text-gray-900">AMAA — Gestão de Animais</h1>
          </div>
          <p className="text-gray-500 text-sm ml-11">
            {animais.length} animal(is) · {status === 'pending' ? 'aguardando revisão' : `status: ${status}`}
            {denunciasNovas > 0 && (
              <span className="ml-3 bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">
                🚨 {denunciasNovas} denúncia{denunciasNovas > 1 ? 's' : ''} nova{denunciasNovas > 1 ? 's' : ''}
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {denunciasNovas > 0 && (
            <Link
              href="/admin/denuncias"
              className="border border-red-300 text-red-600 hover:bg-red-50 text-sm font-bold px-4 py-2.5 rounded-xl transition-colors"
            >
              🚨 Ver denúncias
            </Link>
          )}
          {/* Modal de cadastro — client component */}
          <AnimalFormModal />
        </div>
      </div>

      {/* Tabs de status */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_TABS.map(tab => (
          <Link
            key={tab.key}
            href={`/admin/amaa?status=${tab.key}`}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
              status === tab.key
                ? 'bg-emerald-800 text-white border-emerald-800'
                : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-400'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Grid de animais */}
      {animais.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <div className="text-6xl mb-4">🐾</div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">Nenhum animal nesta categoria</h3>
          <p className="text-gray-400 text-sm mb-6">
            {status === 'pending'
              ? 'Ótima notícia! Todos os animais foram revisados.'
              : 'Cadastre um novo animal usando o botão acima.'}
          </p>
          <AnimalFormModal />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {animais.map(animal => (
            <AnimalCard key={animal.id} animal={animal} />
          ))}
        </div>
      )}

    </div>
  )
}

// ── Card de animal ────────────────────────────────────────────────────────────

function AnimalCard({ animal }: { animal: Animal }) {
  const fotos = animal.fotos ?? []
  const foto  = fotos[0] ?? null

  const timeAgo = formatDistanceToNow(new Date(animal.created_at), { locale: ptBR, addSuffix: true })

  const statusBadge: Record<string, string> = {
    pending:   'status-pending',
    published: 'status-published',
    adopted:   'status-adopted',
    rejected:  'status-rejected',
  }

  const statusLabel: Record<string, string> = {
    pending:   '⏳ Revisão',
    published: '✓ Publicado',
    adopted:   '🏠 Adotado',
    rejected:  '✕ Rejeitado',
  }

  const urgenciaColor: Record<string, string> = {
    critica: 'bg-red-100 text-red-700',
    alta:    'bg-orange-100 text-orange-700',
    normal:  'bg-green-50 text-green-700',
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">

      {/* Foto */}
      <div className="aspect-[4/3] bg-gray-100 relative">
        {foto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={foto} alt={animal.nome} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl text-gray-300">
            {animal.especie === 'gato' ? '🐱' : '🐶'}
          </div>
        )}

        {/* Badge urgência */}
        <div className={`absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full ${urgenciaColor[animal.urgencia] ?? ''}`}>
          {animal.urgencia === 'critica' ? '🚨 Urgente' : animal.urgencia === 'alta' ? '⚡ Alta' : '🟢 Normal'}
        </div>

        {/* Fotos count */}
        {fotos.length > 1 && (
          <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
            📷 {fotos.length}
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="p-4 flex flex-col flex-1">

        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-gray-900 text-lg">{animal.nome}</h3>
          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold ${statusBadge[animal.status] ?? ''}`}>
            {statusLabel[animal.status] ?? animal.status}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">
            {animal.especie}
          </span>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
            {animal.sexo === 'macho' ? '♂ Macho' : '♀ Fêmea'}
          </span>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
            {animal.porte}
          </span>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
            {animal.idade_categoria}
          </span>
        </div>

        <p className="text-sm text-gray-500 line-clamp-2 flex-1 mb-3">{animal.descricao}</p>

        {/* Saúde chips */}
        <div className="flex flex-wrap gap-1 mb-3">
          {animal.castrado === 'sim'  && <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">✓ Castrado</span>}
          {animal.vacinado === 'sim'  && <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">✓ Vacinado</span>}
          {animal.microchip === 'sim' && <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">✓ Microchip</span>}
          {animal.tratamento_ativo   && <span className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded-full">⚕️ Em tratamento</span>}
        </div>

        <div className="text-xs text-gray-400 mb-3">{timeAgo}</div>

        {/* Ações */}
        <AnimalStatusActions animalId={animal.id} currentStatus={animal.status} />

      </div>
    </div>
  )
}
