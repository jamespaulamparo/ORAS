import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Calendar, CheckCircle2, ArrowRight } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isRegister) {
        if (password !== passwordConfirm) {
          setError('Passwords do not match.');
          setIsLoading(false);
          return;
        }
        await register({
          username,
          email,
          password,
          password_confirm: passwordConfirm,
        });
      } else {
        await login(username, password);
      }
    } catch (err: any) {
      if (err.data) {
        const firstError = Object.values(err.data).flat()[0];
        setError(typeof firstError === 'string' ? firstError : 'Authentication failed.');
      } else {
        setError(err.message || 'An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Minimal header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-accent text-accent-contrast mb-3">
            <Calendar size={20} />
          </div>
          <h1 className="text-xl font-medium tracking-tight text-fg">
            Student Schedule Planner
          </h1>
          <p className="text-xs text-fg-muted mt-1">
            Organize courses, detect overlaps, and craft a conflict-free timetable.
          </p>
        </div>

        {/* Card */}
        <div className="bg-surface rounded-lg border border-border-default p-6 shadow-soft">
          <div className="flex border-b border-border-subtle mb-6 pb-2 text-xs font-medium">
            <button
              type="button"
              onClick={() => { setIsRegister(false); setError(null); }}
              className={`flex-1 pb-2 transition-colors border-b-2 -mb-2 ${
                !isRegister
                  ? 'border-accent text-fg font-semibold'
                  : 'border-transparent text-fg-muted hover:text-fg'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsRegister(true); setError(null); }}
              className={`flex-1 pb-2 transition-colors border-b-2 -mb-2 ${
                isRegister
                  ? 'border-accent text-fg font-semibold'
                  : 'border-transparent text-fg-muted hover:text-fg'
              }`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-md bg-status-danger-surface border border-status-danger-border text-xs text-status-danger">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Username"
              type="text"
              required
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. jdoe24"
            />

            {isRegister && (
              <Input
                label="Email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@university.edu"
              />
            )}

            <Input
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />

            {isRegister && (
              <Input
                label="Confirm Password"
                type="password"
                required
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="••••••••"
              />
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              isLoading={isLoading}
            >
              {isRegister ? 'Create Account' : 'Sign In'}
              <ArrowRight size={14} className="ml-1" />
            </Button>
          </form>
        </div>

        {/* Minimal hint */}
        <p className="text-[11px] text-center text-fg-muted mt-6">
          Private, student-controlled scheduling tool. No university account required.
        </p>
      </div>
    </div>
  );
};
