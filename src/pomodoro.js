import { useEffect, useRef, useState } from 'react'

const DEFAULT_WORK = 25
const DEFAULT_BREAK = 5

function loadMinutes(key, fallback) {
  const v = Number(localStorage.getItem(key))
  return v > 0 ? v : fallback
}

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

export function format(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

// Lives in App.jsx (always mounted) so the timer keeps running when the
// user switches tabs — a Pomodoro is pointless if it dies the moment you
// tab away to Review a due card.
export function usePomodoro() {
  const [workMin, setWorkMinState] = useState(() => loadMinutes('pomo_work_min', DEFAULT_WORK))
  const [breakMin, setBreakMinState] = useState(() => loadMinutes('pomo_break_min', DEFAULT_BREAK))
  const [phase, setPhase] = useState('work') // 'work' | 'break'
  const [running, setRunning] = useState(false)
  const [remaining, setRemaining] = useState(() => loadMinutes('pomo_work_min', DEFAULT_WORK) * 60)
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
        setPhase((prev) => {
          if (prev === 'work') {
            setSessions((n) => n + 1)
            setRemaining(breakMin * 60)
            return 'break'
          }
          setRemaining(workMin * 60)
          return 'work'
        })
      }
    }, 250)
    return () => clearInterval(id)
  }, [running, workMin, breakMin])

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
    setRemaining(workMin * 60)
  }

  function setWorkMin(min) {
    setWorkMinState(min)
    localStorage.setItem('pomo_work_min', String(min))
    if (!running && phase === 'work') setRemaining(min * 60)
  }

  function setBreakMin(min) {
    setBreakMinState(min)
    localStorage.setItem('pomo_break_min', String(min))
    if (!running && phase === 'break') setRemaining(min * 60)
  }

  const total = (phase === 'work' ? workMin : breakMin) * 60

  return {
    phase, running, remaining, sessions, workMin, breakMin, total,
    start, pause, reset, setWorkMin, setBreakMin,
  }
}
