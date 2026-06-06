import { useSiteConfig } from '../context/SiteConfigContext.jsx'
import PageHero from '../components/PageHero.jsx'

export default function About() {
  const { config } = useSiteConfig()
  const values = (config.values || '')
    .split(/[•|\n,;]/)
    .map((v) => v.trim())
    .filter(Boolean)

  return (
    <>
      <PageHero
        title={config.aboutTitle || 'Sobre nós'}
        subtitle={config.message}
        image={config.aboutImageUrl}
      />

      <section className="section">
        <div className="container-x grid items-start gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Nossa história</p>
            <h2 className="heading mt-3">{config.nameChurch}</h2>
            <p className="mt-5 whitespace-pre-line text-base leading-relaxed text-slate-600">
              {config.aboutText}
            </p>
          </div>
          {config.aboutImageUrl && (
            <img
              src={config.aboutImageUrl}
              alt={config.nameChurch}
              className="w-full rounded-3xl object-cover shadow-xl"
            />
          )}
        </div>
      </section>

      <section className="section bg-slate-50">
        <div className="container-x grid gap-6 md:grid-cols-3">
          <div className="card p-8">
            <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-brand/10 text-brand">✦</div>
            <h3 className="font-serif text-xl font-bold text-brand-dark">Missão</h3>
            <p className="mt-3 text-sm text-slate-500">{config.mission}</p>
          </div>
          <div className="card p-8">
            <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-brand/10 text-brand">◎</div>
            <h3 className="font-serif text-xl font-bold text-brand-dark">Visão</h3>
            <p className="mt-3 text-sm text-slate-500">{config.vision}</p>
          </div>
          <div className="card p-8">
            <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-brand/10 text-brand">♥</div>
            <h3 className="font-serif text-xl font-bold text-brand-dark">Valores</h3>
            {values.length ? (
              <ul className="mt-3 space-y-1 text-sm text-slate-500">
                {values.map((v, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-accent">•</span> {v}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-slate-500">{config.values}</p>
            )}
          </div>
        </div>
      </section>

      {config.shepherdName && (
        <section className="section">
          <div className="container-x">
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-100 sm:flex-row sm:text-left">
              {config.pastorPhotoUrl && (
                <img
                  src={config.pastorPhotoUrl}
                  alt={config.shepherdName}
                  className="h-32 w-32 flex-shrink-0 rounded-full object-cover ring-4 ring-accent/30"
                />
              )}
              <div>
                <p className="eyebrow">Liderança</p>
                <h3 className="mt-2 font-serif text-2xl font-bold text-brand-dark">
                  {config.shepherdName}
                </h3>
                <p className="mt-3 italic text-slate-500">“{config.message}”</p>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
