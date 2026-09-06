// Backend lives on the Oracle VM; this app is deployed separately on Vercel.
// Override for local dev: localStorage.setItem('api', 'http://127.0.0.1:8811')
const API = localStorage.getItem('api') || import.meta.env.VITE_API_URL || 'https://140.245.244.245.nip.io'

function getToken() {
  let token = localStorage.getItem('token')
  if (!token) {
    token = window.prompt('Access token:') || ''
    localStorage.setItem('token', token)
  }
  return token
}

async function call(path, opts = {}) {
  const headers = { ...(opts.headers || {}), Authorization: 'Bearer ' + getToken() }
  const res = await fetch(API + path, { ...opts, headers })
  if (res.status === 401) {
    localStorage.removeItem('token') // wrong/stale token — next call re-prompts
    throw new Error('Unauthorized — reload and re-enter your token')
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
