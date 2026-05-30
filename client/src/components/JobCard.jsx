// 📋 Job Application Card Component
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';

const STATUS_CONFIG = {
  Saved: { color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300', emoji: '🔖' },
  Applied: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300', emoji: '📤' },
  OA: { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300', emoji: '📝' },
  Screening: { color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300', emoji: '📞' },
  Interview: { color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300', emoji: '🎯' },
  Offer: { color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300', emoji: '🎉' },
  Accepted: { color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300', emoji: '✅' },
  Rejected: { color: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300', emoji: '❌' },
  Withdrawn: { color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300', emoji: '↩️' },
};

const PRIORITY_CONFIG = {
  High: 'text-red-500',
  Medium: 'text-yellow-500',
  Low: 'text-gray-400',
};

export default function JobCard({ application, onDelete }) {
  const navigate = useNavigate();
  const { _id, companyName, roleTitle, location, status, source, salaryNote, appliedDate, priority, skills } = application;
  const statusCfg = STATUS_CONFIG[status] || STATUS_CONFIG.Applied;

  const handleDelete = async () => {
    if (!window.confirm(`🗑️ Delete application for ${roleTitle} at ${companyName}?`)) return;
    try {
      await api.delete(`/jobs/${_id}`);
      toast.success('🗑️ Application deleted!');
      onDelete?.(_id);
    } catch {
      toast.error('❌ Failed to delete');
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="card p-5 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 animate-slide-in group">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 flex items-center justify-center text-lg font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
            {companyName.replace(/[^\w]/g, '').slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 className="font-display font-semibold text-gray-900 dark:text-white leading-tight">
              {roleTitle}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{companyName}</p>
          </div>
        </div>
        <span className={`status-badge ${statusCfg.color}`}>
          {statusCfg.emoji} {status}
        </span>
      </div>

      {/* Details */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400 mb-3">
        <span>📍 {location || 'Remote'}</span>
        <span>🌐 {source}</span>
        {salaryNote && <span>💰 {salaryNote}</span>}
        <span>📅 {formatDate(appliedDate)}</span>
        <span className={`font-semibold ${PRIORITY_CONFIG[priority]}`}>
          {priority === 'High' ? '🔴' : priority === 'Medium' ? '🟡' : '🟢'} {priority}
        </span>
      </div>

      {/* Skills */}
      {skills?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-medium"
            >
              {skill}
            </span>
          ))}
          {skills.length > 4 && (
            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 rounded-lg text-xs">
              +{skills.length - 4}
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
        <button
          onClick={() => navigate(`/edit/${_id}`)}
          className="flex-1 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded-xl transition-all duration-200"
        >
          ✏️ Edit
        </button>
        <button
          onClick={handleDelete}
          className="flex-1 py-2 text-xs font-semibold text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-xl transition-all duration-200"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}