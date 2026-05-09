'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

function LoginForm() {
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
  const [resetMode, setResetMode] = useState(false)
  const [resetSent, setResetSent] = useState(false)

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

    router.push(redirect)
    router.refresh()
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) {
      setError('Digite seu e-mail para receber o link de recuperação.')
      return
    }

    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      { redirectTo: `${window.location.origin}/login?reset=true` }
    )

    setLoading(false)

    if (resetError) {
      setError('Erro ao enviar e-mail. Tente novamente.')
      return
    }

    setResetSent(true)
  }

  const inputStyle = {
    background: '#09090B',
    border: '1.5px solid #3F3F46',
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

          {/* ── Recuperação enviada ── */}
          {resetSent ? (
            <div className="text-center space-y-4">
              <div className="text-4xl">📬</div>
              <p className="text-white font-semibold">Link enviado!</p>
              <p className="text-sm" style={{ color: '#9CA3AF' }}>
                Verifique sua caixa de entrada em <strong className="text-white">{email}</strong>.
                O link expira em 1 hora.
              </p>
              <button
                onClick={() => { setResetSent(false); setResetMode(false) }}
                className="text-sm hover:underline"
                style={{ color: '#E8941F' }}
              >
                ← Voltar ao login
              </button>
            </div>

          /* ── Modo recuperação de senha ── */
          ) : resetMode ? (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <p className="text-sm text-white font-semibold mb-3">Recuperar senha</p>
                <label htmlFor="reset-email" className="block text-xs font-semibold mb-1.5 uppercase tracking-wide"
                  style={{ color: '#9CA3AF' }}>
                  Seu e-mail
                </label>
                <input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="seu@email.com"
                  className="w-full px-3 py-2.5 rounded-lg text-sm text-white outline-none transition-all"
                  style={inputStyle}
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
                {loading ? 'Enviando...' : 'Enviar link de recuperação'}
              </button>

              <button
                type="button"
                onClick={() => { setResetMode(false); setError('') }}
                className="w-full text-sm hover:underline"
                style={{ color: '#6B7280' }}
              >
                ← Voltar ao login
              </button>
            </form>

          /* ── Login normal ── */
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <label htmlFor="login-email" className="block text-xs font-semibold mb-1.5 uppercase tracking-wide"
                  style={{ color: '#9CA3AF' }}>
                  E-mail
                </label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="seu@email.com"
                  className="w-full px-3 py-2.5 rounded-lg text-sm text-white outline-none transition-all"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#E8941F'}
                  onBlur={e => e.target.style.borderColor = '#3F3F46'}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label htmlFor="login-password" className="text-xs font-semibold uppercase tracking-wide"
                    style={{ color: '#9CA3AF' }}>
                    Senha
                  </label>
                  <button
                    type="button"
                    onClick={() => { setResetMode(true); setError('') }}
                    className="text-xs hover:underline"
                    style={{ color: '#E8941F' }}
                  >
                    Esqueci a senha
                  </button>
                </div>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 rounded-lg text-sm text-white outline-none transition-all"
                  style={inputStyle}
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
          )}
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

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
      <LoginForm />
    </Suspense>
  )
}
