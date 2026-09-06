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

const TITLES = { review: 'Review', browse: 'Browse', stats: 'Stats', notes: 'Notes', focus: 'Focus', tokens: 'Tokens' }

export default function App() {
  const [authed, setAuthed] = useState(isLoggedIn())
  const [tab, setTab] = useState('review')
  const [count, setCount] = useState('')
  // Called unconditionally (before the auth early-return) so the timer keeps
  // running across tab switches — it's a sibling of every tab, not owned by
  // the Focus tab alone, which would kill it on unmount every time you left.
  const pomo = usePomodoro()

  if (!authed) return <Login onSuccess={() => setAuthed(true)} />

  return (
    <>
      <header>
        <b>{TITLES[tab]}</b>
        <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {pomo.running && (
            <button
              onClick={() => setTab('focus')}
              style={{
                padding: '4px 10px', minHeight: 'auto', fontSize: 12, fontVariantNumeric: 'tabular-nums',
                color: pomo.phase === 'work' ? 'var(--accent)' : '#4caf7d',
                borderColor: pomo.phase === 'work' ? 'var(--accent)' : '#4caf7d',
              }}
            >
              {pomo.phase === 'work' ? '🍅' : '☕'} {format(pomo.remaining)}
            </button>
          )}
          <span id="count">{tab === 'review' ? count : ''}</span>
          <button
            style={{ padding: '4px 10px', minHeight: 'auto', fontSize: 12 }}
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
      <nav>
        <button className={tab === 'review' ? 'on' : ''} onClick={() => setTab('review')}>
          Review
        </button>
        <button className={tab === 'browse' ? 'on' : ''} onClick={() => setTab('browse')}>
          Browse
        </button>
        <button className={tab === 'stats' ? 'on' : ''} onClick={() => setTab('stats')}>
          Stats
        </button>
        <button className={tab === 'notes' ? 'on' : ''} onClick={() => setTab('notes')}>
          Notes
        </button>
        <button className={tab === 'focus' ? 'on' : ''} onClick={() => setTab('focus')}>
          Focus
        </button>
        <button className={tab === 'tokens' ? 'on' : ''} onClick={() => setTab('tokens')}>
          Tokens
        </button>
      </nav>
    </>
  )
}
