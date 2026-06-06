import { useEffect, useState } from 'react'
import { list } from '../api/client.js'
import PageHero from '../components/PageHero.jsx'
import EventCard from '../components/EventCard.jsx'
import Loader from '../components/Loader.jsx'
import { useSiteConfig } from '../context/SiteConfigContext.jsx'

export default function Events() {
  const { config } = useSiteConfig()
  const [events, setEvents] = useState(null)

  useEffect(() => {
    list('Events', { filter: 'active eq true', orderby: 'datetime desc' })
      .then(setEvents)
      .catch(() => setEvents([]))
  }, [])

  return (
    <>
      <PageHero
        title="Eventos"
        subtitle="Tudo o que está acontecendo na nossa igreja."
        image={config.heroImageUrl}
      />
      <section className="section">
        <div className="container-x">
          {events === null ? (
            <Loader />
          ) : events.length === 0 ? (
            <p className="text-center text-slate-400">Nenhum evento cadastrado ainda.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((e) => (
                <EventCard key={e.ID} event={e} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
