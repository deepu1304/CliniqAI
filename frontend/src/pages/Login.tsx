import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { useAuth } from '../hooks/useAuth';
import type { LoginCredentials } from '../types/auth';


export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuth();

  const handleSubmit = async (creds: LoginCredentials) => {
    await login(creds);
    navigate('/dashboard');  // will expand as you build more pages
  };

  return (
    <div className="min-h-screen flex bg-[#0a0f1e]">

      {/* Background decorations */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.06)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Left: branding panel */}
      <div className="hidden lg:flex flex-1 flex-col justify-center px-16 relative">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M10 3v14M3 10h14" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/>
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
            <div key={val} className="bg-white/5 border border-white/8 rounded-lg px-4 py-3">
              <div className="text-lg font-semibold text-slate-100">{val}</div>
              <div className="text-xs text-slate-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: login form */}
      <div className="w-full lg:w-[420px] flex items-center justify-center p-8">
        <div className="w-full max-w-sm bg-slate-900/90 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
          <div className="mb-7">
            <h2 className="text-xl font-semibold text-slate-100">Welcome back</h2>
            <p className="text-xs text-slate-500 mt-1">Sign in to your clinical dashboard</p>
          </div>

          <LoginForm onSubmit={handleSubmit} isLoading={isLoading} error={error} />

          <div className="flex items-center gap-2 mt-6">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-xs text-slate-600">or</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          <button className="w-full mt-4 py-2.5 rounded-lg border border-white/8 bg-white/4
            text-xs text-slate-400 hover:bg-white/8 transition-colors flex items-center justify-center gap-2">
            Continue with Hospital SSO
          </button>

          <div className="flex items-center gap-2 mt-5 p-2.5 bg-emerald-500/5 border border-emerald-500/15 rounded-lg">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#10b981" strokeWidth="1.3">
              <path d="M6 1L1 3v3c0 2.8 2.2 5 5 5s5-2.2 5-5V3L6 1z"/>
              <path d="M4 6l1.5 1.5L8 4"/>
            </svg>
            <span className="text-xs text-emerald-300/70">HIPAA compliant · TLS 1.3 · Audit logged</span>
          </div>

          <p className="text-center text-xs text-slate-600 mt-5">
            New to CliniqAI?{' '}
            <a href="#" className="text-blue-400 hover:underline">Request access</a>
          </p>
        </div>
      </div>
    </div>
  );
}