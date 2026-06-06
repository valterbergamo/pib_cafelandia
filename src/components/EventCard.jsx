import { Link } from 'react-router-dom'
import { shortDateParts, formatDateTime } from '../lib/format.js'

export default function EventCard({ event }) {
  const { day, month } = shortDateParts(event.datetime)
  const img =
    event.imageUrl ||
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80'

  return (
    <Link to={`/eventos/${event.ID}`} className="card group flex flex-col overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        <img
          src={img}
          alt={event.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {event.datetime && (
          <div className="absolute left-4 top-4 grid w-14 place-items-center rounded-xl bg-white/95 py-2 text-center shadow">
            <span className="text-xl font-bold leading-none text-brand">{day}</span>
            <span className="text-xs font-semibold uppercase text-slate-500">{month}</span>
          </div>
        )}
        {event.highlight && (
          <span className="absolute right-4 top-4 rounded-full bg-accent px-3 py-1 text-xs font-bold text-brand-dark">
            Destaque
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-serif text-lg font-bold text-brand-dark group-hover:text-brand">
          {event.title}
        </h3>
        {event.datetime && (
          <p className="mt-1 text-xs font-medium text-accent">{formatDateTime(event.datetime)}</p>
        )}
        <p className="mt-2 line-clamp-3 flex-1 text-sm text-slate-500">{event.description}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand">
          Saiba mais
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </Link>
  )
}
