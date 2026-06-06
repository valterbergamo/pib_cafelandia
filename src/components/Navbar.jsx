import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useSiteConfig } from '../context/SiteConfigContext.jsx'

const links = [
  { to: '/', label: 'Início', end: true },
  { to: '/sobre', label: 'Sobre' },
  { to: '/agenda', label: 'Agenda' },
  { to: '/eventos', label: 'Eventos' },
  { to: '/contribua', label: 'Contribua' },
  { to: '/contato', label: 'Contato' },
]

export default function Navbar() {
  const { config } = useSiteConfig()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 shadow-md backdrop-blur' : 'bg-white/80 backdrop-blur'
      }`}
    >
      <nav className="container-x flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          {config.logoUrl ? (
            <img src={config.logoUrl} alt={config.nameChurch} className="h-12 w-auto" />
          ) : (
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand font-serif text-lg font-bold text-white">
              {(config.nameChurch || 'PIB').slice(0, 3).toUpperCase()}
            </span>
          )}
          <span className="hidden font-serif text-lg font-bold leading-tight text-brand-dark sm:block">
            {config.nameChurch}
          </span>
        </Link>

        {/* Desktop */}
        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-brand/10 text-brand'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-brand'
                  }`
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <Link to="/contribua" className="btn-accent !py-2.5">
            Ofertar
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="grid h-11 w-11 place-items-center rounded-lg text-brand-dark lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-slate-100 bg-white lg:hidden">
          <ul className="container-x flex flex-col gap-1 py-4">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-lg px-4 py-3 text-base font-medium transition ${
                      isActive ? 'bg-brand/10 text-brand' : 'text-slate-700 hover:bg-slate-100'
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
            <li className="pt-2">
              <Link to="/contribua" onClick={() => setOpen(false)} className="btn-accent w-full">
                Ofertar
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
