// ✏️ Edit Application Page
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import TaskItem from '../components/TaskItem';

const STATUSES = ['Saved', 'Applied', 'OA', 'Screening', 'Interview', 'Offer', 'Accepted', 'Rejected', 'Withdrawn'];
const PRIORITIES = ['Low', 'Medium', 'High'];
const SOURCES = ['LinkedIn', 'Naukri', 'Indeed', 'Company Website', 'Referral', 'Campus', 'Other'];

export default function EditApplication() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', dueDate: '', priority: 'Medium' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const [appRes, tasksRes] = await Promise.all([
          api.get(`/jobs/${id}`),
          api.get(`/tasks/${id}`),
        ]);

        if (cancelled) return;

        const app = appRes.data.application;
        setForm({
          ...app,
          skills: (app.skills || []).join(', '),
          appliedDate: app.appliedDate ? app.appliedDate.split('T')[0] : '',
          interviewDate: app.interviewDate ? app.interviewDate.split('T')[0] : '',
        });
        setTasks(tasksRes.data.tasks);
      } catch {
        if (cancelled) return;
        toast.error('❌ Application not found');
        navigate('/applications');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [id, navigate]);

  const handleChange = useCallback(
    (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value })),
    []
  );

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
        interviewDate: form.interviewDate || null,
      };
      await api.put(`/jobs/${id}`, payload);
      toast.success('✅ Application updated!');
      navigate('/applications');
    } catch (err) {
      toast.error(err.response?.data?.message || '❌ Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const addTask = async () => {
    if (!newTask.title.trim()) return toast.error('⚠️ Task title required');
    try {
      const { data } = await api.post('/tasks', { applicationId: id, ...newTask });
      setTasks((prev) => [...prev, data.task]);
      setNewTask({ title: '', dueDate: '', priority: 'Medium' });
      toast.success('✅ Task added!');
    } catch {
      toast.error('❌ Failed to add task');
    }
  };

  if (loading || !form) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-5xl animate-spin">⚙️</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/applications" className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          ←
        </Link>
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">
            ✏️ Edit Application
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {form.roleTitle} @ {form.companyName}
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Status Banner */}
        <div className="card p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                📊 Current Status
              </label>
              <select name="status" value={form.status} onChange={handleChange} className="input-field">
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                ⚡ Priority
              </label>
              <select name="priority" value={form.priority} onChange={handleChange} className="input-field">
                {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                🎯 Interview Date
              </label>
              <input
                type="date"
                name="interviewDate"
                value={form.interviewDate}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Main Info */}
        <div className="card p-6">
          <h2 className="font-display font-semibold text-lg mb-4 text-gray-900 dark:text-white">
            🏢 Application Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">🏢 Company</label>
              <input type="text" name="companyName" value={form.companyName} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">💼 Role</label>
              <input type="text" name="roleTitle" value={form.roleTitle} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">📍 Location</label>
              <input type="text" name="location" value={form.location} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">💰 Salary Note</label>
              <input type="text" name="salaryNote" value={form.salaryNote} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">🌐 Source</label>
              <select name="source" value={form.source} onChange={handleChange} className="input-field">
                {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">🔧 Skills</label>
              <input type="text" name="skills" value={form.skills} onChange={handleChange} placeholder="React, Node..." className="input-field" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">📝 Notes</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={3}
                className="input-field resize-none"
              />
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="card p-6">
          <h2 className="font-display font-semibold text-lg mb-4 text-gray-900 dark:text-white">
            ✅ Tasks ({tasks.length})
          </h2>

          {/* Add Task */}
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <input
              type="text"
              value={newTask.title}
              onChange={(e) => setNewTask((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Add a task... (e.g., Prepare for System Design)"
              className="input-field flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTask();
                }
              }}
            />
            <input
              type="date"
              value={newTask.dueDate}
              onChange={(e) => setNewTask((prev) => ({ ...prev, dueDate: e.target.value }))}
              className="input-field sm:w-36"
            />
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask((prev) => ({ ...prev, priority: e.target.value }))}
              className="input-field sm:w-28"
            >
              {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <button type="button" onClick={addTask} className="btn-primary whitespace-nowrap">
              ➕ Add
            </button>
          </div>

          {/* Task List */}
          <div className="space-y-2">
            {tasks.map((task) => (
              <TaskItem
                key={task._id}
                task={task}
                onUpdate={(updated) => setTasks((p) => p.map((t) => t._id === updated._id ? updated : t))}
                onDelete={(deletedId) => setTasks((p) => p.filter((t) => t._id !== deletedId))}
              />
            ))}
            {tasks.length === 0 && (
              <p className="text-center text-gray-400 text-sm py-4">📭 No tasks yet. Add preparation tasks above!</p>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <Link to="/applications" className="btn-secondary flex-1 text-center py-3">
            Cancel
          </Link>
          <button type="submit" disabled={saving} className="btn-primary flex-1 py-3 disabled:opacity-60">
            {saving ? '⏳ Saving...' : '💾 Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}