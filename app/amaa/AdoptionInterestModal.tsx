'use client'

import { useState } from 'react'
import { X, Loader, AlertCircle, CheckCircle } from 'lucide-react'

interface AdoptionInterestModalProps {
  animalId: string
  animalName: string
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function AdoptionInterestModal({
  animalId,
  animalName,
  isOpen,
  onClose,
  onSuccess,
}: AdoptionInterestModalProps) {
  const [nome, setNome] = useState('')
  const [cpf, setCpf] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Formata CPF para visualização
  function formatarCPF(valor: string) {
    return valor
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{2})$/, '$1-$2')
      .slice(0, 14)
  }

  // Valida CPF (algoritmo simples)
  function validarCPF(cpf: string): boolean {
    const numeros = cpf.replace(/\D/g, '')
    if (numeros.length !== 11) return false
    if (/^(\d)\1{10}$/.test(numeros)) return false

    let soma = 0
    let resto = 0

    for (let i = 1; i <= 9; i++) {
      soma += parseInt(numeros.substring(i - 1, i)) * (11 - i)
    }
    resto = (soma * 10) % 11
    if (resto === 10 || resto === 11) resto = 0
    if (resto !== parseInt(numeros.substring(9, 10))) return false

    soma = 0
    for (let i = 1; i <= 10; i++) {
      soma += parseInt(numeros.substring(i - 1, i)) * (12 - i)
    }
    resto = (soma * 10) % 11
    if (resto === 10 || resto === 11) resto = 0
    if (resto !== parseInt(numeros.substring(10, 11))) return false

    return true
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess(false)

    // Validações
    if (!nome.trim()) {
      setError('Por favor, informe seu nome completo')
      return
    }

    if (!cpf.trim()) {
      setError('Por favor, informe seu CPF')
      return
    }

    if (!validarCPF(cpf)) {
      setError('CPF inválido. Verifique os dígitos.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/amaa/adoption-interests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          animalId,
          animalName,
          nome: nome.trim(),
          cpf: cpf.replace(/\D/g, ''), // envia só números
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao registrar interesse')
      }

      setSuccess(true)
      setNome('')
      setCpf('')

      // Fechar modal após 2 segundos
      setTimeout(() => {
        onClose()
        onSuccess?.()
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao registrar interesse')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Quero Adotar
          </h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {success ? (
            <div className="flex flex-col items-center justify-center py-8">
              <CheckCircle size={48} className="text-green-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Interesse Registrado!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center text-sm">
                Fátima, presidente da AMAA, receberá seu contato e entrará em comunicação.
              </p>
            </div>
          ) : (
            <>
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  <strong>Animal:</strong> {animalName}
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-300 mt-2">
                  Fátima, presidente da AMAA, entrará em contato através do WhatsApp.
                </p>
              </div>

              {error && (
                <div className="flex items-start gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                  <AlertCircle size={20} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nome Completo */}
                <div>
                  <label htmlFor="nome" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nome Completo *
                  </label>
                  <input
                    id="nome"
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    disabled={loading}
                    placeholder="Seu nome completo"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] disabled:opacity-50"
                  />
                </div>

                {/* CPF */}
                <div>
                  <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    CPF (sem pontuação) *
                  </label>
                  <input
                    id="cpf"
                    type="text"
                    value={formatarCPF(cpf)}
                    onChange={(e) => setCpf(e.target.value)}
                    disabled={loading}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] disabled:opacity-50 font-mono"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    O CPF é necessário para validação e afastar curiosos.
                  </p>
                </div>

                {/* Botões */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium transition disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-[#2D6A4F] hover:bg-[#1e4433] text-white rounded-lg font-medium transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader size={18} className="animate-spin" />
                        Registrando...
                      </>
                    ) : (
                      'Registrar Interesse'
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
