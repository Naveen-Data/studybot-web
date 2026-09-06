import { useEffect, useRef, useState } from 'react'

const WORK_MIN = 25
const BREAK_MIN = 5

function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = 880
    gain.gain.setValueAtTime(0.2, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6)
    osc.start()
    osc.stop(ctx.currentTime + 0.6)
  } catch {
    // no audio available — silent completion is fine
  }
}

function format(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function Pomodoro() {
  const [phase, setPhase] = useState('work') // 'work' | 'break'
  const [running, setRunning] = useState(false)
  const [remaining, setRemaining] = useState(WORK_MIN * 60)
  const [sessions, setSessions] = useState(0)
  const endTimeRef = useRef(null)

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => {
      const left = Math.max(0, Math.round((endTimeRef.current - Date.now()) / 1000))
      setRemaining(left)
      if (left === 0) {
        beep()
        setRunning(false)
        if (phase === 'work') {
          setSessions((n) => n + 1)
          setPhase('break')
          setRemaining(BREAK_MIN * 60)
        } else {
          setPhase('work')
          setRemaining(WORK_MIN * 60)
        }
      }
    }, 250)
    return () => clearInterval(id)
  }, [running, phase])

  function start() {
    endTimeRef.current = Date.now() + remaining * 1000
    setRunning(true)
  }

  function pause() {
    setRunning(false)
  }

  function reset() {
    setRunning(false)
    setPhase('work')
    setRemaining(WORK_MIN * 60)
  }

  const total = (phase === 'work' ? WORK_MIN : BREAK_MIN) * 60
  const progress = 1 - remaining / total

  return (
    <div className="card" style={{ textAlign: 'center', padding: '32px 20px' }}>
      <div className="notes" style={{ marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>
        {phase === 'work' ? 'Focus session' : 'Break'}
      </div>
      <div style={{ fontSize: 56, fontWeight: 700, fontVariantNumeric: 'tabular-nums', margin: '12px 0' }}>
        {format(remaining)}
      </div>
      <div
        style={{
          height: 6, borderRadius: 3, background: 'var(--line)', overflow: 'hidden', marginBottom: 24,
        }}
      >
        <div
          style={{
            height: '100%', width: `${progress * 100}%`,
            background: phase === 'work' ? 'var(--accent)' : '#4caf7d',
            transition: 'width .25s linear',
          }}
        />
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        {running ? (
          <button className="wide" onClick={pause}>Pause</button>
        ) : (
          <button className="wide" onClick={start}>{remaining === total ? 'Start' : 'Resume'}</button>
        )}
        <button onClick={reset} style={{ flex: '0 0 auto', padding: '14px 20px' }}>Reset</button>
      </div>
      <div className="notes" style={{ marginTop: 20 }}>
        {sessions} focus session{sessions === 1 ? '' : 's'} completed today
      </div>
    </div>
  )
}
