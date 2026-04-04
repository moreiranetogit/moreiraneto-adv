'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') ?? '/admin'
  const errorParam = searchParams.get('error')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(
    errorParam === 'conta_inativa' ? 'Conta desativada. Contate o administrador.' : ''
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (authError) {
      setError('E-mail ou senha incorretos.')
      setLoading(false)
      return
    }

    // Middleware vai redirecionar baseado na role
    router.push(redirect)
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: '#0D0D0F' }}>

      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{ background: 'rgba(232,148,31,0.15)', border: '1px solid rgba(232,148,31,0.3)' }}>
            <span className="text-2xl font-black">
              <span style={{ color: '#9CA3AF' }}>M</span>
              <span style={{ color: '#E8941F' }}>N</span>
            </span>
          </div>
          <h1 className="text-xl font-black text-white">Moreira Neto Advocacia</h1>
          <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
            Área restrita — equipe interna
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-6" style={{
          background: '#18181B',
          border: '1px solid #3F3F46',
        }}>
          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide"
                style={{ color: '#9CA3AF' }}>
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="seu@email.com"
                className="w-full px-3 py-2.5 rounded-lg text-sm text-white outline-none transition-all"
                style={{
                  background: '#09090B',
                  border: '1.5px solid #3F3F46',
                }}
                onFocus={e => e.target.style.borderColor = '#E8941F'}
                onBlur={e => e.target.style.borderColor = '#3F3F46'}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide"
                  style={{ color: '#9CA3AF' }}>
                  Senha
                </label>
                {/* TODO: implementar recuperação de senha */}
                <button type="button" className="text-xs hover:underline"
                  style={{ color: '#E8941F' }}>
                  Esqueci a senha
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full px-3 py-2.5 rounded-lg text-sm text-white outline-none transition-all"
                style={{
                  background: '#09090B',
                  border: '1.5px solid #3F3F46',
                }}
                onFocus={e => e.target.style.borderColor = '#E8941F'}
                onBlur={e => e.target.style.borderColor = '#3F3F46'}
              />
            </div>

            {error && (
              <div className="rounded-lg px-3 py-2.5 text-sm"
                style={{ background: '#FEE2E2', color: '#991B1B' }}>
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm font-bold transition-all"
              style={{
                background: loading ? '#92400E' : '#E8941F',
                color: '#fff',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>

          </form>
        </div>

        {/* Voltar ao site */}
        <div className="text-center mt-6">
          <Link href="/" className="text-sm hover:underline" style={{ color: '#6B7280' }}>
            ← Voltar ao site
          </Link>
        </div>

        <p className="text-center text-xs mt-4" style={{ color: '#374151' }}>
          Acesso exclusivo para a equipe MNA e voluntárias AMAA.<br />
          Em caso de problemas, contate o administrador.
        </p>

      </div>
    </div>
  )
}
