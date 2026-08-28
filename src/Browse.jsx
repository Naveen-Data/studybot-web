import { useEffect, useRef, useState } from 'react'
import { getCards } from './api'

export default function Browse() {
  const [term, setTerm] = useState('')
  const [cards, setCards] = useState([])
  const [open, setOpen] = useState(null)
  const timer = useRef(null)

  useEffect(() => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      getCards(term).then(setCards).catch(() => setCards([]))
    }, 200)
    return () => clearTimeout(timer.current)
  }, [term])

  return (
    <>
      <input
        placeholder="Search cards…"
        autoComplete="off"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
      />
      {cards.length === 0 ? (
        <div className="empty">No cards.</div>
      ) : (
        cards.map((c) => (
          <div key={c.id} className="row" onClick={() => setOpen(open === c.id ? null : c.id)}>
            <div className="qq">{c.front}</div>
            {open === c.id && (
              <div className="aa">
                {c.back}
                {c.tags && (
                  <>
                    <br />
                    🏷 {c.tags}
                  </>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </>
  )
}
