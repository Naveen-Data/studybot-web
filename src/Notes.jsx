import { useEffect, useState } from 'react'
import { getNotes } from './api'

export default function Notes() {
  const [notes, setNotes] = useState(null)

  useEffect(() => {
    getNotes().then(setNotes).catch(() => setNotes([]))
  }, [])

  if (notes === null) return <div className="empty">Loading…</div>
  if (notes.length === 0) return <div className="empty">No session notes yet.</div>

  return (
    <>
      {notes.map((n) => (
        <div className="card" key={n.id}>
          <div className="q" style={{ fontSize: 16 }}>
            {n.topic}
          </div>
          <div className="notes">{n.content}</div>
          {n.tags && <div className="tags">🏷 {n.tags}</div>}
        </div>
      ))}
    </>
  )
}
