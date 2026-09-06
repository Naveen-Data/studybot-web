import { useState } from 'react'
import { login, register } from './api'

export default function Login({ onSuccess }) {
  // Registration is always open — there's no single-account gate anymore,
  // so both modes are just a toggle, not something the server decides for us.
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

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
      <div className="notes" style={{ marginTop: 12, textAlign: 'center' }}>
        {mode === 'register' ? (
          <>
            Already have an account?{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); setError(''); setMode('login') }}>
              Log in
            </a>
          </>
        ) : (
          <>
            Need an account?{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); setError(''); setMode('register') }}>
              Register
            </a>
          </>
        )}
      </div>
    </div>
  )
}
