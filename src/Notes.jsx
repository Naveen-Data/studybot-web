import { useEffect, useState } from 'react'
import { addNote, getNotes } from './api'

export default function Notes() {
  const [notes, setNotes] = useState(null)
  const [topic, setTopic] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  function load() {
    getNotes().then(setNotes).catch(() => setNotes([]))
  }

  useEffect(load, [])

  async function submit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await addNote(topic.trim(), content.trim(), tags.trim() || undefined)
      setTopic('')
      setContent('')
      setTags('')
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <form className="card" onSubmit={submit}>
        <input placeholder="Topic" value={topic} onChange={(e) => setTopic(e.target.value)} />
        <textarea
          placeholder="What did you learn?"
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <input placeholder="Tags (optional, comma-separated)" value={tags} onChange={(e) => setTags(e.target.value)} />
        {error && <div className="notes" style={{ color: '#e05555' }}>{error}</div>}
        <button className="wide" type="submit" disabled={busy || !topic.trim() || !content.trim()}>
          Save note
        </button>
      </form>

      {notes === null ? (
        <div className="empty">Loading…</div>
      ) : notes.length === 0 ? (
        <div className="empty">No session notes yet.</div>
      ) : (
        notes.map((n) => (
          <div className="card" key={n.id}>
            <div className="q" style={{ fontSize: 16 }}>
              {n.topic}
            </div>
            <div className="notes">{n.content}</div>
            {n.tags && <div className="tags">🏷 {n.tags}</div>}
          </div>
        ))
      )}
    </>
  )
}
