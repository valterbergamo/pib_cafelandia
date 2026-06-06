import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { list } from '../../api/client.js'
import { useAuth } from '../../context/AuthContext.jsx'

function StatCard({ label, value, to, icon }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-100 transition hover:shadow-md"
    >
      <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand/10 text-xl text-brand">
        {icon}
      </span>
      <div>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </Link>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ events: '—', schedules: '—', partners: '—', subs: '—' })

  useEffect(() => {
    Promise.all([
      list('Events').catch(() => []),
      list('Schedules').catch(() => []),
      list('Partners').catch(() => []),
      list('Subscriptions').catch(() => []),
    ]).then(([events, schedules, partners, subs]) => {
      setStats({
        events: events.length,
        schedules: schedules.length,
        partners: partners.length,
        subs: subs.length,
      })
    })
  }, [])

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-slate-800">
        Olá, {user?.username} 👋
      </h1>
      <p className="text-sm text-slate-500">Bem-vindo ao painel de administração do site.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Eventos" value={stats.events} to="/admin/eventos" icon="★" />
        <StatCard label="Horários" value={stats.schedules} to="/admin/agenda" icon="◷" />
        <StatCard label="Parceiros" value={stats.partners} to="/admin/parceiros" icon="⊞" />
        <StatCard label="Inscrições" value={stats.subs} to="/admin/inscricoes" icon="✉" />
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Link
          to="/admin/configuracao"
          className="rounded-2xl bg-gradient-to-br from-brand to-brand-light p-8 text-white shadow-sm transition hover:shadow-lg"
        >
          <h2 className="font-serif text-xl font-bold">Configurar o site</h2>
          <p className="mt-2 text-sm text-slate-200">
            Edite nome, logo, cores, textos, contatos, redes sociais e dados de contribuição — tudo
            pelo próprio site.
          </p>
          <span className="mt-4 inline-block text-sm font-semibold">Abrir configurações →</span>
        </Link>
        <Link
          to="/admin/eventos"
          className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-100 transition hover:shadow-lg"
        >
          <h2 className="font-serif text-xl font-bold text-slate-800">Publicar um evento</h2>
          <p className="mt-2 text-sm text-slate-500">
            Cadastre cultos especiais, conferências e programações para aparecerem no site.
          </p>
          <span className="mt-4 inline-block text-sm font-semibold text-brand">
            Gerenciar eventos →
          </span>
        </Link>
      </div>

      <div className="mt-8 rounded-xl bg-amber-50 p-5 text-sm text-amber-800 ring-1 ring-amber-100">
        <strong>Dica de segurança:</strong> você está usando o acesso inicial. Em{' '}
        <Link to="/admin/usuarios" className="font-semibold underline">
          Usuários
        </Link>{' '}
        altere a senha padrão <code className="rounded bg-amber-100 px-1">123456</code> assim que
        possível.
      </div>
    </div>
  )
}
