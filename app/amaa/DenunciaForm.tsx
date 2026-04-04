'use client'
// ═══════════════════════════════════════════════════════════════════════════
// Formulário de Denúncia de Maus-Tratos — Client Component
// ═══════════════════════════════════════════════════════════════════════════

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const TIPOS_ABUSO = [
  'Violência física',
  'Privação de alimento/água',
  'Confinamento cruel',
  'Abandono',
  'Falta de atendimento veterinário',
  'Exposição a extremos climáticos',
  'Envenenamento',
  'Rinha / briga forçada',
  'Outros',
]

type FormState = 'idle' | 'sending' | 'success' | 'error'

export default function DenunciaForm() {
  const supabase = createClient()

  const [formState, setFormState] = useState<FormState>('idle')
  const [protocolo, setProtocolo] = useState('')
  const [anonima, setAnonima] = useState(false)
  const [tiposSelecionados, setTiposSelecionados] = useState<string[]>([])
  const [errorMsg, setErrorMsg] = useState('')

  function toggleTipo(tipo: string) {
    setTiposSelecionados(prev =>
      prev.includes(tipo) ? prev.filter(t => t !== tipo) : [...prev, tipo]
    )
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (tiposSelecionados.length === 0) {
      setErrorMsg('Selecione pelo menos um tipo de abuso.')
      return
    }

    setFormState('sending')
    setErrorMsg('')

    const fd = new FormData(e.currentTarget)

    const payload = {
      endereco:      fd.get('endereco') as string,
      bairro:        (fd.get('bairro') as string) || null,
      cidade:        (fd.get('cidade') as string) || 'Realeza',
      estado:        'PR',
      tipo_animal:   fd.get('tipo_animal') as string,
      qtd_animais:   (fd.get('qtd_animais') as string) || null,
      tipo_abuso:    tiposSelecionados,
      descricao:     fd.get('descricao') as string,
      frequencia:    (fd.get('frequencia') as string) || null,
      suspeito_desc: (fd.get('suspeito_desc') as string) || null,
      anonima,
      contato_nome:  anonima ? null : (fd.get('contato_nome') as string) || null,
      contato_tel:   anonima ? null : (fd.get('contato_tel') as string) || null,
      contato_email: anonima ? null : (fd.get('contato_email') as string) || null,
      status:        'nova',
    }

    const { data, error } = await supabase
      .from('denuncias')
      .insert(payload)
      .select('id')
      .single()

    if (error || !data) {
      setFormState('error')
      setErrorMsg('Erro ao enviar denúncia. Tente novamente ou ligue para a AMAA.')
      return
    }

    // Protocolo simplificado: 6 chars do UUID
    setProtocolo(data.id.slice(0, 8).toUpperCase())
    setFormState('success')
  }

  // ── Estado de sucesso ──────────────────────────────────────────────────
  if (formState === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h3 className="text-2xl font-black text-green-800 mb-2">Denúncia registrada!</h3>
        <p className="text-green-700 mb-4">
          Seu protocolo de atendimento é:
        </p>
        <div className="inline-block bg-white border-2 border-green-400 rounded-xl px-8 py-3 mb-6">
          <span className="text-3xl font-black text-green-700 tracking-widest">#{protocolo}</span>
        </div>
        <p className="text-sm text-green-700 mb-6">
          A AMAA analisará a denúncia e tomará as providências cabíveis.
          Em casos de emergência, ligue para a <strong>Polícia Ambiental: 0800 041 2897</strong> ou <strong>PM: 190</strong>.
        </p>
        <button
          onClick={() => {
            setFormState('idle')
            setTiposSelecionados([])
            setAnonima(false)
          }}
          className="text-green-600 hover:text-green-800 font-semibold text-sm underline"
        >
          Fazer outra denúncia
        </button>
      </div>
    )
  }

  // ── Formulário ─────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* ── LOCALIZAÇÃO ─────────────────────────────────────────── */}
      <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-orange-500">📍</span> Localização da ocorrência
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Endereço / Localização <span className="text-red-500">*</span>
            </label>
            <input
              name="endereco"
              required
              placeholder="Rua, número, ponto de referência..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
            <input
              name="bairro"
              placeholder="Bairro ou localidade"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
            <input
              name="cidade"
              placeholder="Realeza"
              defaultValue="Realeza"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* ── ANIMAL ──────────────────────────────────────────────── */}
      <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-orange-500">🐾</span> Sobre o animal
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de animal <span className="text-red-500">*</span>
            </label>
            <select
              name="tipo_animal"
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="">Selecione...</option>
              <option>Cachorro</option>
              <option>Gato</option>
              <option>Ave</option>
              <option>Animal silvestre</option>
              <option>Bovino / equino</option>
              <option>Outro</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade aproximada</label>
            <input
              name="qtd_animais"
              placeholder="Ex: 1 cão, 3 gatos..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* ── TIPO DE ABUSO ────────────────────────────────────────── */}
      <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-1 flex items-center gap-2">
          <span className="text-orange-500">⚠️</span> Tipo de abuso <span className="text-red-500">*</span>
        </h3>
        <p className="text-sm text-gray-500 mb-4">Selecione todos que se aplicam:</p>
        <div className="flex flex-wrap gap-2">
          {TIPOS_ABUSO.map(tipo => (
            <button
              key={tipo}
              type="button"
              onClick={() => toggleTipo(tipo)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                tiposSelecionados.includes(tipo)
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-red-300 hover:text-red-600'
              }`}
            >
              {tipo}
            </button>
          ))}
        </div>
      </div>

      {/* ── DESCRIÇÃO ───────────────────────────────────────────── */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descrição detalhada <span className="text-red-500">*</span>
        </label>
        <textarea
          name="descricao"
          required
          rows={4}
          placeholder="Descreva o que você viu, quando ocorre, condições do animal..."
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
        />
      </div>

      {/* ── FREQUÊNCIA E SUSPEITO ────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Frequência</label>
          <select
            name="frequencia"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          >
            <option value="">Não sei</option>
            <option>Ocorrência única</option>
            <option>Acontece com frequência</option>
            <option>Situação permanente</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descrição do suspeito (opcional)</label>
          <input
            name="suspeito_desc"
            placeholder="Se souber, descreva o responsável..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* ── ANONIMATO ───────────────────────────────────────────── */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={anonima}
            onChange={e => setAnonima(e.target.checked)}
            className="w-4 h-4 accent-blue-600"
          />
          <div>
            <span className="font-semibold text-blue-800 text-sm">Fazer denúncia anônima</span>
            <p className="text-xs text-blue-600 mt-0.5">
              Seus dados não serão armazenados. A denúncia será analisada normalmente.
            </p>
          </div>
        </label>
      </div>

      {/* ── DADOS DO DENUNCIANTE (se não anônimo) ───────────────── */}
      {!anonima && (
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-1 flex items-center gap-2">
            <span className="text-orange-500">👤</span> Seus dados de contato
          </h3>
          <p className="text-sm text-gray-500 mb-4">Opcional — permite que a AMAA atualize você sobre a ocorrência.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <input
                name="contato_nome"
                placeholder="Seu nome"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone / WhatsApp</label>
              <input
                name="contato_tel"
                placeholder="(46) 9 9999-9999"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <input
                name="contato_email"
                type="email"
                placeholder="seu@email.com"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── ERRO ────────────────────────────────────────────────── */}
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* ── SUBMIT ──────────────────────────────────────────────── */}
      <button
        type="submit"
        disabled={formState === 'sending'}
        className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-black py-4 rounded-xl transition-colors text-base"
      >
        {formState === 'sending' ? '⏳ Enviando...' : '🚨 Registrar Denúncia'}
      </button>

      <p className="text-xs text-gray-400 text-center">
        Todas as denúncias são tratadas com sigilo. Em emergência, ligue <strong>190</strong> (PM) ou <strong>0800 041 2897</strong> (Polícia Ambiental).
      </p>
    </form>
  )
}
