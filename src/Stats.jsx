import { useEffect, useState } from 'react'
import { getStats } from './api'

export default function Stats() {
  const [s, setS] = useState(null)

  useEffect(() => {
    getStats().then(setS).catch(() => setS(null))
  }, [])

  if (!s) return <div className="empty">Loading…</div>

  const weak = Object.entries(s.retention.by_tag).slice(0, 8)

  return (
    <>
      <div className="card">
        <div className="q">{s.retention.retention}% retention</div>
        <div className="notes">{s.retention.reviews} reviews in the last 30 days</div>
      </div>
      <div className="card">
        <div className="q">{s.deck.total} cards</div>
        <div className="notes">
          {s.deck.due} due · {s.deck.suspended} suspended · 🔥 {s.streak} day streak
        </div>
      </div>
      {weak.length > 0 && (
        <div className="card">
          <div className="q" style={{ fontSize: 16 }}>
            Weakest tags
          </div>
          {weak.map(([tag, d]) => (
            <div className="notes" key={tag}>
              {tag} — {d.retention}% ({d.reviews})
            </div>
          ))}
        </div>
      )}
      <div className="card">
        <div className="q" style={{ fontSize: 16 }}>
          Next 7 days
        </div>
        {s.forecast.map((f) => (
          <div className="notes" key={f.day}>
            {f.day} — {f.due}
          </div>
        ))}
      </div>
    </>
  )
}
