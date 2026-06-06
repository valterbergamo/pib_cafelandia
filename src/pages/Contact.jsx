import { useState } from 'react'
import { useSiteConfig } from '../context/SiteConfigContext.jsx'
import { create } from '../api/client.js'
import PageHero from '../components/PageHero.jsx'

export default function Contact() {
  const { config } = useSiteConfig()
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [status, setStatus] = useState({ type: '', msg: '' })
  const [sending, setSending] = useState(false)

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function submit(e) {
    e.preventDefault()
    setSending(true)
    setStatus({ type: '', msg: '' })
    try {
      await create('Subscriptions', {
        name: form.name,
        email: form.email,
        phone: form.phone,
        datetime: new Date().toISOString(),
        active: true,
      })
      setStatus({ type: 'ok', msg: 'Recebemos seus dados! Em breve entraremos em contato. 🙏' })
      setForm({ name: '', email: '', phone: '' })
    } catch (err) {
      setStatus({ type: 'error', msg: 'Não foi possível enviar. Tente novamente mais tarde.' })
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <PageHero
        title="Fale conosco"
        subtitle="Queremos conhecer você. Deixe seus dados ou venha nos visitar!"
        image={config.heroImageUrl}
      />
      <section className="section">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          {/* Infos */}
          <div>
            <p className="eyebrow">Contato</p>
            <h2 className="heading mt-3">Estamos à sua disposição</h2>
            <ul className="mt-8 space-y-5">
              {config.address && (
                <li className="flex gap-4">
                  <span className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">📍</span>
                  <div>
                    <p className="font-semibold text-brand-dark">Endereço</p>
                    <p className="text-sm text-slate-500">{config.address}</p>
                  </div>
                </li>
              )}
              {config.phone && (
                <li className="flex gap-4">
                  <span className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">📞</span>
                  <div>
                    <p className="font-semibold text-brand-dark">Telefone</p>
                    <p className="text-sm text-slate-500">{config.phone}</p>
                  </div>
                </li>
              )}
              {config.email && (
                <li className="flex gap-4">
                  <span className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">✉️</span>
                  <div>
                    <p className="font-semibold text-brand-dark">E-mail</p>
                    <a href={`mailto:${config.email}`} className="text-sm text-slate-500 hover:text-brand">
                      {config.email}
                    </a>
                  </div>
                </li>
              )}
              {config.whatsapp && (
                <li className="flex gap-4">
                  <span className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">💬</span>
                  <div>
                    <p className="font-semibold text-brand-dark">WhatsApp</p>
                    <a
                      href={`https://wa.me/${config.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-slate-500 hover:text-brand"
                    >
                      {config.whatsapp}
                    </a>
                  </div>
                </li>
              )}
            </ul>

            {config.mapsEmbedUrl && (
              <div className="mt-8 overflow-hidden rounded-2xl shadow-sm ring-1 ring-slate-100">
                <iframe
                  title="Mapa"
                  src={config.mapsEmbedUrl}
                  className="h-64 w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}
          </div>

          {/* Formulário */}
          <div className="card p-8">
            <h3 className="font-serif text-xl font-bold text-brand-dark">Quero receber novidades</h3>
            <p className="mt-2 text-sm text-slate-500">
              Deixe seus dados e nossa equipe entrará em contato.
            </p>
            <form onSubmit={submit} className="mt-6 space-y-4">
              <div>
                <label className="label">Nome completo</label>
                <input name="name" value={form.name} onChange={update} required className="input" />
              </div>
              <div>
                <label className="label">E-mail</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={update}
                  required
                  className="input"
                />
              </div>
              <div>
                <label className="label">Telefone / WhatsApp</label>
                <input name="phone" value={form.phone} onChange={update} className="input" />
              </div>
              <button type="submit" disabled={sending} className="btn-primary w-full">
                {sending ? 'Enviando...' : 'Enviar'}
              </button>
              {status.msg && (
                <p
                  className={`rounded-lg px-4 py-3 text-sm ${
                    status.type === 'ok'
                      ? 'bg-green-50 text-green-700'
                      : 'bg-red-50 text-red-700'
                  }`}
                >
                  {status.msg}
                </p>
              )}
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
