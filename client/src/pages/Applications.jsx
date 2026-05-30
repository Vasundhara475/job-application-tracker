// 📋 Applications List Page
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import JobCard from '../components/JobCard';
import toast from 'react-hot-toast';

const STATUSES = ['All', 'Saved', 'Applied', 'OA', 'Screening', 'Interview', 'Offer', 'Accepted', 'Rejected', 'Withdrawn'];

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('All');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('-createdAt');

  // Fetch from API whenever sort changes
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const { data } = await api.get('/jobs', { params: { sort } });
        if (!cancelled) setApplications(data.applications);
      } catch {
        if (!cancelled) toast.error('❌ Failed to load applications');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => { cancelled = true; };
  }, [sort]);

  // Re-filter whenever source data, status filter, or search changes
  const applyFilters = useCallback(() => {
    let result = [...applications];
    if (status !== 'All') result = result.filter((a) => a.status === status);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.companyName?.toLowerCase().includes(q) ||
          a.roleTitle?.toLowerCase().includes(q) ||
          a.location?.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [applications, status, search]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleDelete = (id) => {
    setApplications((prev) => prev.filter((a) => a._id !== id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-5xl animate-bounce mb-4">📋</div>
          <p className="text-gray-500 font-semibold">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-3xl text-gray-900 dark:text-white">
            📋 All Applications
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {filtered.length} application{filtered.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <Link to="/add" className="btn-primary">➕ Add New</Link>
      </div>

      <div className="card p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search company, role, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-9"
            />
          </div>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="input-field sm:w-48">
            <option value="-createdAt">📅 Newest First</option>
            <option value="createdAt">📅 Oldest First</option>
            <option value="companyName">🔤 Company A-Z</option>
            <option value="-priority">🔴 Priority</option>
          </select>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                status === s
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900/30'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {s}
              {s !== 'All' && (
                <span className="ml-1 opacity-70">
                  ({applications.filter((a) => a.status === s).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((app) => (
            <JobCard key={app._id} application={app} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="font-display font-bold text-xl text-gray-700 dark:text-gray-300 mb-2">
            No applications found
          </h3>
          <p className="text-gray-400 mb-6">
            {search || status !== 'All' ? 'Try changing your filters' : "You haven't added any applications yet"}
          </p>
          <Link to="/add" className="btn-primary inline-flex items-center gap-2">
            ➕ Add Your First Application
          </Link>
        </div>
      )}
    </div>
  );
}