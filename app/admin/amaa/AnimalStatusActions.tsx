'use client'
// Botões de status para animais AMAA
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface Props {
  animalId: string
  currentStatus: string
}

export default function AnimalStatusActions({ animalId, currentStatus }: Props) {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  async function update(newStatus: string) {
    setLoading(newStatus)
    const updates: Record<string, unknown> = { status: newStatus }
    if (newStatus === 'adopted') updates.adopted_at = new Date().toISOString()
    if (newStatus === 'published') updates.approved_at = new Date().toISOString()

    await supabase.from('animals').update(updates).eq('id', animalId)
    setLoading(null)
    router.refresh()
  }

  const btnBase = 'flex-1 py-2 rounded-lg text-xs font-bold transition-colors disabled:opacity-50'

  if (currentStatus === 'pending') {
    return (
      <div className="flex gap-2">
        <button onClick={() => update('published')} disabled={loading !== null}
          className={`${btnBase} bg-green-600 hover:bg-green-700 text-white`}>
          {loading === 'published' ? '...' : '✓ Publicar'}
        </button>
        <button onClick={() => update('rejected')} disabled={loading !== null}
          className={`${btnBase} bg-red-100 hover:bg-red-200 text-red-700`}>
          {loading === 'rejected' ? '...' : '✕ Rejeitar'}
        </button>
      </div>
    )
  }

  if (currentStatus === 'published') {
    return (
      <div className="flex gap-2">
        <button onClick={() => update('adopted')} disabled={loading !== null}
          className={`${btnBase} bg-blue-600 hover:bg-blue-700 text-white`}>
          {loading === 'adopted' ? '...' : '🏠 Marcar Adotado'}
        </button>
        <button onClick={() => update('rejected')} disabled={loading !== null}
          className={`${btnBase} bg-gray-100 hover:bg-gray-200 text-gray-600`}>
          {loading === 'rejected' ? '...' : '✕'}
        </button>
      </div>
    )
  }

  if (currentStatus === 'adopted' || currentStatus === 'rejected') {
    return (
      <button onClick={() => update('published')} disabled={loading !== null}
        className={`${btnBase} w-full border border-emerald-300 text-emerald-700 hover:bg-emerald-50`}>
        {loading === 'published' ? '...' : '↩ Republicar'}
      </button>
    )
  }

  return null
}
