// 🏠 Dashboard Page
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import StatsCard from '../components/StatsCard';
import KanbanColumn from '../components/KanbanColumn';
import toast from 'react-hot-toast';

const KANBAN_STAGES = ['Applied', 'OA', 'Screening', 'Interview', 'Offer'];

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const [statsRes, appsRes] = await Promise.all([
          api.get('/stats/summary'),
          api.get('/jobs'),
        ]);
        if (cancelled) return;
        setStats(statsRes.data);
        setApplications(appsRes.data.applications);
      } catch (err) {
        if (!cancelled) {
          console.error('Dashboard fetch error:', err);
          toast.error('❌ Failed to load dashboard data');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => { cancelled = true; };
  }, []);

  const getColumnApps = (status) => applications.filter((a) => a.status === status);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center animate-fade-in">
          <div className="text-5xl animate-bounce mb-4">⚡</div>
          <p className="text-gray-500 font-display font-semibold">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl text-gray-900 dark:text-white">
            👋 Hey, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Here&apos;s your job search overview ✨
          </p>
        </div>
        <Link to="/add" className="btn-primary flex items-center gap-2">
          ➕ Add Application
        </Link>
      </div>

      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard emoji="📋" label="Total Applications" value={stats.total} color="indigo" subtitle="All time" />
          <StatsCard emoji="🎯" label="Interviews" value={stats.interviews} color="purple" subtitle="Active rounds" />
          <StatsCard emoji="🎉" label="Offers" value={stats.offers} color="green" subtitle="Received" />
          <StatsCard emoji="📈" label="Response Rate" value={`${stats.responseRate}%`} color="blue" subtitle="Callbacks received" />
        </div>
      )}

      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard emoji="📤" label="Applied" value={stats.applied} color="blue" />
          <StatsCard emoji="❌" label="Rejected" value={stats.rejected} color="red" />
          <StatsCard emoji="✅" label="Accepted" value={stats.accepted} color="green" />
          <StatsCard emoji="🔥" label="This Week" value={stats.recentCount} color="yellow" subtitle="New applications" />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { to: '/add', emoji: '➕', label: 'Add New Application', color: 'bg-indigo-600 text-white' },
          { to: '/applications', emoji: '📋', label: 'View All Applications', color: 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700' },
          { to: '/analytics', emoji: '📊', label: 'View Analytics', color: 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700' },
        ].map(({ to, emoji, label, color }) => (
          <Link
            key={to}
            to={to}
            className={`${color} rounded-2xl p-4 flex items-center gap-3 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 font-semibold`}
          >
            <span className="text-2xl">{emoji}</span>
            {label}
          </Link>
        ))}
      </div>

      <div className="mb-4">
        <h2 className="font-display font-bold text-xl text-gray-900 dark:text-white mb-4">
          🗂️ Pipeline Overview
        </h2>
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {KANBAN_STAGES.map((stage) => (
              <div key={stage} className="w-52">
                <KanbanColumn status={stage} applications={getColumnApps(stage)} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}