import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.detail || 'Login failed');
      }
      
      login(data.user, data.token);
      navigate(data.user.role === 'admin' ? '/admin' : '/citizen');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoMode = async (role) => {
    // Quick demo login overrides
    setEmail(role === 'admin' ? 'admin@civic.local' : 'citizen@example.com');
    setPassword(role === 'admin' ? 'admin123' : 'password');
    // They will need to click sign in
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
              <ShieldAlert className="w-7 h-7 text-white" />
            </div>
        </div>
        <h2 className="mt-6 text-center text-2xl font-bold text-slate-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Or{' '}
          <Link to="/signup" className="font-bold text-blue-600 hover:text-blue-700">
            register a new citizen account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 py-8 px-4 shadow-sm sm:rounded-xl sm:px-10 border border-slate-200 dark:border-slate-800 transition-colors duration-200">
          {error && <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-md text-sm border border-red-100">{error}</div>}
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-700">
                Email address or Phone
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-md placeholder-slate-400 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm transition-colors duration-200"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-slate-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-md placeholder-slate-400 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm transition-colors duration-200"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/reset-password" className="font-bold text-blue-600 hover:text-blue-700">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-wider">
                <span className="px-2 bg-white text-slate-500">Demo Access</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleDemoMode('citizen')}
                className="w-full flex justify-center py-2 px-4 border border-slate-200 dark:border-slate-700 rounded-md shadow-sm bg-white dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Fill Guest
              </button>
              <button
                type="button"
                onClick={() => handleDemoMode('admin')}
                className="w-full flex justify-center py-2 px-4 border border-slate-200 dark:border-slate-700 rounded-md shadow-sm bg-white dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Fill Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
