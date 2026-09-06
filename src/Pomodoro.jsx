import { format } from './pomodoro'

export default function Pomodoro({ pomo }) {
  const { phase, running, remaining, sessions, workMin, breakMin, total, start, pause, reset, setWorkMin, setBreakMin } = pomo
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

      <div style={{ display: 'flex', gap: 12, marginTop: 28, textAlign: 'left' }}>
        <label style={{ flex: 1 }}>
          <div className="notes" style={{ marginBottom: 6 }}>Focus (min)</div>
          <input
            type="number" min={1} max={180} value={workMin} disabled={running}
            onChange={(e) => setWorkMin(Math.max(1, Math.min(180, Number(e.target.value) || 1)))}
          />
        </label>
        <label style={{ flex: 1 }}>
          <div className="notes" style={{ marginBottom: 6 }}>Break (min)</div>
          <input
            type="number" min={1} max={60} value={breakMin} disabled={running}
            onChange={(e) => setBreakMin(Math.max(1, Math.min(60, Number(e.target.value) || 1)))}
          />
        </label>
      </div>
      {running && <div className="notes" style={{ marginTop: 8 }}>Pause to change the durations.</div>}
    </div>
  )
}
