import { requireAuth } from '@/lib/auth'
import Link from 'next/link'
import type { UserRole } from '@/types'

const NAV_ITEMS: { href: string; label: string; icon: string; roles: UserRole[] }[] = [
  { href: '/admin',         label: 'Dashboard',     icon: '📊', roles: ['admin', 'editor'] },
  { href: '/admin/artigos', label: 'Fila de Artigos',icon: '📰', roles: ['admin', 'editor'] },
  { href: '/admin/amaa',    label: 'AMAA — Animais', icon: '🐾', roles: ['admin', 'editor', 'voluntaria_amaa'] },
  { href: '/admin/fontes',  label: 'Fontes RSS',     icon: '📡', roles: ['admin'] },
  { href: '/admin/usuarios',label: 'Usuários',       icon: '👤', roles: ['admin'] },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireAuth()

  const visibleNav = NAV_ITEMS.filter(item => item.roles.includes(profile.role))

  const roleLabels: Record<UserRole, string> = {
    admin:           'Administrador',
    editor:          'Editor',
    voluntaria_amaa: 'Voluntária AMAA',
  }

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--color-bg, #F4F6F9)' }}>

      {/* ── SIDEBAR ── */}
      <aside className="admin-sidebar flex-shrink-0 flex flex-col" style={{ width: 240 }}>

        {/* Logo */}
        <div className="px-5 py-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black"
              style={{ background: 'rgba(232,148,31,0.2)', border: '1px solid rgba(232,148,31,0.3)' }}>
              <span style={{ color: '#9CA3AF' }}>M</span>
              <span style={{ color: '#E8941F' }}>N</span>
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-none">Despacho</p>
              <p className="text-xs" style={{ color: '#E8941F' }}>por MNA</p>
            </div>
          </Link>
        </div>

        {/* Perfil */}
        <div className="px-5 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ background: '#E8941F', color: '#fff' }}>
              {profile.full_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-white leading-none truncate" style={{ maxWidth: 150 }}>
                {profile.full_name}
              </p>
              <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>
                {roleLabels[profile.role]}
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3">
          {visibleNav.map(item => (
            <Link key={item.href} href={item.href} className="admin-nav-item">
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <Link href="/noticias-e-opinioes"
            className="flex items-center gap-2 text-xs transition-colors mb-3"
            style={{ color: 'rgba(255,255,255,0.5)' }}>
            ← Ver portal público
          </Link>
          <form action="/api/auth/logout" method="POST">
            <button type="submit"
              className="w-full text-left text-xs transition-colors py-1"
              style={{ color: 'rgba(255,255,255,0.4)' }}>
              Sair da conta
            </button>
          </form>
        </div>

      </aside>

      {/* ── CONTEÚDO ── */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 max-w-6xl">
          {children}
        </div>
      </main>

    </div>
  )
}
