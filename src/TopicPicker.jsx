import { useEffect, useState } from 'react'
import { getTopics } from './api'

function pill(active) {
  return {
    fontSize: 13, padding: '8px 14px', minHeight: 'auto', flex: '0 0 auto',
    background: active ? 'var(--accent)' : 'var(--card)',
    color: active ? '#fff' : 'var(--fg)',
    border: active ? 0 : '1px solid var(--line)',
  }
}

export default function TopicPicker({ value, onChange }) {
  const [topics, setTopics] = useState([])

  useEffect(() => {
    getTopics().then(setTopics).catch(() => setTopics([]))
  }, [])

  if (topics.length === 0) return null

  return (
    <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 14, paddingBottom: 2 }}>
      <button style={pill(value === '')} onClick={() => onChange('')}>All</button>
      {topics.map((t) => (
        <button key={t.topic} style={pill(value === t.topic)} onClick={() => onChange(t.topic)}>
          {t.topic} ({t.total})
        </button>
      ))}
    </div>
  )
}
