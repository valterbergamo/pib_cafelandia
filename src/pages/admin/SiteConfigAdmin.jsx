import { useEffect, useMemo, useState } from 'react'
import { list, create, update } from '../../api/client.js'
import { useSiteConfig } from '../../context/SiteConfigContext.jsx'
import Field from '../../components/admin/Field.jsx'
import Loader from '../../components/Loader.jsx'

const GROUPS = [
  {
    id: 'identidade',
    label: 'Identidade',
    fields: [
      { name: 'nameChurch', label: 'Nome da igreja', required: true, full: true },
      { name: 'logoUrl', label: 'Logo (URL)', type: 'url', full: true },
      { name: 'faviconUrl', label: 'Favicon (URL)', type: 'url', full: true },
    ],
  },
  {
    id: 'tema',
    label: 'Cores / Tema',
    fields: [
      { name: 'primaryColor', label: 'Cor primária', type: 'color' },
      { name: 'secondaryColor', label: 'Cor secundária', type: 'color' },
      { name: 'accentColor', label: 'Cor de destaque', type: 'color' },
    ],
  },
  {
    id: 'hero',
    label: 'Banner (Hero)',
    fields: [
      { name: 'heroTitle', label: 'Título do banner', full: true },
      { name: 'heroSubtitle', label: 'Subtítulo', type: 'textarea', rows: 2, full: true },
      { name: 'heroImageUrl', label: 'Imagem de fundo (URL)', type: 'url', full: true },
      { name: 'heroCtaText', label: 'Texto do botão' },
      { name: 'heroCtaLink', label: 'Link do botão', help: 'Ex.: /agenda' },
    ],
  },
  {
    id: 'sobre',
    label: 'Sobre',
    fields: [
      { name: 'message', label: 'Frase principal', full: true },
      { name: 'aboutTitle', label: 'Título da seção sobre', full: true },
      { name: 'aboutText', label: 'Texto sobre a igreja', type: 'textarea', rows: 5, full: true },
      { name: 'aboutImageUrl', label: 'Imagem (URL)', type: 'url', full: true },
      { name: 'mission', label: 'Missão', type: 'textarea', rows: 2, full: true },
      { name: 'vision', label: 'Visão', type: 'textarea', rows: 2, full: true },
      { name: 'values', label: 'Valores', type: 'textarea', rows: 2, full: true, help: 'Separe por • ou vírgula.' },
    ],
  },
  {
    id: 'pastor',
    label: 'Pastor',
    fields: [
      { name: 'shepherdName', label: 'Nome do pastor' },
      { name: 'pastorPhotoUrl', label: 'Foto (URL)', type: 'url' },
    ],
  },
  {
    id: 'contato',
    label: 'Contato',
    fields: [
      { name: 'address', label: 'Endereço', full: true },
      { name: 'phone', label: 'Telefone' },
      { name: 'whatsapp', label: 'WhatsApp', help: 'Com DDD, ex.: 45999998888' },
      { name: 'email', label: 'E-mail', type: 'email' },
      { name: 'serviceNote', label: 'Observação de horários', full: true },
      { name: 'mapsEmbedUrl', label: 'URL do mapa (Google Maps embed)', full: true, help: 'Cole o src do iframe do Google Maps.' },
    ],
  },
  {
    id: 'redes',
    label: 'Redes sociais',
    fields: [
      { name: 'instagram', label: 'Instagram (URL)', type: 'url' },
      { name: 'facebook', label: 'Facebook (URL)', type: 'url' },
      { name: 'youtube', label: 'YouTube (URL)', type: 'url' },
    ],
  },
  {
    id: 'contribuicao',
    label: 'Contribuição',
    fields: [
      { name: 'pix', label: 'Chave PIX', full: true },
      { name: 'bankDetail', label: 'Dados bancários', type: 'textarea', rows: 4, full: true },
    ],
  },
  {
    id: 'rodape',
    label: 'Rodapé / Privacidade',
    fields: [
      { name: 'footerText', label: 'Texto do rodapé', type: 'textarea', rows: 2, full: true },
      { name: 'privacyPolicy', label: 'Política de privacidade', type: 'textarea', rows: 6, full: true },
    ],
  },
]

export default function SiteConfigAdmin() {
  const { refresh } = useSiteConfig()
  const [recordId, setRecordId] = useState(null)
  const [form, setForm] = useState(null)
  const [active, setActive] = useState('identidade')
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState({ type: '', msg: '' })

  useEffect(() => {
    list('Configuration', { top: 1 })
      .then((rows) => {
        if (rows && rows.length) {
          setRecordId(rows[0].ID)
          setForm(rows[0])
        } else {
          setForm({})
        }
      })
      .catch(() => setForm({}))
  }, [])

  function set(name, value) {
    setForm((p) => ({ ...p, [name]: value }))
  }

  const allFields = useMemo(() => GROUPS.flatMap((g) => g.fields), [])

  async function save(e) {
    e.preventDefault()
    setSaving(true)
    setStatus({ type: '', msg: '' })
    try {
      // Monta payload apenas com os campos conhecidos
      const payload = {}
      allFields.forEach((f) => {
        if (form[f.name] !== undefined) payload[f.name] = form[f.name]
      })
      if (recordId) {
        await update('Configuration', recordId, payload)
      } else {
        const created = await create('Configuration', payload)
        if (created?.ID) setRecordId(created.ID)
      }
      await refresh()
      setStatus({ type: 'ok', msg: 'Configurações salvas com sucesso! ✓' })
    } catch (err) {
      setStatus({ type: 'error', msg: err.message })
    } finally {
      setSaving(false)
    }
  }

  if (!form) return <Loader />

  const group = GROUPS.find((g) => g.id === active)

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-slate-800">Configuração do site</h1>
        <p className="text-sm text-slate-500">
          Tudo que aparece no site público é controlado aqui.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        {/* Abas */}
        <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          {GROUPS.map((g) => (
            <button
              key={g.id}
              onClick={() => setActive(g.id)}
              className={`whitespace-nowrap rounded-lg px-4 py-2.5 text-left text-sm font-medium transition ${
                active === g.id
                  ? 'bg-brand text-white shadow'
                  : 'bg-white text-slate-600 ring-1 ring-slate-100 hover:bg-slate-50'
              }`}
            >
              {g.label}
            </button>
          ))}
        </nav>

        {/* Formulário */}
        <form onSubmit={save}>
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <h2 className="mb-5 font-serif text-lg font-bold text-slate-800">{group.label}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {group.fields.map((f) => (
                <Field key={f.name} field={f} value={form[f.name]} onChange={set} />
              ))}
            </div>
          </div>

          <div className="sticky bottom-0 mt-4 flex items-center justify-between gap-4 rounded-xl bg-white/90 p-4 shadow-lg ring-1 ring-slate-100 backdrop-blur">
            {status.msg ? (
              <p className={`text-sm ${status.type === 'ok' ? 'text-green-600' : 'text-red-600'}`}>
                {status.msg}
              </p>
            ) : (
              <p className="text-sm text-slate-400">As alterações refletem no site após salvar.</p>
            )}
            <button type="submit" disabled={saving} className="admin-btn bg-brand text-white hover:bg-brand-light">
              {saving ? 'Salvando...' : 'Salvar alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
