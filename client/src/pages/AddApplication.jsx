// ➕ Add Application Page
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

const INITIAL_FORM = {
  companyName: '',
  roleTitle: '',
  location: '',
  jobUrl: '',
  source: 'LinkedIn',
  status: 'Applied',
  salaryNote: '',
  appliedDate: new Date().toISOString().split('T')[0],
  interviewDate: '',
  notes: '',
  skills: '',
  priority: 'Medium',
  contactName: '',
  contactEmail: '',
};

const SOURCES = ['LinkedIn', 'Naukri', 'Indeed', 'Company Website', 'Referral', 'Campus', 'Other'];
const STATUSES = ['Saved', 'Applied', 'OA', 'Screening', 'Interview', 'Offer', 'Accepted', 'Rejected', 'Withdrawn'];
const PRIORITIES = ['Low', 'Medium', 'High'];

const Field = ({ label, name, type = 'text', placeholder, options, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
      {label}
    </label>
    {options ? (
      <select name={name} value={value} onChange={onChange} className="input-field">
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="input-field"
      />
    )}
  </div>
);

export default function AddApplication() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.companyName.trim() || !form.roleTitle.trim()) {
      toast.error('⚠️ Company name and role title are required');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        skills: form.skills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        interviewDate: form.interviewDate || null,
      };
      await api.post('/jobs', payload);
      toast.success('🎉 Application added successfully!');
      navigate('/applications');
    } catch (err) {
      toast.error(err.response?.data?.message || '❌ Failed to add application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/applications"
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
        >
          ←
        </Link>
        <div>
          <h1 className="font-display font-bold text-3xl text-gray-900 dark:text-white">
            ➕ Add Application
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Track a new job opportunity
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Basic Info */}
        <div className="card p-6">
          <h2 className="font-display font-semibold text-lg mb-4 text-gray-900 dark:text-white">
            🏢 Basic Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Field
                label="🏢 Company Name *"
                name="companyName"
                placeholder="Google, Amazon, Flipkart..."
                value={form.companyName}
                onChange={handleChange}
              />
            </div>
            <div className="sm:col-span-2">
              <Field
                label="💼 Job Role / Title *"
                name="roleTitle"
                placeholder="Software Engineer, Full Stack Developer..."
                value={form.roleTitle}
                onChange={handleChange}
              />
            </div>
            <Field
              label="📍 Location"
              name="location"
              placeholder="Bangalore, Remote, Pune..."
              value={form.location}
              onChange={handleChange}
            />
            <Field
              label="🌐 Job URL"
              name="jobUrl"
              type="url"
              placeholder="https://careers.google.com/..."
              value={form.jobUrl}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Status & Source */}
        <div className="card p-6">
          <h2 className="font-display font-semibold text-lg mb-4 text-gray-900 dark:text-white">
            📊 Status & Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field
              label="📤 Current Status"
              name="status"
              options={STATUSES}
              value={form.status}
              onChange={handleChange}
            />
            <Field
              label="🌐 Source"
              name="source"
              options={SOURCES}
              value={form.source}
              onChange={handleChange}
            />
            <Field
              label="⚡ Priority"
              name="priority"
              options={PRIORITIES}
              value={form.priority}
              onChange={handleChange}
            />
            <Field
              label="💰 Salary Note"
              name="salaryNote"
              placeholder="₹20-25 LPA, $120k..."
              value={form.salaryNote}
              onChange={handleChange}
            />
            <Field
              label="📅 Applied Date"
              name="appliedDate"
              type="date"
              value={form.appliedDate}
              onChange={handleChange}
            />
            <Field
              label="🎯 Interview Date"
              name="interviewDate"
              type="date"
              value={form.interviewDate}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Skills & Notes */}
        <div className="card p-6">
          <h2 className="font-display font-semibold text-lg mb-4 text-gray-900 dark:text-white">
            🛠️ Skills & Notes
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                🔧 Required Skills (comma-separated)
              </label>
              <input
                type="text"
                name="skills"
                value={form.skills}
                onChange={handleChange}
                placeholder="React.js, Node.js, MongoDB, TypeScript..."
                className="input-field"
              />
              <p className="text-xs text-gray-400 mt-1">
                Separate multiple skills with commas
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                📝 Notes
              </label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Referral details, HR contact info, interview prep notes..."
                rows={4}
                className="input-field resize-none"
              />
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="card p-6">
          <h2 className="font-display font-semibold text-lg mb-4 text-gray-900 dark:text-white">
            👤 Contact Person (Optional)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="👤 Contact Name"
              name="contactName"
              placeholder="HR name, recruiter..."
              value={form.contactName}
              onChange={handleChange}
            />
            <Field
              label="📧 Contact Email"
              name="contactEmail"
              type="email"
              placeholder="hr@company.com"
              value={form.contactEmail}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <Link
            to="/applications"
            className="btn-secondary flex-1 text-center py-3"
          >
            ❌ Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex-1 py-3 text-base disabled:opacity-60"
          >
            {loading ? '⏳ Adding...' : '🚀 Add Application'}
          </button>
        </div>

      </form>
    </div>
  );
}