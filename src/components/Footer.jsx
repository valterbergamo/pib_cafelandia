import { Link } from 'react-router-dom'
import { useSiteConfig } from '../context/SiteConfigContext.jsx'
import manifest from '../manifest.json'

const APP_VERSION = manifest['sap.app']?.applicationVersion?.version || '—'

function Social({ href, label, children }) {
  if (!href) return null
  const url = href.startsWith('http') ? href : `https://${href}`
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-accent hover:text-brand-dark"
    >
      {children}
    </a>
  )
}

export default function Footer() {
  const { config } = useSiteConfig()
  const year = new Date().getFullYear()

  return (
    <footer className="bg-brand-dark text-slate-300">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <h3 className="font-serif text-xl font-bold text-white">{config.nameChurch}</h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            {config.footerText || config.message}
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-accent">Navegação</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/sobre" className="hover:text-white">Sobre</Link></li>
            <li><Link to="/agenda" className="hover:text-white">Agenda</Link></li>
            <li><Link to="/eventos" className="hover:text-white">Eventos</Link></li>
            <li><Link to="/contribua" className="hover:text-white">Contribua</Link></li>
            <li><Link to="/contato" className="hover:text-white">Contato</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-accent">Contato</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            {config.address && <li>{config.address}</li>}
            {config.phone && <li>{config.phone}</li>}
            {config.email && (
              <li>
                <a href={`mailto:${config.email}`} className="hover:text-white">{config.email}</a>
              </li>
            )}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-accent">Redes</h4>
          <div className="flex gap-3">
            <Social href={config.instagram} label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.86s0 3.6-.07 4.86c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38a3.7 3.7 0 0 1-1.38.9c-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.9.07s-3.6 0-4.86-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.86c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.4 2.2 8.8 2.2 12 2.2Zm0 1.8c-3.15 0-3.5 0-4.74.07-.9.04-1.38.19-1.7.32-.43.16-.74.36-1.06.68-.32.32-.52.63-.68 1.06-.13.32-.28.8-.32 1.7C3.43 9.05 3.43 9.4 3.43 12s0 2.95.07 4.2c.04.9.19 1.38.32 1.7.16.43.36.74.68 1.06.32.32.63.52 1.06.68.32.13.8.28 1.7.32 1.24.06 1.6.07 4.74.07s3.5 0 4.74-.07c.9-.04 1.38-.19 1.7-.32.43-.16.74-.36 1.06-.68.32-.32.52-.63.68-1.06.13-.32.28-.8.32-1.7.06-1.25.07-1.6.07-4.2s0-2.95-.07-4.2c-.04-.9-.19-1.38-.32-1.7a2.85 2.85 0 0 0-.68-1.06 2.85 2.85 0 0 0-1.06-.68c-.32-.13-.8-.28-1.7-.32C15.5 4 15.15 4 12 4Zm0 3.06A4.94 4.94 0 1 1 7.06 12 4.94 4.94 0 0 1 12 7.06Zm0 8.14A3.2 3.2 0 1 0 8.8 12 3.2 3.2 0 0 0 12 15.2Zm6.3-8.34a1.15 1.15 0 1 1-1.15-1.15 1.15 1.15 0 0 1 1.15 1.15Z"/></svg>
            </Social>
            <Social href={config.facebook} label="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.5-1.5h1.6V3.6c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.3H7.6V13h2.6v8h3.3Z"/></svg>
            </Social>
            <Social href={config.youtube} label="YouTube">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23 12s0-3.2-.4-4.7a2.5 2.5 0 0 0-1.75-1.76C19.3 5.1 12 5.1 12 5.1s-7.3 0-8.85.43A2.5 2.5 0 0 0 1.4 7.3C1 8.8 1 12 1 12s0 3.2.4 4.7a2.5 2.5 0 0 0 1.75 1.76C4.7 18.9 12 18.9 12 18.9s7.3 0 8.85-.43a2.5 2.5 0 0 0 1.75-1.76C23 15.2 23 12 23 12ZM9.75 14.85V9.15L14.7 12l-4.95 2.85Z"/></svg>
            </Social>
            {config.whatsapp && (
              <Social href={`https://wa.me/${config.whatsapp.replace(/\D/g, '')}`} label="WhatsApp">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.5A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-2.9.9.9-2.8-.2-.3A8 8 0 1 1 12 20Zm4.4-6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.8 1-.1.1-.3.2-.5 0a6.6 6.6 0 0 1-3.2-2.8c-.2-.4.2-.4.6-1.2.1-.1 0-.3 0-.4l-.7-1.7c-.2-.5-.4-.4-.5-.4h-.5a1 1 0 0 0-.7.3c-.3.3-1 .9-1 2.3s1 2.7 1.2 2.9c.1.2 2 3.1 4.9 4.3 1.8.8 2.5.8 3.4.7.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1 0-.1-.2-.2-.4-.3Z"/></svg>
              </Social>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-slate-400 sm:flex-row">
          <p>© {year} {config.nameChurch}. Todos os direitos reservados.</p>
          <div className="flex items-center gap-3">
            <span className="text-slate-500" title="Versão do site">v{APP_VERSION}</span>
            <Link to="/admin" className="hover:text-white">Área administrativa</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
