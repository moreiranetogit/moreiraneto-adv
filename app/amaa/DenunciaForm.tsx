'use client'

import { useState, useRef, useCallback } from 'react'
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

const ALLOWED_TIPOS = new Set(TIPOS_ABUSO)

type FormState = 'idle' | 'sending' | 'success' | 'error'

interface MapPin { lat: number; lon: number; label: string }

function sanitizeText(value: string, maxLength: number): string {
  return value.trim().slice(0, maxLength)
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

async function geocodeAddress(address: string): Promise<MapPin | null> {
  try {
    const q = encodeURIComponent(`${address}, Realeza, Paraná, Brasil`)
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1`,
      { headers: { 'Accept-Language': 'pt-BR' } }
    )
    const data = await res.json()
    if (!data[0]) return null
    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon), label: data[0].display_name }
  } catch {
    return null
  }
}

function MapPreview({ pin }: { pin: MapPin }) {
  const zoom = 16
  const url = `https://www.openstreetmap.org/export/embed.html?bbox=${pin.lon - 0.003},${pin.lat - 0.002},${pin.lon + 0.003},${pin.lat + 0.002}&layer=mapnik&marker=${pin.lat},${pin.lon}`
  return (
    <div className="mt-3 rounded-xl overflow-hidden border" style={{ borderColor: '#D1FAE5' }}>
      <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold" style={{ background: '#D1FAE5', color: '#065F46' }}>
        <span>📍</span>
        <span className="truncate">{pin.label}</span>
        <a
          href={`https://www.openstreetmap.org/?mlat=${pin.lat}&mlon=${pin.lon}#map=${zoom}/${pin.lat}/${pin.lon}`}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto shrink-0 underline"
        >
          Abrir mapa ↗
        </a>
      </div>
      <iframe
        src={url}
        width="100%"
        height="200"
        style={{ border: 0, display: 'block' }}
        title="Localização no mapa"
        loading="lazy"
      />
    </div>
  )
}

const ACCEPTED_TYPES = 'image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime,video/webm'
const MAX_FILES = 5
const MAX_SIZE_MB = 50

export default function DenunciaForm() {
  const supabase = createClient()

  const [formState, setFormState] = useState<FormState>('idle')
  const [protocolo, setProtocolo] = useState('')
  const [anonima, setAnonima] = useState(false)
  const [tiposSelecionados, setTiposSelecionados] = useState<string[]>([])
  const [errorMsg, setErrorMsg] = useState('')

  // Mapa
  const [mapPin, setMapPin] = useState<MapPin | null>(null)
  const [geocoding, setGeocoding] = useState(false)
  const enderecoRef = useRef<HTMLInputElement>(null)
  const bairroRef = useRef<HTMLInputElement>(null)
  const cidadeRef = useRef<HTMLInputElement>(null)

  // Anexos
  const [arquivos, setArquivos] = useState<File[]>([])
  const [uploadErro, setUploadErro] = useState('')

  function toggleTipo(tipo: string) {
    setTiposSelecionados(prev =>
      prev.includes(tipo) ? prev.filter(t => t !== tipo) : [...prev, tipo]
    )
  }

  const buscarNoMapa = useCallback(async () => {
    const endereco = enderecoRef.current?.value ?? ''
    const bairro = bairroRef.current?.value ?? ''
    const cidade = cidadeRef.current?.value ?? 'Realeza'
    const query = [endereco, bairro, cidade].filter(Boolean).join(', ')
    if (!query.trim()) return
    setGeocoding(true)
    const pin = await geocodeAddress(query)
    setGeocoding(false)
    if (pin) setMapPin(pin)
    else setErrorMsg('Endereço não encontrado no mapa. Verifique os campos.')
  }, [])

  const usarLocalizacao = useCallback(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      pos => setMapPin({ lat: pos.coords.latitude, lon: pos.coords.longitude, label: 'Sua localização atual' }),
      () => setErrorMsg('Não foi possível obter sua localização.')
    )
  }, [])

  function handleArquivos(e: React.ChangeEvent<HTMLInputElement>) {
    setUploadErro('')
    const novos = Array.from(e.target.files ?? [])
    const todos = [...arquivos, ...novos].slice(0, MAX_FILES)
    const grandes = todos.filter(f => f.size > MAX_SIZE_MB * 1024 * 1024)
    if (grandes.length) { setUploadErro(`Arquivo muito grande. Máximo ${MAX_SIZE_MB}MB por arquivo.`); return }
    setArquivos(todos)
  }

  function removerArquivo(idx: number) {
    setArquivos(prev => prev.filter((_, i) => i !== idx))
  }

  async function uploadAnexos(denunciaId: string): Promise<string[]> {
    const urls: string[] = []
    for (const arquivo of arquivos) {
      const ext = arquivo.name.split('.').pop()
      const path = `${denunciaId}/${Date.now()}.${ext}`
      const { error } = await supabase.storage
        .from('denuncias-anexos')
        .upload(path, arquivo, { cacheControl: '3600', upsert: false })
      if (!error) {
        const { data } = supabase.storage.from('denuncias-anexos').getPublicUrl(path)
        urls.push(data.publicUrl)
      }
    }
    return urls
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (tiposSelecionados.length === 0) {
      setErrorMsg('Selecione pelo menos um tipo de abuso.')
      return
    }

    const tiposValidos = tiposSelecionados.filter(t => ALLOWED_TIPOS.has(t))
    if (tiposValidos.length === 0) {
      setErrorMsg('Tipo de abuso inválido.')
      return
    }

    setFormState('sending')
    setErrorMsg('')

    const fd = new FormData(e.currentTarget)

    const contatoEmail = anonima ? null : sanitizeText((fd.get('contato_email') as string) || '', 254)
    if (contatoEmail && !isValidEmail(contatoEmail)) {
      setFormState('idle')
      setErrorMsg('E-mail inválido.')
      return
    }

    const payload = {
      endereco:      sanitizeText(fd.get('endereco') as string, 500),
      bairro:        sanitizeText((fd.get('bairro') as string) || '', 100) || null,
      cidade:        sanitizeText((fd.get('cidade') as string) || 'Realeza', 100),
      estado:        'PR',
      tipo_animal:   sanitizeText(fd.get('tipo_animal') as string, 50),
      qtd_animais:   sanitizeText((fd.get('qtd_animais') as string) || '', 100) || null,
      tipo_abuso:    tiposValidos,
      descricao:     sanitizeText(fd.get('descricao') as string, 2000),
      frequencia:    sanitizeText((fd.get('frequencia') as string) || '', 50) || null,
      suspeito_desc: sanitizeText((fd.get('suspeito_desc') as string) || '', 500) || null,
      latitude:      mapPin?.lat ?? null,
      longitude:     mapPin?.lon ?? null,
      anonima,
      contato_nome:  anonima ? null : sanitizeText((fd.get('contato_nome') as string) || '', 150) || null,
      contato_tel:   anonima ? null : sanitizeText((fd.get('contato_tel') as string) || '', 20) || null,
      contato_email: contatoEmail || null,
      status:        'nova',
    }

    try {
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

      // Upload de anexos (não bloqueia se falhar)
      if (arquivos.length > 0) {
        await uploadAnexos(data.id)
      }

      setProtocolo(data.id.slice(0, 8).toUpperCase())
      setFormState('success')
    } catch {
      setFormState('error')
      setErrorMsg('Erro inesperado. Tente novamente ou ligue para a AMAA.')
    }
  }

  // ── Sucesso ──────────────────────────────────────────────────────────────
  if (formState === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h3 className="text-2xl font-black text-green-800 mb-2">Denúncia registrada!</h3>
        <p className="text-green-700 mb-4">Seu protocolo de atendimento é:</p>
        <div className="inline-block bg-white border-2 border-green-400 rounded-xl px-8 py-3 mb-6">
          <span className="text-3xl font-black text-green-700 tracking-widest">#{protocolo}</span>
        </div>
        <p className="text-sm text-green-700 mb-6">
          A AMAA analisará a denúncia e tomará as providências cabíveis.
          Em casos de emergência, ligue para a{' '}
          <strong>Polícia Ambiental: 0800 041 2897</strong> ou <strong>PM: 190</strong>.
        </p>
        <button
          onClick={() => { setFormState('idle'); setTiposSelecionados([]); setAnonima(false); setMapPin(null); setArquivos([]) }}
          className="text-green-600 hover:text-green-800 font-semibold text-sm underline"
        >
          Fazer outra denúncia
        </button>
      </div>
    )
  }

  // ── Formulário ───────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* LOCALIZAÇÃO */}
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
              ref={enderecoRef}
              name="endereco"
              required
              placeholder="Rua, número, ponto de referência..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
            <input
              ref={bairroRef}
              name="bairro"
              placeholder="Bairro ou localidade"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
            <input
              ref={cidadeRef}
              name="cidade"
              placeholder="Realeza"
              defaultValue="Realeza"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Botões do mapa */}
        <div className="flex gap-2 mt-3 flex-wrap">
          <button
            type="button"
            onClick={buscarNoMapa}
            disabled={geocoding}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
            style={{ background: '#D1FAE5', color: '#065F46' }}
          >
            {geocoding ? '⏳ Buscando...' : '🗺️ Ver no mapa'}
          </button>
          <button
            type="button"
            onClick={usarLocalizacao}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
            style={{ background: '#EFF6FF', color: '#1D4ED8' }}
          >
            📡 Usar minha localização
          </button>
        </div>

        {mapPin && <MapPreview pin={mapPin} />}
      </div>

      {/* ANIMAL */}
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

      {/* TIPO DE ABUSO */}
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

      {/* DESCRIÇÃO */}
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

      {/* FREQUÊNCIA E SUSPEITO */}
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

      {/* ANEXOS */}
      <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-1 flex items-center gap-2">
          <span className="text-orange-500">📎</span> Fotos ou vídeos (opcional)
        </h3>
        <p className="text-xs text-gray-500 mb-3">
          Até {MAX_FILES} arquivos · JPG, PNG, MP4 · máx {MAX_SIZE_MB}MB cada
        </p>
        <label className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-gray-300 rounded-xl p-4 cursor-pointer hover:border-emerald-400 transition-colors">
          <span className="text-2xl">📂</span>
          <span className="text-sm text-gray-600 font-medium">Selecionar arquivos</span>
          <input
            type="file"
            multiple
            accept={ACCEPTED_TYPES}
            onChange={handleArquivos}
            className="hidden"
          />
        </label>
        {arquivos.length > 0 && (
          <ul className="mt-3 space-y-1">
            {arquivos.map((f, i) => (
              <li key={i} className="flex items-center justify-between text-xs bg-white rounded-lg px-3 py-2 border border-gray-100">
                <span className="truncate text-gray-700">{f.name}</span>
                <button type="button" onClick={() => removerArquivo(i)} className="ml-2 text-red-400 hover:text-red-600 shrink-0">✕</button>
              </li>
            ))}
          </ul>
        )}
        {uploadErro && <p className="text-xs text-red-600 mt-2">{uploadErro}</p>}
      </div>

      {/* ANONIMATO */}
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

      {/* DADOS DO DENUNCIANTE */}
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

      {/* ERRO */}
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={formState === 'sending'}
        className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-black py-4 rounded-xl transition-colors text-base"
      >
        {formState === 'sending' ? '⏳ Enviando denúncia...' : '🚨 Enviar Denúncia'}
      </button>

    </form>
  )
}
