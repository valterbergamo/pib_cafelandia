// Cliente HTTP fino para o backend SAP CAP (OData v4).
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4004').replace(/\/$/, '')

const AUTH = `${API_URL}/odata/v4/auth`
const PROC = `${API_URL}/odata/v4/processor`

const TOKEN_KEY = 'pib_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}
export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

function authHeaders(extra = {}) {
  const token = getToken()
  return token ? { ...extra, Authorization: `Bearer ${token}` } : extra
}

async function handle(res) {
  if (res.status === 204) return null
  const text = await res.text()
  let body = null
  try {
    body = text ? JSON.parse(text) : null
  } catch {
    body = text
  }
  if (!res.ok) {
    const msg =
      body?.error?.message ||
      body?.error ||
      (typeof body === 'string' && body) ||
      `Erro ${res.status}`
    const err = new Error(msg)
    err.status = res.status
    throw err
  }
  return body
}

// ───────────────────────── Auth ─────────────────────────
export async function login(username, password) {
  const res = await fetch(`${AUTH}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  return handle(res) // { access_token, role, username, ... }
}

// ──────────────────────── OData CRUD ─────────────────────
function buildQuery(params = {}) {
  const q = new URLSearchParams()
  if (params.filter) q.set('$filter', params.filter)
  if (params.orderby) q.set('$orderby', params.orderby)
  if (params.top) q.set('$top', params.top)
  if (params.expand) q.set('$expand', params.expand)
  if (params.select) q.set('$select', params.select)
  const s = q.toString()
  return s ? `?${s}` : ''
}

export async function list(entity, params) {
  const res = await fetch(`${PROC}/${entity}${buildQuery(params)}`, {
    headers: authHeaders(),
  })
  const body = await handle(res)
  return body?.value ?? []
}

export async function getOne(entity, id, params) {
  const res = await fetch(`${PROC}/${entity}(${id})${buildQuery(params)}`, {
    headers: authHeaders(),
  })
  return handle(res)
}

export async function create(entity, data) {
  const res = await fetch(`${PROC}/${entity}`, {
    method: 'POST',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(data),
  })
  return handle(res)
}

export async function update(entity, id, data) {
  const res = await fetch(`${PROC}/${entity}(${id})`, {
    method: 'PATCH',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(data),
  })
  return handle(res)
}

export async function remove(entity, id) {
  const res = await fetch(`${PROC}/${entity}(${id})`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  return handle(res)
}

export { API_URL }
