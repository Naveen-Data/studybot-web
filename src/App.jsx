import { useState } from 'react'
import Review from './Review.jsx'
import Browse from './Browse.jsx'
import Stats from './Stats.jsx'
import Notes from './Notes.jsx'
import Tokens from './Tokens.jsx'
import Pomodoro from './Pomodoro.jsx'
import Login from './Login.jsx'
import { isLoggedIn, logout } from './api'
import { format, usePomodoro } from './pomodoro'

const TABS = [
  ['review', 'Review'],
  ['browse', 'Browse'],
  ['stats', 'Stats'],
  ['notes', 'Notes'],
  ['focus', 'Focus'],
  ['tokens', 'Tokens'],
]
const TITLES = Object.fromEntries(TABS)

export default function App() {
  const [authed, setAuthed] = useState(isLoggedIn())
  const [tab, setTab] = useState('review')
  const [count, setCount] = useState('')
  const [panelOpen, setPanelOpen] = useState(false)
  // Called unconditionally (before the auth early-return) so the timer keeps
  // running across tab switches — it's a sibling of every tab, not owned by
  // the Focus tab alone, which would kill it on unmount every time you left.
  const pomo = usePomodoro()

  if (!authed) return <Login onSuccess={() => setAuthed(true)} />

  function go(t) {
    setTab(t)
    setPanelOpen(false)
  }

  return (
    <>
      <header>
        <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="icon-btn" aria-label="Menu" onClick={() => setPanelOpen((v) => !v)}>
            ☰
          </button>
          <b>{TITLES[tab]}</b>
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {pomo.running && (
            <button
              onClick={() => go('focus')}
              style={{
                height: 32, padding: '0 10px', minHeight: 'auto', fontSize: 12, fontVariantNumeric: 'tabular-nums',
                color: pomo.phase === 'work' ? 'var(--accent)' : '#4caf7d',
                borderColor: pomo.phase === 'work' ? 'var(--accent)' : '#4caf7d',
              }}
            >
              {pomo.phase === 'work' ? '🍅' : '☕'} {format(pomo.remaining)}
            </button>
          )}
          <span id="count">{tab === 'review' ? count : ''}</span>
          <button
            style={{ height: 32, padding: '0 10px', minHeight: 'auto', fontSize: 12 }}
            onClick={() => {
              logout()
              setAuthed(false)
            }}
          >
            Log out
          </button>
        </span>
      </header>
      <main>
        {tab === 'review' && <Review setCount={setCount} />}
        {tab === 'browse' && <Browse />}
        {tab === 'stats' && <Stats />}
        {tab === 'notes' && <Notes />}
        {tab === 'focus' && <Pomodoro pomo={pomo} />}
        {tab === 'tokens' && <Tokens />}
      </main>

      {panelOpen && <div className="panel-backdrop" onClick={() => setPanelOpen(false)} />}
      <nav className={panelOpen ? 'open' : ''}>
        {TABS.map(([id, label]) => (
          <button key={id} className={tab === id ? 'on' : ''} onClick={() => go(id)}>
            {label}
          </button>
        ))}
      </nav>
    </>
  )
}
