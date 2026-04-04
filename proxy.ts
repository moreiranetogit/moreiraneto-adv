import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { UserRole } from '@/types'

// Rotas que exigem autenticação e suas roles mínimas
const PROTECTED_ROUTES: Record<string, UserRole[]> = {
  '/admin':       ['admin', 'editor'],
  '/admin/amaa':  ['admin', 'editor', 'voluntaria_amaa'],
}

// Redirecionamento após login por role
const ROLE_HOME: Record<UserRole, string> = {
  admin:           '/admin',
  editor:          '/admin/artigos',
  voluntaria_amaa: '/admin/amaa',
}

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options))
        },
      },
    }
  )

  // Atualiza sessão (obrigatório com Supabase SSR)
  const { data: { user } } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // ── Rota de login: redireciona usuário já autenticado ──
  if (pathname === '/login') {
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      const role = (profile?.role ?? 'voluntaria_amaa') as UserRole
      const redirectTo = request.nextUrl.searchParams.get('redirect') ??
        ROLE_HOME[role]
      return NextResponse.redirect(new URL(redirectTo, request.url))
    }
    return supabaseResponse
  }

  // ── Rotas protegidas ──
  const protectedEntry = Object.entries(PROTECTED_ROUTES).find(([route]) =>
    pathname.startsWith(route)
  )

  if (protectedEntry) {
    const [, allowedRoles] = protectedEntry

    // Não autenticado → redireciona para login
    if (!user) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Verifica role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, active')
      .eq('id', user.id)
      .single()

    if (!profile?.active) {
      // Conta desativada
      await supabase.auth.signOut()
      return NextResponse.redirect(new URL('/login?error=conta_inativa', request.url))
    }

    const role = profile.role as UserRole
    if (!allowedRoles.includes(role)) {
      // Role insuficiente → redireciona para home correta
      return NextResponse.redirect(new URL(ROLE_HOME[role], request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    // Protege /admin/* e /login
    '/admin/:path*',
    '/login',
    // Exclui arquivos estáticos e rotas de API internas
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
