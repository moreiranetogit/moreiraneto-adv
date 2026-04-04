'use client'
// Modal de cadastro de animal — voluntárias e admin
import { useState } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const TEMPERAMENTO_OPTIONS = [
  'Dócil', 'Brincalhão', 'Tímido', 'Curioso', 'Amoroso',
  'Independente', 'Protetor', 'Calmo', 'Agitado',
]

const CONVIVENCIA_OPTIONS = [
  'Com crianças', 'Com adultos', 'Com outros cães', 'Com gatos',
  'Sem outros animais', 'Apartamento', 'Casa com quintal',
]

export default function AnimalFormModal() {
  const supabase = createBrowserClient()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [temperamentos, setTemperamentos] = useState<string[]>([])
  const [convivencias, setConvivencias] = useState<string[]>([])

  function toggle(list: string[], item: string): string[] {
    return list.includes(item) ? list.filter(i => i !== item) : [...list, item]
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const fd = new FormData(e.currentTarget)

    const payload = {
      nome:            fd.get('nome') as string,
      especie:         fd.get('especie') as string,
      raca:            (fd.get('raca') as string) || null,
      sexo:            fd.get('sexo') as string,
      porte:           fd.get('porte') as string,
      idade_categoria: fd.get('idade_categoria') as string,
      situacao:        (fd.get('situacao') as string) || 'abrigo',
      temperamento:    temperamentos,
      convivencia:     convivencias,
      comportamento:   (fd.get('comportamento') as string) || null,
      castrado:        fd.get('castrado') as string,
      vacinado:        fd.get('vacinado') as string,
      vermifugado:     fd.get('vermifugado') as string,
      antipulga:       fd.get('antipulga') as string,
      microchip:       fd.get('microchip') as string,
      tratamento_ativo: fd.get('tratamento_ativo') === 'on',
      obs_saude:       (fd.get('obs_saude') as string) || null,
      descricao:       fd.get('descricao') as string,
      adotante_ideal:  (fd.get('adotante_ideal') as string) || null,
      urgencia:        fd.get('urgencia') as string,
      status:          'pending',
    }

    const { error: err } = await supabase.from('animals').insert(payload)

    if (err) {
      setError('Erro ao cadastrar animal. Tente novamente.')
      setSaving(false)
      return
    }

    setSuccess(true)
    setSaving(false)
    setTimeout(() => {
      setOpen(false)
      setSuccess(false)
      setTemperamentos([])
      setConvivencias([])
      router.refresh()
    }, 1500)
  }

  const inputCls = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
  const selectCls = `${inputCls} bg-white`
  const labelCls = "block text-xs font-semibold text-gray-600 mb-1"

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors"
      >
        + Cadastrar Animal
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 pb-8 px-4 overflow-y-auto"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl relative">

            {/* Header modal */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/amaa-logo-web.png" alt="" className="w-8 h-8 rounded-2xl object-contain" />
                <h2 className="font-black text-gray-900">Cadastrar Novo Animal</h2>
              </div>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
            </div>

            {success ? (
              <div className="p-12 text-center">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-green-800">Animal cadastrado!</h3>
                <p className="text-green-600 text-sm mt-2">Aguardando revisão do administrador.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">

                {/* Identificação */}
                <div>
                  <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                    🐾 Identificação
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2 sm:col-span-1">
                      <label className={labelCls}>Nome *</label>
                      <input name="nome" required placeholder="Nome do animal" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Espécie *</label>
                      <select name="especie" required className={selectCls}>
                        <option value="cachorro">🐶 Cachorro</option>
                        <option value="gato">🐱 Gato</option>
                        <option value="outro">Outro</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Raça</label>
                      <input name="raca" placeholder="SRD se não souber" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Sexo *</label>
                      <select name="sexo" required className={selectCls}>
                        <option value="macho">♂ Macho</option>
                        <option value="femea">♀ Fêmea</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Porte *</label>
                      <select name="porte" required className={selectCls}>
                        <option value="pequeno">Pequeno</option>
                        <option value="medio">Médio</option>
                        <option value="grande">Grande</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Faixa etária *</label>
                      <select name="idade_categoria" required className={selectCls}>
                        <option value="filhote">Filhote (&lt;1 ano)</option>
                        <option value="jovem">Jovem (1-3 anos)</option>
                        <option value="adulto">Adulto (3-8 anos)</option>
                        <option value="senior">Sênior (+8 anos)</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Situação atual</label>
                      <select name="situacao" className={selectCls}>
                        <option value="abrigo">Em abrigo/lar temporário</option>
                        <option value="rua">Resgate de rua</option>
                        <option value="abandono">Abandonado</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Saúde */}
                <div>
                  <h3 className="text-sm font-bold text-gray-800 mb-3">🏥 Saúde</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {[
                      { name: 'castrado',    label: 'Castrado' },
                      { name: 'vacinado',    label: 'Vacinado' },
                      { name: 'vermifugado', label: 'Vermifugado' },
                      { name: 'antipulga',   label: 'Antipulga' },
                      { name: 'microchip',   label: 'Microchip' },
                    ].map(f => (
                      <div key={f.name}>
                        <label className={labelCls}>{f.label}</label>
                        <select name={f.name} className={selectCls}>
                          <option value="nao_sabe">Não sei</option>
                          <option value="sim">Sim</option>
                          <option value="nao">Não</option>
                        </select>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <input type="checkbox" id="tratamento_ativo" name="tratamento_ativo" className="accent-emerald-600" />
                    <label htmlFor="tratamento_ativo" className="text-sm text-gray-600">Animal está em tratamento médico ativo</label>
                  </div>
                  <div className="mt-2">
                    <label className={labelCls}>Observações de saúde</label>
                    <textarea name="obs_saude" rows={2} placeholder="Condições especiais, medicamentos..." className={`${inputCls} resize-none`} />
                  </div>
                </div>

                {/* Temperamento */}
                <div>
                  <h3 className="text-sm font-bold text-gray-800 mb-3">😸 Temperamento</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {TEMPERAMENTO_OPTIONS.map(t => (
                      <button key={t} type="button"
                        onClick={() => setTemperamentos(prev => toggle(prev, t))}
                        className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                          temperamentos.includes(t)
                            ? 'bg-emerald-700 text-white border-emerald-700'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-400'
                        }`}>
                        {t}
                      </button>
                    ))}
                  </div>
                  <div>
                    <label className={labelCls}>Convivência</label>
                    <div className="flex flex-wrap gap-2">
                      {CONVIVENCIA_OPTIONS.map(c => (
                        <button key={c} type="button"
                          onClick={() => setConvivencias(prev => toggle(prev, c))}
                          className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                            convivencias.includes(c)
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400'
                          }`}>
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Descrição e urgência */}
                <div>
                  <h3 className="text-sm font-bold text-gray-800 mb-3">📝 Descrição</h3>
                  <div className="space-y-3">
                    <div>
                      <label className={labelCls}>Descrição *</label>
                      <textarea name="descricao" required rows={3}
                        placeholder="Conte a história do animal, personalidade, o que mais gosta..."
                        className={`${inputCls} resize-none`} />
                    </div>
                    <div>
                      <label className={labelCls}>Adotante ideal</label>
                      <textarea name="adotante_ideal" rows={2}
                        placeholder="Tipo de lar ideal, requisitos para adoção..."
                        className={`${inputCls} resize-none`} />
                    </div>
                    <div>
                      <label className={labelCls}>Comportamento adicional</label>
                      <textarea name="comportamento" rows={2}
                        placeholder="Algo específico sobre o comportamento..."
                        className={`${inputCls} resize-none`} />
                    </div>
                    <div>
                      <label className={labelCls}>🚨 Urgência de adoção</label>
                      <select name="urgencia" className={selectCls}>
                        <option value="normal">Normal</option>
                        <option value="alta">Alta — precisa de lar logo</option>
                        <option value="critica">Crítica — risco de vida</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Fotos */}
                <div className="bg-gray-50 rounded-xl p-4 border border-dashed border-gray-200 text-center">
                  <p className="text-sm text-gray-500 mb-2">📷 Fotos</p>
                  <p className="text-xs text-gray-400">
                    Após cadastrar, o administrador pode adicionar as fotos diretamente pelo painel.
                    Você também pode enviar pelo WhatsApp da AMAA.
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                    ⚠️ {error}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setOpen(false)}
                    className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl text-sm hover:bg-gray-50 transition-colors">
                    Cancelar
                  </button>
                  <button type="submit" disabled={saving}
                    className="flex-1 bg-emerald-700 hover:bg-emerald-600 disabled:bg-emerald-400 text-white font-bold py-3 rounded-xl text-sm transition-colors">
                    {saving ? '⏳ Cadastrando...' : '🐾 Cadastrar Animal'}
                  </button>
                </div>

              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
