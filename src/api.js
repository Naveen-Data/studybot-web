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

export const getDue = (topic = '') => call('/api/due?topic=' + encodeURIComponent(topic))
export const getCards = (q, topic = '') =>
  call('/api/cards?q=' + encodeURIComponent(q) + '&topic=' + encodeURIComponent(topic))
export const getTopics = () => call('/api/topics')
export const editCard = (id, fields) =>
  call('/api/cards/' + id, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fields),
  })
export const deleteCard = (id) => call('/api/cards/' + id, { method: 'DELETE' })
export const getStats = () => call('/api/stats')
export const getNotes = (q = '') => call('/api/notes?q=' + encodeURIComponent(q))
export const addNote = (topic, content, tags) =>
  call('/api/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, content, tags }),
  })
export const editNote = (id, fields) =>
  call('/api/notes/' + id, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fields),
  })
export const deleteNote = (id) => call('/api/notes/' + id, { method: 'DELETE' })
export const answer = (id, quality) =>
  call('/api/answer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, quality }),
  })

export const getTokens = () => call('/api/tokens')
export const createToken = (name) =>
  call('/api/tokens', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  })
export const revokeToken = (id) => call('/api/tokens/' + id, { method: 'DELETE' })

// Not routed through call(): a wrong old password is a 401 that means
// "you got the password wrong", not "your session expired" — it must not
// force a logout the way every other 401 in this app does.
export async function changePassword(oldPassword, newPassword) {
  const res = await raw('/api/auth/change-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + getSession() },
    body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed')
  return data
}

export const apiOrigin = API
