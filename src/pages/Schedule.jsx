import { useEffect, useState } from 'react'
import { useSiteConfig } from '../context/SiteConfigContext.jsx'
import { list } from '../api/client.js'
import { weekdayName, formatTime } from '../lib/format.js'
import PageHero from '../components/PageHero.jsx'
import Loader from '../components/Loader.jsx'

export default function Schedule() {
  const { config } = useSiteConfig()
  const [schedules, setSchedules] = useState(null)

  useEffect(() => {
    list('Schedules', { filter: 'active eq true', orderby: 'dayOfWeek asc' })
      .then(setSchedules)
      .catch(() => setSchedules([]))
  }, [])

  // Agrupa por dia da semana
  const grouped = {}
  ;(schedules || []).forEach((s) => {
    const k = s.dayOfWeek ?? 0
    grouped[k] = grouped[k] || []
    grouped[k].push(s)
  })

  return (
    <>
      <PageHero
        title="Agenda semanal"
        subtitle={config.serviceNote || 'Nossos cultos e reuniões durante a semana.'}
        image={config.heroImageUrl}
      />
      <section className="section">
        <div className="container-x">
          {schedules === null ? (
            <Loader />
          ) : schedules.length === 0 ? (
            <p className="text-center text-slate-400">Nenhum horário cadastrado ainda.</p>
          ) : (
            <div className="mx-auto max-w-3xl space-y-8">
              {Object.keys(grouped)
                .sort((a, b) => a - b)
                .map((day) => (
                  <div key={day}>
                    <h2 className="mb-4 font-serif text-2xl font-bold text-brand-dark">
                      {weekdayName(day)}
                    </h2>
                    <div className="space-y-3">
                      {grouped[day]
                        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                        .map((s) => (
                          <div
                            key={s.ID}
                            className="flex items-center gap-5 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100"
                          >
                            <div className="grid w-20 flex-shrink-0 place-items-center rounded-xl bg-brand/10 py-3 text-brand">
                              <span className="text-lg font-bold">{formatTime(s.hour)}</span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-brand-dark">{s.title}</h3>
                              {s.description && (
                                <p className="text-sm text-slate-500">{s.description}</p>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
