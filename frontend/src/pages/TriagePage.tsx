import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SymptomInput from '../components/SymptomInput'
import PredictionStream from '../components/PredictionStream'
import AnimatedBackground from '../components/AnimatedBackground'
import { triageApi } from '../services/triageApi'
import { useWebSocket } from '../hooks/useWebSocket'

export default function TriagePage() {
  const navigate = useNavigate()
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [rawText, setRawText] = useState('')
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const { prediction, status } = useWebSocket(sessionId)

  const handleSubmit = async () => {
    if (symptoms.length === 0 && !rawText.trim()) return
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const { data: session } = await triageApi.createSession({
        // TODO: replace with real patient_id from auth context
        patient_id: 'demo-patient-001',
        symptoms,
        raw_text: rawText,
      })
      // Setting sessionId triggers useWebSocket to open the WS connection
      setSessionId(session.id)
    } catch (err: any) {
      setSubmitError(err.response?.data?.detail ?? 'Failed to create session')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isStreaming = status === 'connected' || status === 'connecting'
  const hasStarted = sessionId !== null

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
          </span>
        </div>
        <div className="flex items-center gap-3">
          {/* Live WS status indicator */}
          <div className="flex items-center gap-1.5">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: status === 'connected' ? '#10b981'
                  : status === 'error' ? '#ef4444'
                  : '#64748b',
                boxShadow: status === 'connected' ? '0 0 6px #10b981' : 'none',
              }}
            />
            <span className="text-xs text-slate-500 capitalize">{status}</span>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            Doctor view →
          </button>
        </div>
      </nav>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* LEFT — Input form */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: 'rgba(15,23,42,0.85)',
              border: '0.5px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <h1 className="text-lg font-semibold text-slate-100 mb-1">Patient triage</h1>
            <p className="text-xs text-slate-500 mb-6">Enter symptoms to get an AI-powered urgency assessment</p>

            {/* Symptom tags */}
            <div className="mb-4">
              <label className="block text-xs text-slate-400 mb-2 tracking-wide uppercase">
                Symptoms
              </label>
              <SymptomInput
                symptoms={symptoms}
                onChange={setSymptoms}
                disabled={hasStarted}
              />
              <p className="text-xs text-slate-600 mt-1.5">Press Enter or comma after each symptom</p>
            </div>

            {/* Free text */}
            <div className="mb-6">
              <label className="block text-xs text-slate-400 mb-2 tracking-wide uppercase">
                Additional context
              </label>
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                disabled={hasStarted}
                placeholder="Patient reports chest pain radiating to left arm, onset 2 hours ago..."
                rows={4}
                className="w-full rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 outline-none resize-none transition-all focus:ring-2"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '0.5px solid rgba(255,255,255,0.1)',
                  // @ts-ignore
                  '--tw-ring-color': 'rgba(37,99,235,0.3)',
                }}
              />
            </div>

            {submitError && (
              <div
                className="mb-4 rounded-lg px-3 py-2 text-xs"
                style={{ background: 'rgba(239,68,68,0.08)', border: '0.5px solid rgba(239,68,68,0.2)', color: '#f87171' }}
              >
                {submitError}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={isSubmitting || hasStarted || (symptoms.length === 0 && !rawText.trim())}
              className="w-full py-2.5 rounded-lg text-sm font-medium text-white transition-all active:scale-[0.99] disabled:opacity-40"
              style={{ background: hasStarted ? 'rgba(16,185,129,0.3)' : 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}
            >
              {isSubmitting ? 'Creating session...'
                : hasStarted ? '✓ Session active — streaming'
                : 'Run triage assessment'}
            </button>

            {/* Session info */}
            {sessionId && (
              <p className="text-center text-xs text-slate-600 mt-3">
                Session ID: <span className="font-mono text-slate-500">{sessionId.slice(0, 8)}…</span>
              </p>
            )}
          </div>

          {/* RIGHT — Live prediction stream */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: 'rgba(15,23,42,0.85)',
              border: '0.5px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(20px)',
              minHeight: '400px',
            }}
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-100">Prediction</h2>
                <p className="text-xs text-slate-500">Streaming from ML service via gRPC</p>
              </div>
              {isStreaming && (
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs text-emerald-400">Live</span>
                </div>
              )}
            </div>

            {!hasStarted ? (
              <div className="flex flex-col items-center justify-center h-48 text-center">
                <div
                  className="w-12 h-12 rounded-xl mb-3 flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)' }}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 3v14M3 10h14" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </div>
                <p className="text-sm text-slate-500">Enter symptoms and submit to see live predictions</p>
              </div>
            ) : (
              <PredictionStream prediction={prediction} status={status} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}