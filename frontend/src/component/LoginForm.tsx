import { useState } from 'react';
import type { LoginCredentials, UserRole } from '../types/auth';

interface Props {
  onSubmit: (creds: LoginCredentials) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const ROLES: UserRole[] = ['doctor', 'nurse', 'admin'];

export default function LoginForm({ onSubmit, isLoading, error }: Props) {
  const [role, setRole] = useState<UserRole>('doctor');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const pwValid = password.length >= 8;

  const strength = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;

  const strengthColors = ['', '#ef4444', '#f97316', '#eab308', '#10b981'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!emailValid || !pwValid) return;
    await onSubmit({ email, password, role });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full space-y-4">
      {/* Role selector */}
      <div className="flex bg-white/5 border border-white/10 rounded-lg p-1 gap-1">
        {ROLES.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={`flex-1 py-1.5 rounded-md text-xs font-medium capitalize transition-all ${
              role === r
                ? 'bg-blue-500/20 text-blue-400'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Email field */}
      <div>
        <label className="block text-xs text-slate-400 mb-1.5 tracking-wide">
          Hospital Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, email: true }))}
          placeholder={`${role}@hospital.org`}
          className={`w-full bg-white/5 border rounded-lg px-3 py-2.5 text-sm text-white
            placeholder:text-slate-600 outline-none transition-all
            focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/60
            ${touched.email && !emailValid ? 'border-red-500/60' : 'border-white/10'}`}
        />
        {touched.email && !emailValid && (
          <p className="text-xs text-red-400 mt-1">Enter a valid email address</p>
        )}
      </div>

      {/* Password field */}
      <div>
        <label className="block text-xs text-slate-400 mb-1.5 tracking-wide">
          Password
        </label>
        <div className="relative">
          <input
            type={showPw ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, password: true }))}
            placeholder="••••••••"
            className={`w-full bg-white/5 border rounded-lg px-3 py-2.5 pr-10 text-sm text-white
              placeholder:text-slate-600 outline-none transition-all
              focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/60
              ${touched.password && !pwValid ? 'border-red-500/60' : 'border-white/10'}`}
          />
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1"
          >
            {/* eye icon */}
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              {showPw
                ? <path d="M1 1l14 14M6.5 6.6A2 2 0 0 0 9.4 9.5M4 4.2C2.3 5.3 1 8 1 8s2.5 5 7 5c1.4 0 2.7-.4 3.8-1M7 3.1C7.3 3 7.7 3 8 3c4.5 0 7 5 7 5s-.7 1.5-2 2.8"/>
                : <><path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z"/><circle cx="8" cy="8" r="2"/></>
              }
            </svg>
          </button>
        </div>

        {/* Password strength bar — only shows when typing */}
        {password.length > 0 && (
          <div className="flex gap-1 mt-1.5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex-1 h-0.5 rounded-full transition-all duration-300"
                style={{ background: i <= strength ? strengthColors[strength] : 'rgba(255,255,255,0.08)' }}
              />
            ))}
          </div>
        )}

        {touched.password && !pwValid && (
          <p className="text-xs text-red-400 mt-1">Minimum 8 characters required</p>
        )}
      </div>

      {/* Server error from FastAPI */}
      {error && (
        <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white
          rounded-lg py-2.5 text-sm font-medium transition-all active:scale-[0.99]"
      >
        {isLoading ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );
}