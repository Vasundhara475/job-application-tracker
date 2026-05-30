// 🗂️ Kanban Column Component
const STATUS_COLORS = {
  Saved: 'border-gray-300 dark:border-gray-600',
  Applied: 'border-blue-400',
  OA: 'border-yellow-400',
  Screening: 'border-purple-400',
  Interview: 'border-indigo-400',
  Offer: 'border-green-400',
  Accepted: 'border-emerald-500',
  Rejected: 'border-red-400',
};

const STATUS_BG = {
  Saved: 'bg-gray-50 dark:bg-gray-800/50',
  Applied: 'bg-blue-50 dark:bg-blue-900/10',
  OA: 'bg-yellow-50 dark:bg-yellow-900/10',
  Screening: 'bg-purple-50 dark:bg-purple-900/10',
  Interview: 'bg-indigo-50 dark:bg-indigo-900/10',
  Offer: 'bg-green-50 dark:bg-green-900/10',
  Accepted: 'bg-emerald-50 dark:bg-emerald-900/10',
  Rejected: 'bg-red-50 dark:bg-red-900/10',
};

const STATUS_EMOJI = {
  Saved: '🔖',
  Applied: '📤',
  OA: '📝',
  Screening: '📞',
  Interview: '🎯',
  Offer: '🎉',
  Accepted: '✅',
  Rejected: '❌',
};

export default function KanbanColumn({ status, applications }) {
  return (
    <div
      className={`${STATUS_BG[status]} rounded-2xl border-t-4 ${STATUS_COLORS[status]} p-3 min-w-[200px]`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <span className="text-base">{STATUS_EMOJI[status]}</span>
          <span className="font-display font-semibold text-sm text-gray-700 dark:text-gray-300">
            {status}
          </span>
        </div>
        <span className="bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-bold px-2 py-0.5 rounded-full">
          {applications.length}
        </span>
      </div>

      {/* Cards */}
      <div className="space-y-2">
        {applications.map((app) => (
          <div
            key={app._id}
            className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-100 dark:border-gray-700"
          >
            <p className="font-semibold text-xs text-gray-900 dark:text-white leading-tight mb-0.5">
              {app.roleTitle}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{app.companyName}</p>
            {app.location && (
              <p className="text-xs text-gray-400 mt-1">📍 {app.location}</p>
            )}
          </div>
        ))}

        {applications.length === 0 && (
          <div className="text-center py-4 text-gray-400 text-xs">
            <div className="text-2xl mb-1">📭</div>
            <p>No applications</p>
          </div>
        )}
      </div>
    </div>
  );
}