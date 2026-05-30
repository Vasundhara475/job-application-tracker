// ✅ Task Item Component
import { useState } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const PRIORITY_EMOJI = { High: '🔴', Medium: '🟡', Low: '🟢' };

export default function TaskItem({ task, onUpdate, onDelete }) {
  const [loading, setLoading] = useState(false);

  const toggleDone = async () => {
    setLoading(true);
    try {
      await api.put(`/tasks/${task._id}`, { done: !task.done });
      onUpdate?.({ ...task, done: !task.done });
      toast.success(task.done ? '↩️ Task reopened' : '✅ Task completed!');
    } catch {
      toast.error('Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/tasks/${task._id}`);
      onDelete?.(task._id);
      toast.success('🗑️ Task deleted');
    } catch {
      toast.error('Failed to delete task');
    }
  };

  const isOverdue = !task.done && task.dueDate && new Date(task.dueDate) < new Date();

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
        task.done
          ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700 opacity-60'
          : isOverdue
          ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800'
          : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'
      }`}
    >
      <button
        onClick={toggleDone}
        disabled={loading}
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
          task.done ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 dark:border-gray-600 hover:border-green-400'
        }`}
      >
        {task.done && <span className="text-xs">✓</span>}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${task.done ? 'line-through text-gray-400' : 'text-gray-900 dark:text-white'}`}>
          {task.title}
        </p>
        {task.dueDate && (
          <p className={`text-xs mt-0.5 ${isOverdue ? 'text-red-500 font-semibold' : 'text-gray-400'}`}>
            {isOverdue ? '⚠️ Overdue · ' : '📅 '}
            {new Date(task.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs">{PRIORITY_EMOJI[task.priority]}</span>
        <button
          onClick={handleDelete}
          className="text-gray-400 hover:text-red-500 transition-colors text-xs"
        >
          ×
        </button>
      </div>
    </div>
  );
}