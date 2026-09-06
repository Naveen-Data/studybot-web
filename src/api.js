// Backend lives on the Oracle VM; this app is deployed separately on Vercel.
// Override for local dev: localStorage.setItem('api', 'http://127.0.0.1:8811')
const API = localStorage.getItem('api') || import.meta.env.VITE_API_URL || 'https://140.245.244.245.nip.io'

const getSession = () => localStorage.getItem('session') || ''
const setSession = (t) => (t ? localStorage.setItem('session', t) : localStorage.removeItem('session'))
export const isLoggedIn = () => !!getSession()

async function raw(path, opts) {
  const res = await fetch(API + path, opts)
  return res
}

export async function authStatus() {
  const res = await raw('/api/auth/status')
  return res.json()
}

async function credential(path, username, password) {
  const res = await raw(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed')
  setSession(data.token)
}

export const register = (username, password) => credential('/api/auth/register', username, password)
export const login = (username, password) => credential('/api/auth/login', username, password)

export async function logout() {
  const session = getSession()
  setSession(null)
  if (session) {
    await raw('/api/auth/logout', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + session },
    }).catch(() => {})
  }
}

async function call(path, opts = {}) {
  const headers = { ...(opts.headers || {}), Authorization: 'Bearer ' + getSession() }
  const res = await fetch(API + path, { ...opts, headers })
  if (res.status === 401) {
    setSession(null)
    window.location.reload() // simplest way back to the login screen
    throw new Error('Session expired')
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export const getDue = () => call('/api/due')
export const getCards = (q) => call('/api/cards?q=' + encodeURIComponent(q))
export const getStats = () => call('/api/stats')
export const getNotes = () => call('/api/notes')
export const answer = (id, quality) =>
  call('/api/answer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, quality }),
  })

export const apiOrigin = API
