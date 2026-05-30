// 🛡️ Protected Route Component
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="text-5xl animate-bounce mb-4">🚀</div>
          <p className="text-gray-500 font-display font-semibold">Loading Job Tracker...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}