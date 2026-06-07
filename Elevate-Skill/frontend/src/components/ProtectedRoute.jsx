import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth();
  const effectiveRole = user?.role === 'admin' ? 'admin' :
    user?.is_staff || user?.is_superuser ? 'admin' :
    user?.role || localStorage.getItem('elevate_user_role') || 'student';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#EE8433] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium text-gray-500">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user && !localStorage.getItem('access_token')) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && effectiveRole !== requiredRole.toLowerCase()) {
    return <Navigate to={effectiveRole === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  return children;
}
