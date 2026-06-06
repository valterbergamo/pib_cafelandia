import { useState } from 'react'
import { useSiteConfig } from '../context/SiteConfigContext.jsx'
import PageHero from '../components/PageHero.jsx'

export default function Give() {
  const { config } = useSiteConfig()
  const [copied, setCopied] = useState(false)

  function copyPix() {
    if (!config.pix) return
    navigator.clipboard?.writeText(config.pix)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <PageHero
        title="Contribua"
        subtitle="“Cada um contribua segundo propôs no seu coração.” — 2 Coríntios 9:7"
        image={config.heroImageUrl}
      />
      <section className="section">
        <div className="container-x">
          <div className="mx-auto max-w-3xl">
            <div className="grid gap-8 md:grid-cols-2">
              {/* PIX */}
              <div className="card p-8">
                <h2 className="font-serif text-2xl font-bold text-brand-dark">PIX</h2>
                <p className="mt-2 text-sm text-slate-500">
                  A forma mais rápida de contribuir com a obra.
                </p>
                {config.pix ? (
                  <>
                    <div className="mt-6 rounded-xl bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-wide text-slate-400">Chave PIX</p>
                      <p className="mt-1 break-all font-mono text-sm text-brand-dark">{config.pix}</p>
                    </div>
                    <button onClick={copyPix} className="btn-primary mt-4 w-full">
                      {copied ? '✓ Chave copiada!' : 'Copiar chave PIX'}
                    </button>
                  </>
                ) : (
                  <p className="mt-6 text-sm text-slate-400">Chave PIX em breve.</p>
                )}
              </div>

              {/* Dados bancários */}
              <div className="card p-8">
                <h2 className="font-serif text-2xl font-bold text-brand-dark">Dados bancários</h2>
                <p className="mt-2 text-sm text-slate-500">Para transferências e depósitos.</p>
                {config.bankDetail ? (
                  <div className="mt-6 whitespace-pre-line rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
                    {config.bankDetail}
                  </div>
                ) : (
                  <p className="mt-6 text-sm text-slate-400">Dados em breve.</p>
                )}
              </div>
            </div>

            <div className="mt-10 rounded-2xl bg-brand/5 p-8 text-center">
              <p className="text-slate-600">
                Toda contribuição é investida em missões, ações sociais e na manutenção da casa de
                Deus. Que o Senhor abençoe a sua generosidade!
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
