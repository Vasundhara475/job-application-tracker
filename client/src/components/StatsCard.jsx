// 📊 Stats Card Component
export default function StatsCard({ emoji, label, value, color, subtitle }) {
  const colorMap = {
    indigo: 'from-indigo-500 to-indigo-600 shadow-indigo-200 dark:shadow-indigo-900/30',
    green: 'from-emerald-500 to-emerald-600 shadow-emerald-200 dark:shadow-emerald-900/30',
    yellow: 'from-amber-400 to-amber-500 shadow-amber-200 dark:shadow-amber-900/30',
    red: 'from-red-500 to-red-600 shadow-red-200 dark:shadow-red-900/30',
    purple: 'from-purple-500 to-purple-600 shadow-purple-200 dark:shadow-purple-900/30',
    blue: 'from-blue-500 to-blue-600 shadow-blue-200 dark:shadow-blue-900/30',
  };

  return (
    <div className="card p-5 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">{label}</p>
          <p className="text-3xl font-display font-bold text-gray-900 dark:text-white">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div
          className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${colorMap[color] || colorMap.indigo} shadow-lg flex items-center justify-center text-2xl`}
        >
          {emoji}
        </div>
      </div>
    </div>
  );
}