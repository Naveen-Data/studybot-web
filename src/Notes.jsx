import { useEffect, useState } from 'react'
import { addNote, deleteNote, editNote, getNotes } from './api'

export default function Notes() {
  const [notes, setNotes] = useState(null)
  const [topic, setTopic] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [editing, setEditing] = useState(null)
  const [draft, setDraft] = useState({ topic: '', content: '', tags: '' })

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

  function startEdit(n) {
    setEditing(n.id)
    setError('')
    setDraft({ topic: n.topic, content: n.content, tags: n.tags || '' })
  }

  async function saveEdit(id) {
    setError('')
    try {
      await editNote(id, draft)
      setEditing(null)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  async function remove(id) {
    if (!confirm('Delete this note? This cannot be undone.')) return
    await deleteNote(id)
    load()
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
        {error && !editing && <div className="notes" style={{ color: '#e05555' }}>{error}</div>}
        <button className="wide" type="submit" disabled={busy || !topic.trim() || !content.trim()}>
          Save note
        </button>
      </form>

      {notes === null ? (
        <div className="empty">Loading…</div>
      ) : notes.length === 0 ? (
        <div className="empty">No session notes yet.</div>
      ) : (
        notes.map((n) =>
          editing === n.id ? (
            <div className="card" key={n.id}>
              <input
                placeholder="Topic"
                value={draft.topic}
                onChange={(e) => setDraft({ ...draft, topic: e.target.value })}
              />
              <textarea
                placeholder="Content"
                rows={4}
                value={draft.content}
                onChange={(e) => setDraft({ ...draft, content: e.target.value })}
              />
              <input
                placeholder="Tags"
                value={draft.tags}
                onChange={(e) => setDraft({ ...draft, tags: e.target.value })}
              />
              {error && <div className="notes" style={{ color: '#e05555' }}>{error}</div>}
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="wide" onClick={() => saveEdit(n.id)}>Save</button>
                <button onClick={() => setEditing(null)} style={{ flex: '0 0 auto', padding: '14px 20px' }}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="card" key={n.id}>
              <div className="q" style={{ fontSize: 16 }}>
                {n.topic}
              </div>
              <div className="notes">{n.content}</div>
              {n.tags && <div className="tags">🏷 {n.tags}</div>}
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button style={{ fontSize: 12, padding: '6px 10px', minHeight: 'auto' }} onClick={() => startEdit(n)}>
                  Edit
                </button>
                <button style={{ fontSize: 12, padding: '6px 10px', minHeight: 'auto' }} onClick={() => remove(n.id)}>
                  Delete
                </button>
              </div>
            </div>
          )
        )
      )}
    </>
  )
}
