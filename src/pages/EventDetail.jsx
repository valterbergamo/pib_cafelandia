import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getOne } from '../api/client.js'
import { formatDateTime } from '../lib/format.js'
import Loader from '../components/Loader.jsx'

export default function EventDetail() {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    getOne('Events', id)
      .then(setEvent)
      .catch(() => setError(true))
  }, [id])

  if (error)
    return (
      <div className="container-x py-32 text-center">
        <p className="text-slate-500">Evento não encontrado.</p>
        <Link to="/eventos" className="btn-primary mt-6">
          Voltar para eventos
        </Link>
      </div>
    )

  if (!event) return <Loader />

  const img =
    event.imageUrl ||
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1600&q=80'

  return (
    <article>
      <div className="relative h-[45vh] min-h-[300px] overflow-hidden bg-brand-dark">
        <img src={img} alt={event.title} className="h-full w-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark to-transparent" />
        <div className="container-x absolute inset-x-0 bottom-0 pb-10 text-white">
          {event.highlight && (
            <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-brand-dark">
              Destaque
            </span>
          )}
          <h1 className="mt-3 font-serif text-3xl font-bold sm:text-5xl">{event.title}</h1>
          {event.datetime && (
            <p className="mt-2 text-accent">{formatDateTime(event.datetime)}</p>
          )}
        </div>
      </div>

      <div className="container-x py-14">
        <div className="mx-auto max-w-3xl">
          <Link to="/eventos" className="mb-8 inline-flex items-center gap-1 text-sm font-semibold text-brand">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M11 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Voltar
          </Link>

          {event.location && (
            <p className="mb-6 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600">
              📍 {event.location}
            </p>
          )}

          <p className="text-lg leading-relaxed text-slate-600">{event.description}</p>

          {event.contentText && (
            <div className="prose mt-6 max-w-none whitespace-pre-line text-slate-700">
              {event.contentText}
            </div>
          )}

          {event.author && (
            <p className="mt-10 text-sm text-slate-400">Publicado por {event.author}</p>
          )}
        </div>
      </div>
    </article>
  )
}
