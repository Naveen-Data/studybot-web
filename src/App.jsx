import { useState } from 'react'
import Review from './Review.jsx'
import Browse from './Browse.jsx'
import Stats from './Stats.jsx'
import Notes from './Notes.jsx'
import Tokens from './Tokens.jsx'
import Pomodoro from './Pomodoro.jsx'
import Login from './Login.jsx'
import { isLoggedIn, logout } from './api'

const TITLES = { review: 'Review', browse: 'Browse', stats: 'Stats', notes: 'Notes', focus: 'Focus', tokens: 'Tokens' }

export default function App() {
  const [authed, setAuthed] = useState(isLoggedIn())
  const [tab, setTab] = useState('review')
  const [count, setCount] = useState('')

  if (!authed) return <Login onSuccess={() => setAuthed(true)} />

  return (
    <>
      <header>
        <b>{TITLES[tab]}</b>
        <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
        {tab === 'focus' && <Pomodoro />}
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
