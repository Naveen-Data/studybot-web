import { useState } from 'react'
import Review from './Review.jsx'
import Browse from './Browse.jsx'
import Stats from './Stats.jsx'

const TITLES = { review: 'Review', browse: 'Browse', stats: 'Stats' }

export default function App() {
  const [tab, setTab] = useState('review')
  const [count, setCount] = useState('')

  return (
    <>
      <header>
        <b>{TITLES[tab]}</b>
        <span id="count">{tab === 'review' ? count : ''}</span>
      </header>
      <main>
        {tab === 'review' && <Review setCount={setCount} />}
        {tab === 'browse' && <Browse />}
        {tab === 'stats' && <Stats />}
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
      </nav>
    </>
  )
}
