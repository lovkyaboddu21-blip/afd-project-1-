import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [zone, setZone] = useState('NDMC');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, zone })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Signup failed');
      
      login(data.user, data.token);
      navigate('/citizen');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
              <ShieldAlert className="w-7 h-7 text-white" />
            </div>
        </div>
        <h2 className="mt-6 text-center text-2xl font-bold text-slate-900">
          Create an account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-blue-600 hover:text-blue-700">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 py-8 px-4 shadow-sm sm:rounded-xl sm:px-10 border border-slate-200 dark:border-slate-800 transition-colors duration-200">
          {error && <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-md text-sm border border-red-100">{error}</div>}
          <form className="space-y-6" onSubmit={handleSignup}>
            <div>
              <label htmlFor="name" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-md placeholder-slate-400 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm transition-colors duration-200"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Email address or Phone
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-md placeholder-slate-400 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm transition-colors duration-200"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="zone" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                City Ward / Zone
              </label>
              <div className="mt-1">
                <select
                  id="zone"
                  name="zone"
                  value={zone}
                  onChange={e => setZone(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm transition-colors duration-200"
                >
                  <option value="NDMC">New Delhi (NDMC Area)</option>
                  <option value="SouthDelhi">South Delhi (Ward 1-40)</option>
                  <option value="NorthDelhi">North Delhi (Ward 41-80)</option>
                  <option value="EastDelhi">East Delhi (Ward 81-120)</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-md placeholder-slate-400 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm transition-colors duration-200"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                {loading ? 'Registering...' : 'Create Account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
