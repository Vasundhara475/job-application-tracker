// 📊 Analytics Page
import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line,
} from 'recharts';
import api from '../utils/api';

const FUNNEL_COLORS = {
  Saved: '#94a3b8',
  Applied: '#3b82f6',
  OA: '#f59e0b',
  Screening: '#8b5cf6',
  Interview: '#6366f1',
  Offer: '#10b981',
  Accepted: '#059669',
  Rejected: '#ef4444',
};

const PIE_COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#f97316', '#06b6d4'];

export default function Analytics() {
  const [summary, setSummary] = useState(null);
  const [funnel, setFunnel] = useState([]);
  const [sources, setSources] = useState([]);
  const [weekly, setWeekly] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const [summaryRes, funnelRes, weeklyRes] = await Promise.all([
          api.get('/stats/summary'),
          api.get('/stats/funnel'),
          api.get('/stats/weekly'),
        ]);
        if (cancelled) return;
        setSummary(summaryRes.data);
        setFunnel(funnelRes.data.funnel);
        setSources(funnelRes.data.sources.map((s) => ({ name: s._id || 'Other', value: s.count })));
        setWeekly(weeklyRes.data.weekly.map((w) => ({ date: w._id, count: w.count })));
      } catch (err) {
        if (!cancelled) console.error('Analytics error:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-5xl animate-bounce mb-4">📊</div>
          <p className="text-gray-500 font-semibold">Crunching your data...</p>
        </div>
      </div>
    );
  }

  const funnelData = funnel.filter((f) => f.count > 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-gray-900 dark:text-white">
          📊 Analytics Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Insights into your job search performance
        </p>
      </div>

      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Applied', value: summary.total, emoji: '📋', bg: 'bg-indigo-50 dark:bg-indigo-900/20', color: 'text-indigo-600 dark:text-indigo-400' },
            { label: 'Response Rate', value: `${summary.responseRate}%`, emoji: '📈', bg: 'bg-green-50 dark:bg-green-900/20', color: 'text-green-600 dark:text-green-400' },
            { label: 'Offers', value: summary.offers, emoji: '🎉', bg: 'bg-yellow-50 dark:bg-yellow-900/20', color: 'text-yellow-600 dark:text-yellow-400' },
            { label: 'Accepted', value: summary.accepted, emoji: '✅', bg: 'bg-emerald-50 dark:bg-emerald-900/20', color: 'text-emerald-600 dark:text-emerald-400' },
          ].map((m) => (
            <div key={m.label} className={`card p-5 ${m.bg}`}>
              <div className="text-3xl mb-1">{m.emoji}</div>
              <div className={`font-display font-bold text-3xl ${m.color}`}>{m.value}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">{m.label}</div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card p-6">
          <h2 className="font-display font-semibold text-lg mb-4 text-gray-900 dark:text-white">
            🔽 Application Funnel
          </h2>
          {funnelData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={funnelData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="stage" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {funnelData.map((entry) => (
                    <Cell key={entry.stage} fill={FUNNEL_COLORS[entry.stage] || '#6366f1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">📭 No data yet</div>
          )}
        </div>

        <div className="card p-6">
          <h2 className="font-display font-semibold text-lg mb-4 text-gray-900 dark:text-white">
            🌐 Applications by Source
          </h2>
          {sources.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={sources} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                    {sources.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 justify-center mt-2">
                {sources.map((s, i) => (
                  <div key={s.name} className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                    {s.name} ({s.value})
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">📭 No data yet</div>
          )}
        </div>
      </div>

      <div className="card p-6">
        <h2 className="font-display font-semibold text-lg mb-4 text-gray-900 dark:text-white">
          📅 Daily Application Activity (Last 6 Weeks)
        </h2>
        {weekly.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={weekly} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2.5} dot={{ fill: '#6366f1', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-48 text-gray-400">
            <div className="text-center">
              <div className="text-4xl mb-2">📭</div>
              <p>No activity data yet. Start adding applications!</p>
            </div>
          </div>
        )}
      </div>

      <div className="card p-6 mt-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-100 dark:border-indigo-800">
        <h2 className="font-display font-semibold text-lg mb-3 text-indigo-800 dark:text-indigo-300">
          💡 Job Search Tips
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            '🎯 Aim for 5-10 quality applications per week',
            '📧 Always follow up within 5 business days',
            '🔍 Research company culture before interviews',
            '💼 Tailor your resume for each application',
            '🤝 Leverage referrals — they have 3-5x success rate',
            '📊 Track your response rate to improve strategy',
          ].map((tip) => (
            <div key={tip} className="flex items-start gap-2 text-sm text-indigo-700 dark:text-indigo-300">
              <span className="mt-0.5 shrink-0">{tip.slice(0, 2)}</span>
              <span>{tip.slice(3)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}