// Autenticação contra o Keycloak via Direct Access Grant (grant_type=password).
// Mantemos a NOSSA tela de login — o Keycloak não exibe tela própria.
//
// Em dev o caminho relativo "/keycloak" passa pelo proxy do Vite (ver vite.config.js).
// Em produção o site e o Keycloak ficam no mesmo domínio (pibcafelandia.com.br),
// então o caminho relativo também funciona direto.
const KC_URL = (import.meta.env.VITE_KEYCLOAK_URL || '/keycloak').replace(/\/$/, '')
const KC_REALM = import.meta.env.VITE_KEYCLOAK_REALM || 'sites'
const KC_CLIENT = import.meta.env.VITE_KEYCLOAK_CLIENT || 'pib'

// Papel obrigatório para acessar o painel administrativo.
const ADMIN_ROLE = import.meta.env.VITE_KEYCLOAK_ADMIN_ROLE || 'pib_admin'

const BASE = `${KC_URL}/realms/${KC_REALM}/protocol/openid-connect`
const TOKEN_ENDPOINT = `${BASE}/token`
const LOGOUT_ENDPOINT = `${BASE}/logout`

// Decodifica o payload de um JWT (base64url) sem validar a assinatura —
// usamos apenas para ler claims (username, papéis) no cliente.
export function decodeJwt(token) {
  try {
    const payload = token.split('.')[1]
    const json = decodeURIComponent(
      atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    )
    return JSON.parse(json)
  } catch {
    return null
  }
}

// Lista todos os papéis (realm + do client "pib") presentes no token.
export function rolesFromToken(token) {
  const claims = decodeJwt(token) || {}
  const realmRoles = claims.realm_access?.roles ?? []
  const clientRoles = claims.resource_access?.[KC_CLIENT]?.roles ?? []
  return [...new Set([...realmRoles, ...clientRoles])]
}

export function hasAdminRole(token) {
  return rolesFromToken(token).includes(ADMIN_ROLE)
}

// Faz login no Keycloak e devolve os tokens + dados do usuário.
export async function kcLogin(username, password) {
  const body = new URLSearchParams({
    grant_type: 'password',
    client_id: KC_CLIENT,
    scope: 'openid',
    username,
    password,
  })

  const res = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    // invalid_grant → credenciais inválidas
    const err = new Error(data?.error_description || data?.error || `Erro ${res.status}`)
    err.status = data?.error === 'invalid_grant' ? 401 : res.status
    throw err
  }

  const claims = decodeJwt(data.access_token) || {}
  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_in: data.expires_in,
    username: claims.preferred_username || username,
    name: claims.name,
    email: claims.email,
    roles: rolesFromToken(data.access_token),
    isAdmin: hasAdminRole(data.access_token),
  }
}

// Encerra a sessão no Keycloak (best-effort). Sem refresh_token, apenas limpamos
// o estado local no AuthContext.
export async function kcLogout(refreshToken) {
  if (!refreshToken) return
  try {
    await fetch(LOGOUT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ client_id: KC_CLIENT, refresh_token: refreshToken }),
    })
  } catch {
    /* ignora falha de logout remoto */
  }
}

export { ADMIN_ROLE, KC_CLIENT, KC_REALM }
