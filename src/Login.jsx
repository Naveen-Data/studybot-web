import { useEffect, useState } from 'react'
import { authStatus, login, register } from './api'

export default function Login({ onSuccess }) {
  const [mode, setMode] = useState(null) // 'login' | 'register', null while checking
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    authStatus()
      .then((s) => setMode(s.registered ? 'login' : 'register'))
      .catch(() => setMode('login'))
  }, [])

  async function submit(e) {
    e.preventDefault()
    if (mode === 'register' && password !== confirm) {
      setError('Passwords do not match')
      return
    }
    setError('')
    setBusy(true)
    try {
      await (mode === 'register' ? register(username, password) : login(username, password))
      onSuccess()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  if (mode === null) return <div className="empty">Loading…</div>

  return (
    <div className="card" style={{ maxWidth: 320, margin: '80px auto' }}>
      <div className="q" style={{ marginBottom: 16 }}>
        {mode === 'register' ? 'Create your account' : 'Log in'}
      </div>
      <form onSubmit={submit}>
        <input
          placeholder="Username"
          autoFocus
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {mode === 'register' && (
          <input
            placeholder="Confirm password"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        )}
        {error && <div className="notes" style={{ color: '#e05555' }}>{error}</div>}
        <button className="wide" type="submit" disabled={busy}>
          {mode === 'register' ? 'Create account' : 'Log in'}
        </button>
      </form>
    </div>
  )
}
