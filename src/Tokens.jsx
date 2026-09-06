import { useEffect, useState } from 'react'
import { createToken, getTokens, revokeToken } from './api'

export default function Tokens() {
  const [tokens, setTokens] = useState(null)
  const [created, setCreated] = useState(null)
  const [error, setError] = useState('')

  function load() {
    getTokens().then(setTokens).catch(() => setTokens([]))
  }

  useEffect(load, [])

  async function handleCreate() {
    const name = prompt('Token name (e.g. "Claude Desktop"):')
    if (!name) return
    setError('')
    try {
      const t = await createToken(name)
      setCreated(t.token)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleRevoke(id) {
    await revokeToken(id)
    load()
  }

  if (tokens === null) return <div className="empty">Loading…</div>

  return (
    <>
      <button className="wide" style={{ marginBottom: 14 }} onClick={handleCreate}>
        + New MCP token
      </button>
      {error && <div className="notes" style={{ color: '#e05555' }}>{error}</div>}
      {created && (
        <div className="card">
          <div className="q" style={{ fontSize: 15 }}>
            Copy this now — shown once
          </div>
          <div className="notes" style={{ wordBreak: 'break-all', fontFamily: 'monospace' }}>
            {created}
          </div>
        </div>
      )}
      {tokens.length === 0 ? (
        <div className="empty">No MCP tokens yet. Create one to connect Claude or another AI client.</div>
      ) : (
        tokens.map((t) => (
          <div className="row" key={t.id}>
            <div className="qq">{t.name}</div>
            <div className="aa" style={{ display: 'block' }}>
              Created {t.created_at.slice(0, 10)}
              {t.expires_at ? ` · expires ${t.expires_at.slice(0, 10)}` : ''}
              {t.last_used_at ? ` · last used ${t.last_used_at.slice(0, 10)}` : ' · never used'}
            </div>
            <button
              style={{ marginTop: 8, fontSize: 12, padding: '6px 10px', minHeight: 'auto' }}
              onClick={() => handleRevoke(t.id)}
            >
              Revoke
            </button>
          </div>
        ))
      )}
    </>
  )
}
