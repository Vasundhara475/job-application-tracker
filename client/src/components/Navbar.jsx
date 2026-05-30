// 🧭 Navbar Component
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const navLinks = [
  { path: '/dashboard', label: '🏠 Dashboard' },
  { path: '/applications', label: '📋 Applications' },
  { path: '/add', label: '➕ Add New' },
  { path: '/analytics', label: '📊 Analytics' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('darkMode') === 'true';
    setDarkMode(saved);
    if (saved) document.documentElement.classList.add('dark');
  }, []);

  const toggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem('darkMode', next);
    document.documentElement.classList.toggle('dark', next);
  };

  const handleLogout = () => {
    logout();
    toast.success('👋 Logged out successfully!');
    navigate('/login');
  };

  const getInitials = (name) =>
    name
      ? name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)
      : 'U';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="text-2xl animate-float inline-block">🚀</span>
            <span className="font-display font-bold text-xl gradient-text hidden sm:block">
              JobTracker
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  location.pathname === path
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900/30'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Right section */}
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDark}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 text-lg"
              title="Toggle theme"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>

            {/* User avatar + logout */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-md">
                {getInitials(user?.name)}
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300 max-w-[100px] truncate">
                {user?.name?.split(' ')[0]}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-1 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 font-medium"
            >
              🚪 Logout
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800"
            >
              {mobileOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden py-3 border-t border-gray-200 dark:border-gray-700 animate-fade-in">
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2.5 rounded-xl mb-1 text-sm font-medium transition-all ${
                  location.pathname === path
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium"
            >
              🚪 Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}