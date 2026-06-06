import { useState } from 'react'
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useSiteConfig } from '../../context/SiteConfigContext.jsx'

const nav = [
  { to: '/admin', label: 'Painel', end: true, icon: '▦' },
  { to: '/admin/configuracao', label: 'Configuração do site', icon: '⚙' },
  { to: '/admin/eventos', label: 'Eventos', icon: '★' },
  { to: '/admin/agenda', label: 'Agenda / Cultos', icon: '◷' },
  { to: '/admin/parceiros', label: 'Parceiros', icon: '⊞' },
  { to: '/admin/inscricoes', label: 'Inscrições', icon: '✉' },
  { to: '/admin/usuarios', label: 'Usuários', icon: '◉' },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const { config } = useSiteConfig()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-brand-dark text-slate-300 transition-transform lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center gap-2 border-b border-white/10 px-6">
          <span className="font-serif text-lg font-bold text-white">Admin</span>
          <span className="truncate text-xs text-slate-400">{config.nameChurch}</span>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                  isActive ? 'bg-accent text-brand-dark' : 'hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <span className="w-5 text-center">{n.icon}</span>
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="absolute inset-x-0 bottom-0 border-t border-white/10 p-4">
          <Link to="/" target="_blank" className="block rounded-lg px-4 py-2 text-sm hover:bg-white/10 hover:text-white">
            ↗ Ver site
          </Link>
          <button
            onClick={handleLogout}
            className="mt-1 block w-full rounded-lg px-4 py-2 text-left text-sm text-red-300 hover:bg-white/10"
          >
            ⎋ Sair
          </button>
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Conteúdo */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
          <button
            className="grid h-10 w-10 place-items-center rounded-lg text-slate-600 lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Abrir menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            </svg>
          </button>
          <div className="ml-auto flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-700">{user?.username}</p>
              <p className="text-xs text-slate-400">{user?.role}</p>
            </div>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-brand font-semibold text-white">
              {(user?.username || 'A').charAt(0).toUpperCase()}
            </span>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
