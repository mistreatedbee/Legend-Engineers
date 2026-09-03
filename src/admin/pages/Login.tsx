import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, Lock } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { ErrorText } from '../components/Notify';

export function Login() {
  const { admin, loading, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && admin) {
    return <Navigate to="/admin" replace />;
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/admin', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-ink flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Ambient background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }}
      />
      <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-brand-600/20 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-brand-700/20 blur-[100px]" />

      <div className="relative w-full max-w-[26rem]">
        <div className="text-center mb-9">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/5 border border-white/10 mb-5 overflow-hidden p-2">
            <img src="/logo.jpg" alt="EG Legend" className="h-full w-full object-contain" />
          </div>
          <span className="block font-display text-4xl text-white tracking-tight">EG Legend</span>
          <span className="block text-[11px] uppercase tracking-[0.28em] text-white/40 mt-2">
            Admin Dashboard
          </span>
        </div>

        <form
          onSubmit={submit}
          className="bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] p-8 space-y-6 border border-white/5">
          <div>
            <h1 className="text-xl font-semibold text-ink">Welcome back</h1>
            <p className="text-sm text-ink/50 mt-1">Sign in to manage the website.</p>
          </div>

          {error && <ErrorText>{error}</ErrorText>}

          <label className="block">
            <span className="block text-xs font-semibold uppercase tracking-wide text-ink/50 mb-2">
              Email address
            </span>
            <input
              type="email"
              required
              autoFocus
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@enerdgegroup.co.za"
              className="w-full rounded-xl border border-ink/15 bg-cream-50 px-4 py-3 text-sm text-ink placeholder:text-ink/30 outline-none transition-all focus:border-brand-700 focus:ring-4 focus:ring-brand-700/10"
            />
          </label>

          <label className="block">
            <span className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-ink/50">Password</span>
            </span>
            <div className="relative">
              <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/25" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-ink/15 bg-cream-50 pl-10 pr-11 py-3 text-sm text-ink placeholder:text-ink/30 outline-none transition-all focus:border-brand-700 focus:ring-4 focus:ring-brand-700/10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/35 hover:text-ink/70 transition-colors">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="group w-full inline-flex items-center justify-center gap-2 rounded-xl bg-ink hover:bg-brand-700 text-white font-medium text-sm py-3.5 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
            {submitting ? (
              <>
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in…
              </>
            ) : (
              <>
                Sign in
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>
        </form>

        <p className="flex items-center justify-center gap-1.5 text-center text-xs text-white/30 mt-7">
          <Lock size={11} />
          Authorised personnel only — this area is not for public access.
        </p>
      </div>
    </div>
  );
}
