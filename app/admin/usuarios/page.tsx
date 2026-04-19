'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, Edit2, Shield } from 'lucide-react'
import type { Profile, UserRole } from '@/types'

export default function UsuariosAdminPage() {
  const [usuarios, setUsuarios] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [adicionando, setAdicionando] = useState(false)
  const [form, setForm] = useState({
    email: '',
    full_name: '',
    role: 'editor' as UserRole,
  })

  // ── Carregar usuários ────────────────────────────────────────────────────

  useEffect(() => {
    fetchUsuarios()
  }, [])

  async function fetchUsuarios() {
    try {
      const res = await fetch('/api/admin/usuarios')
      if (res.ok) {
        const data = await res.json()
        setUsuarios(data)
      }
    } catch (err) {
      console.error('Erro ao carregar usuários:', err)
    } finally {
      setLoading(false)
    }
  }

  // ── Criar usuário ────────────────────────────────────────────────────────

  async function handleAddUser(e: React.FormEvent) {
    e.preventDefault()
    if (!form.email.trim() || !form.full_name.trim()) {
      alert('Preencha email e nome')
      return
    }

    try {
      const res = await fetch('/api/admin/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        setForm({ email: '', full_name: '', role: 'editor' })
        setAdicionando(false)
        await fetchUsuarios()
        alert('Usuário criado! Um convite foi enviado por email.')
      } else {
        const error = await res.json()
        alert(`Erro: ${error.error}`)
      }
    } catch (err) {
      console.error('Erro:', err)
      alert('Erro ao criar usuário')
    }
  }

  // ── Atualizar role ──────────────────────────────────────────────────────

  async function handleUpdateRole(userId: string, newRole: UserRole) {
    try {
      const res = await fetch(`/api/admin/usuarios/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      })

      if (res.ok) {
        await fetchUsuarios()
      }
    } catch (err) {
      console.error('Erro:', err)
      alert('Erro ao atualizar')
    }
  }

  // ── Deletar usuário ─────────────────────────────────────────────────────

  async function handleDeleteUser(userId: string) {
    if (!confirm('Tem certeza? Isto não pode ser desfeito.')) return

    try {
      const res = await fetch(`/api/admin/usuarios/${userId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        await fetchUsuarios()
      }
    } catch (err) {
      console.error('Erro:', err)
      alert('Erro ao deletar')
    }
  }

  // ── Renderizar ───────────────────────────────────────────────────────────

  const ROLES: Record<UserRole, { label: string; cor: string }> = {
    admin: { label: '👑 Admin', cor: '#E8941F' },
    editor: { label: '📝 Editor', cor: '#10B981' },
    voluntaria_amaa: { label: '🐾 Voluntária AMAA', cor: '#2D6A4F' },
  }

  return (
    <div style={{ backgroundColor: '#F5E6D3', color: '#2D2D2D', minHeight: '100vh', padding: '32px 20px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

        {/* ── CABEÇALHO ── */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
            👥 Gerenciar Usuários
          </h1>
          <p style={{ fontSize: '14px', opacity: 0.7 }}>
            Crie e gerencie quem tem acesso ao painel editorial
          </p>
        </div>

        {/* ── BOTÃO ADICIONAR ── */}
        <button
          onClick={() => setAdicionando(!adicionando)}
          style={{
            backgroundColor: '#E8941F',
            color: '#2D2D2D',
            padding: '10px 16px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '600',
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Plus size={18} /> Convidar Usuário
        </button>

        {/* ── FORMULÁRIO ── */}
        {adicionando && (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              padding: '24px',
              marginBottom: '32px',
              border: '2px solid #E8941F',
            }}
          >
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
              Convidar Novo Usuário
            </h2>
            <form onSubmit={handleAddUser} style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '600' }}>
                  Email *
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="usuario@exemplo.com"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #D3D3D3',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '600' }}>
                  Nome Completo *
                </label>
                <input
                  type="text"
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  placeholder="João Silva"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #D3D3D3',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '600' }}>
                  Nível de Acesso
                </label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #D3D3D3',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="editor">📝 Editor (aprovar notícias)</option>
                  <option value="admin">👑 Admin (acesso total)</option>
                  <option value="voluntaria_amaa">🐾 Voluntária AMAA (cadastro de animais)</option>
                </select>
                <p style={{ fontSize: '12px', opacity: 0.6, marginTop: '8px' }}>
                  {form.role === 'admin' && 'Acesso total a todas as funcionalidades'}
                  {form.role === 'editor' && 'Pode aprovar/rejeitar notícias e editar análises'}
                  {form.role === 'voluntaria_amaa' && 'Pode cadastrar e gerenciar animais para adoção'}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#10B981',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Enviar Convite
                </button>
                <button
                  type="button"
                  onClick={() => setAdicionando(false)}
                  style={{
                    backgroundColor: '#D3D3D3',
                    color: '#2D2D2D',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── LISTA DE USUÁRIOS ── */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', opacity: 0.6 }}>
            Carregando usuários...
          </div>
        ) : usuarios.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', opacity: 0.6 }}>
            Nenhum usuário criado ainda.
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {usuarios.map((user) => (
              <div
                key={user.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '8px',
                  padding: '16px',
                  border: '1px solid #D3D3D3',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                }}
              >
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontWeight: 'bold', marginBottom: '4px', fontSize: '16px' }}>
                    {user.full_name}
                  </h3>
                  <p style={{ fontSize: '12px', opacity: 0.7, marginBottom: '8px' }}>
                    {user.id}
                  </p>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <select
                      value={user.role}
                      onChange={(e) => handleUpdateRole(user.id, e.target.value as UserRole)}
                      style={{
                        padding: '6px 12px',
                        border: `1px solid ${ROLES[user.role].cor}`,
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: ROLES[user.role].cor,
                        background: '#FFFFFF',
                        cursor: 'pointer',
                      }}
                    >
                      {Object.entries(ROLES).map(([key, { label }]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                    {user.active ? (
                      <span style={{ fontSize: '12px', color: '#10B981', fontWeight: 'bold' }}>
                        ✓ Ativo
                      </span>
                    ) : (
                      <span style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 'bold' }}>
                        ✗ Inativo
                      </span>
                    )}
                  </div>
                </div>

                {/* ── AÇÕES ── */}
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px',
                    fontSize: '18px',
                    color: '#EF4444',
                  }}
                  title="Deletar usuário"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
