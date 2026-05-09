import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PredictionStream from '../components/PredictionStream'
import UrgencyBadge from '../components/UrgencyBadge'
import AnimatedBackground from '../components/AnimatedBackground'
import { useWebSocket } from '../hooks/useWebSocket'

// Mock recent sessions — replace with real API call to GET /triage/session later
const MOCK_SESSIONS = [
  { id: 'sess-abc123', patient: 'Ravi M.', age: 54, time: '2 min ago', urgency: 2 },
  { id: 'sess-def456', patient: 'Priya K.', age: 31, time: '18 min ago', urgency: 4 },
  { id: 'sess-ghi789', patient: 'Arjun S.', age: 67, time: '42 min ago', urgency: 3 },
]

export default function DoctorDashboard() {
  const navigate = useNavigate()
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [manualSessionId, setManualSessionId] = useState('')

  // Connect to whichever session the doctor selects
  const { prediction, status } = useWebSocket(activeSessionId)

  return (
    <div className="min-h-screen bg-[#0a0f1e] relative overflow-hidden">
      <AnimatedBackground />

      {/* Navbar */}
      <nav
        className="relative z-10 flex items-center justify-between px-6 py-4"
        style={{ borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #2563eb, #10b981)' }}
          >
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
              <path d="M10 3v14M3 10h14" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-slate-100">
            Cliniq<span className="text-emerald-400">AI</span>
            <span className="ml-2 text-xs text-slate-500 font-normal">Doctor view</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: status === 'connected' ? '#10b981' : '#64748b',
                boxShadow: status === 'connected' ? '0 0 6px #10b981' : 'none',
              }}
            />
            <span className="text-xs text-slate-500">{activeSessionId ? status : 'no session'}</span>
          </div>
          <button
            onClick={() => navigate('/triage')}
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            ← Triage form
          </button>
        </div>
      </nav>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT — Session list */}
          <div className="lg:col-span-1 space-y-4">

            {/* Manual session connect */}
            <div
              className="rounded-2xl p-4"
              style={{
                background: 'rgba(15,23,42,0.85)',
                border: '0.5px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Connect to session</p>
              <div className="flex gap-2">
                <input
                  value={manualSessionId}
                  onChange={(e) => setManualSessionId(e.target.value)}
                  placeholder="Paste session ID..."
                  className="flex-1 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder:text-slate-600 outline-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.1)' }}
                />
                <button
                  onClick={() => manualSessionId && setActiveSessionId(manualSessionId)}
                  className="px-3 py-2 rounded-lg text-xs font-medium text-white"
                  style={{ background: '#2563eb' }}
                >
                  Connect
                </button>
              </div>
            </div>

            {/* Recent sessions */}
            <div
              className="rounded-2xl p-4"
              style={{
                background: 'rgba(15,23,42,0.85)',
                border: '0.5px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-3">Recent sessions</p>
              <div className="space-y-2">
                {MOCK_SESSIONS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveSessionId(s.id)}
                    className="w-full text-left rounded-xl p-3 transition-all"
                    style={{
                      background: activeSessionId === s.id
                        ? 'rgba(37,99,235,0.15)'
                        : 'rgba(255,255,255,0.03)',
                      border: `0.5px solid ${activeSessionId === s.id ? 'rgba(37,99,235,0.4)' : 'rgba(255,255,255,0.06)'}`,
                    }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-slate-200">{s.patient}</span>
                      <UrgencyBadge level={s.urgency} size="sm" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">Age {s.age}</span>
                      <span className="text-slate-700">·</span>
                      <span className="text-xs text-slate-500">{s.time}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — Live prediction view */}
          <div className="lg:col-span-2">
            <div
              className="rounded-2xl p-6 h-full"
              style={{
                background: 'rgba(15,23,42,0.85)',
                border: '0.5px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(20px)',
                minHeight: '500px',
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-slate-100">Live triage result</h2>
                  <p className="text-xs text-slate-500">
                    {activeSessionId
                      ? `Session: ${activeSessionId.slice(0, 8)}…`
                      : 'Select a session to monitor'}
                  </p>
                </div>
                {status === 'connected' && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                    style={{ background: 'rgba(16,185,129,0.1)', border: '0.5px solid rgba(16,185,129,0.2)' }}>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs text-emerald-400">Streaming</span>
                  </div>
                )}
              </div>

              {!activeSessionId ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <p className="text-slate-500 text-sm">No active session selected</p>
                  <p className="text-slate-600 text-xs mt-1">Pick one from the list or paste a session ID</p>
                </div>
              ) : (
                <PredictionStream prediction={prediction} status={status} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}