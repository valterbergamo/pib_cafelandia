import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useSiteConfig } from '../../context/SiteConfigContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const { config } = useSiteConfig()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const from = location.state?.from?.pathname || '/admin'

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const user = await login(form.username.trim(), form.password)
      if (user.role !== 'admin') {
        setError('Sua conta não possui acesso administrativo.')
        return
      }
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.status === 401 ? 'Usuário ou senha inválidos.' : err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-dark px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          {config.logoUrl ? (
            <img src={config.logoUrl} alt="" className="mx-auto h-16" />
          ) : (
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-accent font-serif text-xl font-bold text-brand-dark">
              PIB
            </span>
          )}
          <h1 className="mt-4 font-serif text-2xl font-bold text-white">Área administrativa</h1>
          <p className="text-sm text-slate-400">{config.nameChurch}</p>
        </div>

        <form onSubmit={submit} className="rounded-2xl bg-white p-8 shadow-2xl">
          <div className="space-y-4">
            <div>
              <label className="label">Usuário</label>
              <input
                className="input"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                autoFocus
                required
              />
            </div>
            <div>
              <label className="label">Senha</label>
              <input
                type="password"
                className="input"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
          </div>

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
          )}

          <button type="submit" disabled={loading} className="btn-primary mt-6 w-full">
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <Link to="/" className="mt-4 block text-center text-sm text-slate-400 hover:text-brand">
            ← Voltar ao site
          </Link>
        </form>
      </div>
    </div>
  )
}
