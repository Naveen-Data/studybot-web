import { useEffect, useRef, useState } from 'react'
import { deleteCard, editCard, getCards } from './api'
import TopicPicker from './TopicPicker.jsx'

export default function Browse() {
  const [term, setTerm] = useState('')
  const [topic, setTopic] = useState('')
  const [cards, setCards] = useState([])
  const [open, setOpen] = useState(null)
  const [editing, setEditing] = useState(null) // card id being edited, or null
  const [draft, setDraft] = useState({ question: '', answer: '', tags: '', topic: '' })
  const [error, setError] = useState('')
  const timer = useRef(null)
  const reqId = useRef(0)

  function search() {
    // saveEdit()/remove() call this directly, bypassing the debounce below, so
    // two fetches can race — apply only the result of whichever was requested
    // last, not whichever happens to resolve last.
    const id = ++reqId.current
    getCards(term, topic)
      .then((data) => { if (id === reqId.current) setCards(data) })
      .catch(() => { if (id === reqId.current) setCards([]) })
  }

  useEffect(() => {
    clearTimeout(timer.current)
    timer.current = setTimeout(search, 200)
    return () => clearTimeout(timer.current)
  }, [term, topic])

  function startEdit(c) {
    setEditing(c.id)
    setError('')
    setDraft({ question: c.question, answer: c.answer, tags: c.tags || '', topic: c.topic || '' })
  }

  async function saveEdit(id) {
    setError('')
    try {
      await editCard(id, draft)
      setEditing(null)
      search()
    } catch (err) {
      setError(err.message)
    }
  }

  async function remove(id) {
    if (!confirm('Delete this card? This cannot be undone.')) return
    await deleteCard(id)
    setOpen(null)
    search()
  }

  return (
    <>
      <input
        placeholder="Search cards…"
        autoComplete="off"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
      />
      <TopicPicker value={topic} onChange={setTopic} />
      {cards.length === 0 ? (
        <div className="empty">No cards.</div>
      ) : (
        cards.map((c) =>
          editing === c.id ? (
            <div key={c.id} className="card">
              <input
                placeholder="Question"
                value={draft.question}
                onChange={(e) => setDraft({ ...draft, question: e.target.value })}
              />
              <textarea
                placeholder="Answer"
                rows={3}
                value={draft.answer}
                onChange={(e) => setDraft({ ...draft, answer: e.target.value })}
              />
              <input
                placeholder="Tags"
                value={draft.tags}
                onChange={(e) => setDraft({ ...draft, tags: e.target.value })}
              />
              <input
                placeholder="Topic (e.g. programming, rag)"
                value={draft.topic}
                onChange={(e) => setDraft({ ...draft, topic: e.target.value })}
              />
              {error && <div className="notes" style={{ color: '#e05555' }}>{error}</div>}
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="wide" onClick={() => saveEdit(c.id)}>Save</button>
                <button onClick={() => setEditing(null)} style={{ flex: '0 0 auto', padding: '14px 20px' }}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div key={c.id} className="row" onClick={() => setOpen(open === c.id ? null : c.id)}>
              <div className="qq">{c.front}</div>
              {open === c.id && (
                <>
                  <div className="aa">
                    {c.back}
                    {c.topic && (
                      <>
                        <br />
                        📂 {c.topic}
                      </>
                    )}
                    {c.tags && (
                      <>
                        <br />
                        🏷 {c.tags}
                      </>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 10 }} onClick={(e) => e.stopPropagation()}>
                    <button
                      style={{ fontSize: 12, padding: '6px 10px', minHeight: 'auto' }}
                      onClick={() => startEdit(c)}
                    >
                      Edit
                    </button>
                    <button
                      style={{ fontSize: 12, padding: '6px 10px', minHeight: 'auto' }}
                      onClick={() => remove(c.id)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          )
        )
      )}
    </>
  )
}
