'use client'
// ═══════════════════════════════════════════════════════════════════════════
// Admin — Revisão de Artigo Individual
// moreiraneto.adv.br/admin/artigos/[id]
// ═══════════════════════════════════════════════════════════════════════════

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CATEGORY_LABELS, CATEGORY_COLORS } from '@/types'
import type { Article } from '@/types'

export default function ArtigoRevisaoPage() {
  const params  = useParams()
  const router  = useRouter()
  const supabase = createClient()

  const [artigo, setArtigo]   = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState<string | null>(null)
  const [editTitle, setEditTitle]     = useState('')
  const [editExcerpt, setEditExcerpt] = useState('')
  const [editContent, setEditContent] = useState('')
  const [isDirty, setIsDirty] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('articles')
        .select('*')
        .eq('id', params.id as string)
        .single()
      setArtigo(data as Article)
      setEditTitle(data?.title ?? '')
      setEditExcerpt(data?.excerpt ?? '')
      setEditContent(data?.content ?? '')
      setLoading(false)
    }
    load()
  }, [params.id, supabase])

  async function handleSave() {
    if (!artigo) return
    setSaving('save')
    await supabase.from('articles').update({
      title: editTitle,
      excerpt: editExcerpt,
      content: editContent,
    }).eq('id', artigo.id)
    setSaving(null)
    setIsDirty(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  async function handleStatus(newStatus: 'published' | 'rejected') {
    if (!artigo) return
    setSaving(newStatus)
    const updates: Record<string, unknown> = { status: newStatus }
    if (newStatus === 'published') updates.published_at = new Date().toISOString()
    await supabase.from('articles').update(updates).eq('id', artigo.id)
    setSaving(null)
    router.push('/admin/artigos')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-400 text-sm">Carregando artigo...</div>
      </div>
    )
  }

  if (!artigo) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Artigo não encontrado.</p>
        <Link href="/admin/artigos" className="text-orange-500 text-sm mt-2 inline-block">
          ← Voltar à fila
        </Link>
      </div>
    )
  }

  const categoryLabel = CATEGORY_LABELS[artigo.category] ?? artigo.category
  const categoryColor = CATEGORY_COLORS[artigo.category] ?? '#E8941F'

  return (
    <div className="p-6 max-w-4xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/artigos"
            className="text-gray-400 hover:text-gray-600 transition-colors text-sm"
          >
            ← Fila editorial
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-sm text-gray-600 truncate max-w-xs">
            {artigo.title.slice(0, 50)}...
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isDirty && (
            <button
              onClick={handleSave}
              disabled={saving !== null}
              className="px-4 py-2 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              {saving === 'save' ? 'Salvando...' : 'Salvar edições'}
            </button>
          )}
          {saved && (
            <span className="text-green-600 text-sm font-semibold">✓ Salvo</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6">

        {/* Editor principal */}
        <div className="space-y-5">

          {/* Categoria + Fonte */}
          <div className="flex flex-wrap items-center gap-3">
            <span
              className="px-3 py-1 rounded-full text-xs font-bold"
              style={{ backgroundColor: categoryColor + '20', color: categoryColor }}
            >
              {categoryLabel}
            </span>
            {artigo.source_name && (
              <span className="text-sm text-gray-500">{artigo.source_name}</span>
            )}
            {artigo.source_url && (
              <a
                href={artigo.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-orange-500 hover:underline"
              >
                🔗 Fonte original
              </a>
            )}
          </div>

          {/* Imagem */}
          {artigo.image_url && (
            <div className="rounded-xl overflow-hidden border border-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={artigo.image_url}
                alt=""
                className="w-full max-h-56 object-cover"
              />
            </div>
          )}

          {/* Título editável */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Título</label>
            <textarea
              value={editTitle}
              onChange={e => { setEditTitle(e.target.value); setIsDirty(true) }}
              rows={2}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-lg font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
            />
          </div>

          {/* Excerpt editável */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Resumo / Excerpt
            </label>
            <textarea
              value={editExcerpt}
              onChange={e => { setEditExcerpt(e.target.value); setIsDirty(true) }}
              rows={3}
              placeholder="Resumo exibido na listagem..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
            />
          </div>

          {/* Conteúdo editável */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Conteúdo
            </label>
            <textarea
              value={editContent}
              onChange={e => { setEditContent(e.target.value); setIsDirty(true) }}
              rows={12}
              placeholder="Conteúdo do artigo..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none font-mono"
            />
            <p className="text-xs text-gray-400 mt-1">HTML básico é suportado.</p>
          </div>

        </div>

        {/* Sidebar de ações */}
        <div className="space-y-4">

          {/* Status atual */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Status atual</h3>
            <div className={`inline-flex px-3 py-1.5 rounded-full text-sm font-bold ${
              artigo.status === 'published' ? 'status-published' :
              artigo.status === 'rejected'  ? 'status-rejected'  : 'status-pending'
            }`}>
              {artigo.status === 'published' ? '✓ Publicado' :
               artigo.status === 'rejected'  ? '✕ Rejeitado' : '⏳ Pendente'}
            </div>
            {artigo.published_at && (
              <p className="text-xs text-gray-400 mt-2">
                Publicado em {format(new Date(artigo.published_at), "d MMM yyyy 'às' HH:mm", { locale: ptBR })}
              </p>
            )}
          </div>

          {/* Ações de publicação */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-2">
            <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Ações</h3>

            {artigo.status !== 'published' && (
              <button
                onClick={() => handleStatus('published')}
                disabled={saving !== null}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50"
              >
                {saving === 'published' ? 'Publicando...' : '✓ Aprovar e Publicar'}
              </button>
            )}

            {artigo.status !== 'rejected' && (
              <button
                onClick={() => handleStatus('rejected')}
                disabled={saving !== null}
                className="w-full bg-red-100 hover:bg-red-200 text-red-700 font-bold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50"
              >
                {saving === 'rejected' ? 'Rejeitando...' : '✕ Rejeitar'}
              </button>
            )}

            {artigo.status === 'published' && artigo.slug && (
              <a
                href={`/despacho/artigo/${artigo.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center border border-orange-300 text-orange-600 hover:bg-orange-50 font-semibold py-2.5 rounded-xl text-sm transition-colors"
              >
                👁️ Ver no portal
              </a>
            )}
          </div>

          {/* Metadados */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-xs text-gray-400 space-y-1.5">
            <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">Metadados</h3>
            <p><span className="font-medium text-gray-600">ID:</span> {artigo.id.slice(0, 8)}...</p>
            <p><span className="font-medium text-gray-600">Slug:</span> {artigo.slug ?? '—'}</p>
            <p><span className="font-medium text-gray-600">Fonte:</span> {artigo.source_name ?? '—'}</p>
            <p><span className="font-medium text-gray-600">Leituras:</span> {artigo.read_count}</p>
            <p><span className="font-medium text-gray-600">Criado:</span>{' '}
              {format(new Date(artigo.created_at), "d MMM yyyy", { locale: ptBR })}
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
