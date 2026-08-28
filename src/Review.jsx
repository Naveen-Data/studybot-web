import { useEffect, useState, useCallback } from 'react'
import { getDue, answer, apiOrigin } from './api'

export default function Review({ setCount }) {
  const [queue, setQueue] = useState(null) // null = loading
  const [idx, setIdx] = useState(0)
  const [shown, setShown] = useState(false)
  const [err, setErr] = useState(null)
  const [lastInterval, setLastInterval] = useState(null)

  useEffect(() => {
    getDue().then(setQueue).catch((e) => setErr(e.message))
  }, [])

  useEffect(() => {
    if (!queue) return
    setCount(idx < queue.length ? `${Math.min(idx + 1, queue.length)}/${queue.length}${lastInterval ? ` · +${lastInterval}d` : ''}` : '')
  }, [queue, idx, lastInterval, setCount])

  const reveal = useCallback(() => setShown(true), [])

  const rate = useCallback(
    async (quality) => {
      const card = queue[idx]
      if (!card) return
      setShown(false)
      try {
        const r = await answer(card.id, quality)
        setLastInterval(r.interval_days ?? null)
        if (quality === 1) setQueue((q) => [...q, card]) // Again — see it again this session
      } catch (e) {
        setErr(e.message)
      }
      setIdx((i) => i + 1)
    },
    [queue, idx],
  )

  useEffect(() => {
    function onKey(e) {
      if (e.key === ' ' && !shown) {
        e.preventDefault()
        reveal()
      } else if (shown && ['1', '2', '3', '4'].includes(e.key)) {
        rate([1, 3, 4, 5][+e.key - 1])
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [shown, reveal, rate])

  if (err) {
    return (
      <div className="empty">
        Can't reach the backend.
        <br />
        <br />
        <span style={{ fontSize: 13 }}>
          {apiOrigin}
          <br />
          {err}
        </span>
      </div>
    )
  }
  if (!queue) return <div className="empty">Loading…</div>

  const card = queue[idx]
  if (!card) {
    return (
      <div className="empty">
        Nothing due.
        <br />
        <br />
        🎉
      </div>
    )
  }

  return (
    <>
      <div className="card">
        <div className="q">{card.front}</div>
        {shown && <div className="a">{card.back}</div>}
        {shown && card.notes && <div className="notes">📝 {card.notes}</div>}
        {card.tags && <div className="tags">🏷 {card.tags}</div>}
      </div>
      {shown ? (
        <>
          <div className="rate">
            <button onClick={() => rate(1)}>🔴 Again</button>
            <button onClick={() => rate(3)}>🟠 Hard</button>
            <button onClick={() => rate(4)}>🟢 Good</button>
            <button onClick={() => rate(5)}>🔵 Easy</button>
          </div>
          <div className="kbd">1–4 to rate</div>
        </>
      ) : (
        <>
          <button className="wide" onClick={reveal}>
            Reveal
          </button>
          <div className="kbd">space to reveal</div>
        </>
      )}
    </>
  )
}
