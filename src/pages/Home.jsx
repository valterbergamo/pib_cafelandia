import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSiteConfig } from '../context/SiteConfigContext.jsx'
import { list } from '../api/client.js'
import { weekdayName, formatTime } from '../lib/format.js'
import SectionHeader from '../components/SectionHeader.jsx'
import EventCard from '../components/EventCard.jsx'

export default function Home() {
  const { config } = useSiteConfig()
  const [events, setEvents] = useState([])
  const [schedules, setSchedules] = useState([])

  useEffect(() => {
    list('Events', { filter: 'active eq true', orderby: 'datetime desc', top: 6 })
      .then(setEvents)
      .catch(() => {})
    list('Schedules', { filter: 'active eq true', orderby: 'dayOfWeek asc' })
      .then(setSchedules)
      .catch(() => {})
  }, [])

  return (
    <>
      {/* HERO */}
      <section className="relative flex min-h-[88vh] items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={config.heroImageUrl} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/90 via-brand-dark/70 to-brand-dark/40" />
        </div>
        <div className="container-x relative py-24 text-white">
          <div className="max-w-2xl animate-fade-up">
            <p className="eyebrow">{config.nameChurch}</p>
            <h1 className="mt-4 font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              {config.heroTitle}
            </h1>
            <p className="mt-6 max-w-xl text-lg text-slate-200">{config.heroSubtitle}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to={config.heroCtaLink || '/agenda'} className="btn-accent">
                {config.heroCtaText || 'Participe'}
              </Link>
              <Link to="/sobre" className="btn-outline">
                Conheça a igreja
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SOBRE / MISSÃO */}
      <section className="section">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <div className="relative">
            <img
              src={config.aboutImageUrl}
              alt={config.aboutTitle}
              className="aspect-[4/3] w-full rounded-3xl object-cover shadow-xl"
            />
            <div className="absolute -bottom-6 -right-2 hidden rounded-2xl bg-accent px-6 py-4 text-brand-dark shadow-lg sm:block">
              <p className="font-serif text-lg font-bold">Venha como você é</p>
              <p className="text-sm">Todos são bem-vindos</p>
            </div>
          </div>
          <div>
            <p className="eyebrow">{config.aboutTitle}</p>
            <h2 className="heading mt-3">{config.message}</h2>
            <p className="mt-5 text-base leading-relaxed text-slate-600">{config.aboutText}</p>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-5">
                <h3 className="font-semibold text-brand-dark">Nossa missão</h3>
                <p className="mt-2 text-sm text-slate-500">{config.mission}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-5">
                <h3 className="font-semibold text-brand-dark">Nossa visão</h3>
                <p className="mt-2 text-sm text-slate-500">{config.vision}</p>
              </div>
            </div>
            <Link to="/sobre" className="btn-primary mt-8">
              Saiba mais sobre nós
            </Link>
          </div>
        </div>
      </section>

      {/* HORÁRIOS */}
      {schedules.length > 0 && (
        <section className="section bg-brand-dark">
          <div className="container-x">
            <SectionHeader
              eyebrow="Agenda semanal"
              title="Horários de culto"
              subtitle={config.serviceNote || 'Participe das nossas reuniões. Esperamos por você!'}
              light
            />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {schedules.map((s) => (
                <div
                  key={s.ID}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white backdrop-blur transition hover:bg-white/10"
                >
                  <p className="text-sm font-semibold uppercase tracking-wide text-accent">
                    {weekdayName(s.dayOfWeek)}
                  </p>
                  <h3 className="mt-1 font-serif text-xl font-bold">{s.title}</h3>
                  {s.hour && <p className="mt-2 text-2xl font-bold">{formatTime(s.hour)}</p>}
                  {s.description && <p className="mt-2 text-sm text-slate-300">{s.description}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* EVENTOS */}
      {events.length > 0 && (
        <section className="section">
          <div className="container-x">
            <SectionHeader
              eyebrow="Fique por dentro"
              title="Próximos eventos"
              subtitle="Acompanhe o que está acontecendo na nossa comunidade."
            />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.slice(0, 3).map((e) => (
                <EventCard key={e.ID} event={e} />
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link to="/eventos" className="btn-ghost">
                Ver todos os eventos
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA OFERTA */}
      <section className="section bg-slate-50">
        <div className="container-x">
          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand to-brand-light px-8 py-14 text-center text-white sm:px-16">
            <h2 className="font-serif text-3xl font-bold sm:text-4xl">Faça parte da obra</h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-200">
              Sua contribuição sustenta missões, ações sociais e o cuidado com a nossa comunidade.
            </p>
            <Link to="/contribua" className="btn-accent mt-8">
              Quero contribuir
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
