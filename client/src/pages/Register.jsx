// 📝 Register Page
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error('🔐 Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', form);
      login(data.user, data.token);
      toast.success('🎉 Account created! Welcome aboard!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || '❌ Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950 flex items-center justify-center p-4">
      <div className="absolute top-20 right-10 w-32 h-32 bg-purple-200 dark:bg-purple-900/30 rounded-full blur-3xl opacity-60 animate-float" />
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-indigo-200 dark:bg-indigo-900/30 rounded-full blur-3xl opacity-60" />

      <div className="w-full max-w-md relative">
        <div className="card p-8 animate-fade-in">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🎯</div>
            <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white mb-1">
              Start Your Journey!
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Create your free Job Tracker account
            </p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {['📊 Track All Apps', '🎯 Stay Focused', '📈 Analytics'].map((b) => (
              <div key={b} className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-2 text-center text-xs font-medium text-indigo-700 dark:text-indigo-400">
                {b}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                👤 Full Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Rahul Sharma"
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                📧 Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="rahul@example.com"
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
                placeholder="Min 6 characters"
                required
                className="input-field"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-base disabled:opacity-60"
            >
              {loading ? '⏳ Creating account...' : '🚀 Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
              Sign in 🔑
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}