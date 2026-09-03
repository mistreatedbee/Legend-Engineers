import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { Field, Input, Button } from '../components/ui';
import { ErrorText } from '../components/Notify';

export function Login() {
  const { admin, loading, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="min-h-screen bg-ink flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="block font-display text-3xl text-white">EG Legend</span>
          <span className="block text-xs uppercase tracking-[0.2em] text-white/40 mt-1">
            Admin Dashboard
          </span>
        </div>

        <form onSubmit={submit} className="bg-white rounded-xl shadow-2xl p-7 space-y-5">
          <h1 className="text-lg font-semibold text-ink mb-1">Sign in</h1>

          {error && <ErrorText>{error}</ErrorText>}

          <Field label="Email address" required>
            <Input
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@enerdgegroup.co.za"
            />
          </Field>

          <Field label="Password" required>
            <Input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </Field>

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? 'Signing in…' : 'Sign in'}
            <ArrowRight size={16} />
          </Button>
        </form>

        <p className="text-center text-xs text-white/30 mt-6">
          Authorised personnel only. This area is not for public access.
        </p>
      </div>
    </div>
  );
}
