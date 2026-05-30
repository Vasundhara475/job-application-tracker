// 🔑 Login Page
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      login(data.user, data.token);
      toast.success(`🎉 Welcome back, ${data.user.name}!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || '❌ Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => setForm({ email: 'demo@jobtracker.com', password: 'password123' });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 flex items-center justify-center p-4">
      {/* Background Decoration */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-indigo-200 dark:bg-indigo-900/30 rounded-full blur-3xl opacity-60 animate-float" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-200 dark:bg-purple-900/30 rounded-full blur-3xl opacity-60" />

      <div className="w-full max-w-md relative">
        {/* Card */}
        <div className="card p-8 animate-fade-in">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-3 animate-float inline-block">🚀</div>
            <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white mb-1">
              Welcome Back!
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Sign in to your Job Tracker
            </p>
          </div>

          {/* Demo Badge */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">🎯 Try Demo Account</p>
              <p className="text-xs text-amber-600 dark:text-amber-500">demo@jobtracker.com / password123</p>
            </div>
            <button
              onClick={fillDemo}
              className="text-xs bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-lg font-medium transition-colors"
            >
              Fill
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                📧 Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                🔐 Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="input-field"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? '⏳ Signing in...' : '🔑 Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
              Register here 🎯
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}