import { requireRole } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const revalidate = 60

export default async function AdminDashboard() {
  await requireRole(['admin', 'editor'])
  const supabase = await createClient()

  // Contagens
  const [
    { count: pendingArticles },
    { count: publishedArticles },
    { count: pendingAnimals },
    { count: publishedAnimals },
    { count: newDenuncias },
  ] = await Promise.all([
    supabase.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('animals').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('animals').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('denuncias').select('*', { count: 'exact', head: true }).eq('status', 'nova'),
  ])

  // Últimos artigos pendentes
  const { data: pendingList } = await supabase
    .from('articles')
    .select('id, title, category, source_name, created_at')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(8)

  const stats = [
    { label: 'Artigos Pendentes',  value: pendingArticles ?? 0,  href: '/admin/artigos', color: '#D97706', urgent: (pendingArticles ?? 0) > 0 },
    { label: 'Artigos Publicados', value: publishedArticles ?? 0, href: '/admin/artigos?status=published', color: '#059669', urgent: false },
    { label: 'Animais Pendentes',  value: pendingAnimals ?? 0,   href: '/admin/amaa', color: '#E8941F', urgent: (pendingAnimals ?? 0) > 0 },
    { label: 'Animais no Portal',  value: publishedAnimals ?? 0, href: '/admin/amaa?status=published', color: '#2563EB', urgent: false },
    { label: 'Denúncias Novas',    value: newDenuncias ?? 0,     href: '/admin/denuncias', color: '#DC2626', urgent: (newDenuncias ?? 0) > 0 },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black" style={{ color: 'var(--color-text, #111827)' }}>
          Dashboard Editorial
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-muted, #6B7280)' }}>
          Despacho, por MNA — visão geral do portal
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
        {stats.map(stat => (
          <Link key={stat.label} href={stat.href}
            className="rounded-xl p-4 transition-all hover:scale-105"
            style={{
              background: 'var(--color-surface, #fff)',
              border: stat.urgent
                ? `2px solid ${stat.color}`
                : '1px solid var(--color-border, #E5E7EB)',
              boxShadow: stat.urgent ? `0 0 0 3px ${stat.color}20` : 'none',
            }}>
            <p className="text-3xl font-black" style={{ color: stat.color }}>
              {stat.value}
            </p>
            <p className="text-xs font-medium mt-1" style={{ color: 'var(--color-muted, #6B7280)' }}>
              {stat.label}
            </p>
            {stat.urgent && stat.value > 0 && (
              <span className="inline-block mt-2 text-xs font-bold px-2 py-0.5 rounded-full text-white"
                style={{ background: stat.color }}>
                Ação necessária
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* Fila rápida */}
      {(pendingList?.length ?? 0) > 0 && (
        <div className="rounded-xl overflow-hidden"
          style={{ background: 'var(--color-surface, #fff)', border: '1px solid var(--color-border, #E5E7EB)' }}>

          <div className="px-5 py-4 flex items-center justify-between"
            style={{ borderBottom: '1px solid var(--color-border, #E5E7EB)' }}>
            <h2 className="font-bold" style={{ color: 'var(--color-text, #111827)' }}>
              📋 Artigos aguardando aprovação
            </h2>
            <Link href="/admin/artigos"
              className="text-xs font-semibold hover:underline"
              style={{ color: '#E8941F' }}>
              Ver todos →
            </Link>
          </div>

          <div className="divide-y" style={{ borderColor: 'var(--color-border, #E5E7EB)' }}>
            {pendingList?.map(article => (
              <div key={article.id} className="px-5 py-3 flex items-center gap-3">
                <span className="category-badge text-white"
                  style={{ background: '#E8941F', fontSize: 10 }}>
                  {article.category}
                </span>
                <span className="flex-1 text-sm font-medium truncate"
                  style={{ color: 'var(--color-text, #111827)' }}>
                  {article.title}
                </span>
                <span className="text-xs flex-shrink-0"
                  style={{ color: 'var(--color-muted, #6B7280)' }}>
                  {article.source_name}
                </span>
                <Link href={`/admin/artigos/${article.id}`}
                  className="text-xs font-semibold px-3 py-1 rounded-lg transition-colors flex-shrink-0"
                  style={{ background: '#E8941F', color: '#fff' }}>
                  Revisar
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Atalhos */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
        <Link href="/admin/artigos"
          className="rounded-xl p-5 flex items-center gap-4 transition-all hover:scale-[1.02]"
          style={{ background: '#1D4ED8', color: '#fff' }}>
          <span className="text-3xl">📰</span>
          <div>
            <p className="font-bold">Gerenciar Artigos</p>
            <p className="text-xs opacity-75">Aprovar, editar e publicar</p>
          </div>
        </Link>
        <Link href="/admin/amaa"
          className="rounded-xl p-5 flex items-center gap-4 transition-all hover:scale-[1.02]"
          style={{ background: '#2D6A4F', color: '#fff' }}>
          <span className="text-3xl">🐾</span>
          <div>
            <p className="font-bold">Animais AMAA</p>
            <p className="text-xs opacity-75">Aprovar cadastros para adoção</p>
          </div>
        </Link>
        <Link href="/api/rss/refresh"
          className="rounded-xl p-5 flex items-center gap-4 transition-all hover:scale-[1.02]"
          style={{ background: '#374151', color: '#fff' }}>
          <span className="text-3xl">🔄</span>
          <div>
            <p className="font-bold">Buscar Notícias</p>
            <p className="text-xs opacity-75">Sincronizar fontes RSS agora</p>
          </div>
        </Link>
      </div>

    </div>
  )
}
