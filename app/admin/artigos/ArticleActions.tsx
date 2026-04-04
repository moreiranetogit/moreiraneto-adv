'use client'
// Botões de ação rápida (aprovar/rejeitar) — client component
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface Props {
  articleId: string
  currentStatus: string
}

export default function ArticleActions({ articleId, currentStatus }: Props) {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  async function updateStatus(newStatus: 'published' | 'rejected') {
    setLoading(newStatus)
    const updates: Record<string, unknown> = { status: newStatus }
    if (newStatus === 'published') updates.published_at = new Date().toISOString()

    await supabase
      .from('articles')
      .update(updates)
      .eq('id', articleId)

    setLoading(null)
    router.refresh()
  }

  if (currentStatus === 'published') {
    return (
      <button
        onClick={() => updateStatus('rejected')}
        disabled={loading !== null}
        className="px-3 py-1.5 border border-red-200 rounded-lg text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
      >
        {loading === 'rejected' ? '...' : 'Despublicar'}
      </button>
    )
  }

  if (currentStatus === 'rejected') {
    return (
      <button
        onClick={() => updateStatus('published')}
        disabled={loading !== null}
        className="px-3 py-1.5 border border-green-200 rounded-lg text-xs font-semibold text-green-600 hover:bg-green-50 transition-colors disabled:opacity-50"
      >
        {loading === 'published' ? '...' : 'Publicar'}
      </button>
    )
  }

  // pending
  return (
    <div className="flex gap-1.5">
      <button
        onClick={() => updateStatus('published')}
        disabled={loading !== null}
        className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
      >
        {loading === 'published' ? '...' : '✓ Aprovar'}
      </button>
      <button
        onClick={() => updateStatus('rejected')}
        disabled={loading !== null}
        className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
      >
        {load