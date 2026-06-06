import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { setToken, getToken } from '../api/client.js'
import { kcLogin, kcLogout, ADMIN_ROLE } from '../api/keycloak.js'

const AuthContext = createContext(null)

const USER_KEY = 'pib_user'
const REFRESH_KEY = 'pib_refresh'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(USER_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })

  // Garante coerência: se não há token, não há usuário.
  useEffect(() => {
    if (!getToken()) setUser(null)
  }, [])

  async function login(username, password) {
    const data = await kcLogin(username, password)

    // Sem o papel pib_admin não liberamos o acesso ao painel.
    if (!data.isAdmin) {
      const err = new Error(`Sua conta não possui o papel "${ADMIN_ROLE}".`)
      err.status = 403
      throw err
    }

    setToken(data.access_token)
    if (data.refresh_token) localStorage.setItem(REFRESH_KEY, data.refresh_token)

    const u = {
      username: data.username,
      name: data.name,
      email: data.email,
      roles: data.roles,
      role: 'admin', // mantém o contrato usado pelas rotas protegidas
    }
    localStorage.setItem(USER_KEY, JSON.stringify(u))
    setUser(u)
    return u
  }

  function logout() {
    kcLogout(localStorage.getItem(REFRESH_KEY))
    setToken(null)
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(REFRESH_KEY)
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user && !!getToken(),
      isAdmin: user?.role === 'admin',
      login,
      logout,
    }),
    [user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>')
  return ctx
}
