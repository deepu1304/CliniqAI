import { useNavigate } from 'react-router-dom'
import LoginForm from '../components/LoginForm'
import AnimatedBackground from '../components/AnimatedBackground'  
import { useAuth } from '../hooks/useAuth'
import type { LoginCredentials } from '../types/auth'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, isLoading, error } = useAuth()

  const handleSubmit = async (creds: LoginCredentials) => {
    await login(creds)
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex bg-[#0a0f1e] relative overflow-hidden">

      {/* ── Animated particle network background ── */}
      <AnimatedBackground />

      {/* ── Subtle radial glows on top of canvas ── */}
      <div className="absolute top-0 left-0 w-150 h-150 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div className="absolute bottom-0 right-0 w-125 h-125 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* ── Grid overlay ── */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />

      {/* ── Left branding panel ── */}
      <div className="hidden lg:flex flex-1 flex-col justify-center px-16 relative z-10">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #2563eb, #10b981)' }}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M10 3v14M3 10h14" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-lg font-semibold text-slate-100">
            Cliniq<span className="text-emerald-400">AI</span>
          </span>
        </div>

        <p className="text-xs uppercase tracking-widest text-slate-500 mb-6">
          Clinical Triage &amp; Decision Support
        </p>
        <h1 className="text-4xl font-semibold text-slate-100 leading-tight mb-4">
          Smarter triage.<br />
          <span className="text-emerald-400">Faster care.</span>
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
          Real-time ML-powered urgency predictions with SHAP explainability — built for clinical teams.
        </p>

        <div className="flex gap-6 mt-10">
          {[['1.2s', 'avg prediction'], ['94%', 'accuracy'], ['L1–5', 'urgency scale']].map(([val, label]) => (
            <div key={val} className="border border-white/8 rounded-lg px-4 py-3"
              style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className="text-lg font-semibold text-slate-100">{val}</div>
              <div className="text-xs text-slate-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* ECG line */}
        <div className="mt-10 opacity-20">
          <svg width="320" height="40" viewBox="0 0 320 40">
            <polyline
              points="0,20 30,20 40,4 48,36 56,20 80,20 90,12 96,28 100,20 130,20 140,2 148,38 156,20 180,20 190,14 196,26 200,20 230,20 240,4 248,36 256,20 280,20 290,12 296,28 300,20 320,20"
              fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* ── Right login form ── */}
      <div className="w-full lg:w-105 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-sm rounded-2xl p-8"
          style={{
            background: 'rgba(15, 23, 42, 0.85)',
            border: '0.5px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}>

          <div className="mb-7">
            <h2 className="text-xl font-semibold text-slate-100">Welcome back</h2>
            <p className="text-xs text-slate-500 mt-1">Sign in to your clinical dashboard</p>
          </div>

          <LoginForm onSubmit={handleSubmit} isLoading={isLoading} error={error} />

          <div className="flex items-center gap-2 mt-6">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
            <span className="text-xs text-slate-600">or</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
          </div>

          <button className="w-full mt-4 py-2.5 rounded-lg text-xs text-slate-400 flex items-center justify-center gap-2 transition-colors"
            style={{ border: '0.5px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}>
            Continue with Hospital SSO
          </button>

          <div className="flex items-center gap-2 mt-5 p-2.5 rounded-lg"
            style={{ background: 'rgba(16,185,129,0.05)', border: '0.5px solid rgba(16,185,129,0.15)' }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#10b981" strokeWidth="1.3">
              <path d="M6 1L1 3v3c0 2.8 2.2 5 5 5s5-2.2 5-5V3L6 1z" />
              <path d="M4 6l1.5 1.5L8 4" />
            </svg>
            <span className="text-xs" style={{ color: 'rgba(110,231,183,0.7)' }}>
              HIPAA compliant · TLS 1.3 · Audit logged
            </span>
          </div>

          <p className="text-center text-xs text-slate-600 mt-5">
            New to CliniqAI?{' '}
            <a href="#" className="text-blue-400 hover:underline">Request access</a>
          </p>
        </div>
      </div>
    </div>
  )
}