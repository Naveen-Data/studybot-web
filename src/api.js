// Backend lives on the Oracle VM; this app is deployed separately on Vercel.
// Override for local dev: localStorage.setItem('api', 'http://127.0.0.1:8811')
const API = localStorage.getItem('api') || import.meta.env.VITE_API_URL || 'https://140.245.244.245.nip.io'

async function call(path, opts) {
  const res = await fetch(API + path, opts)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export const getDue = () => call('/api/due')
export const getCards = (q) => call('/api/cards?q=' + encodeURIComponent(q))
export const getStats = () => call('/api/stats')
export const answer = (id, quality) =>
  call('/api/answer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, quality }),
  })

export const apiOrigin = API
