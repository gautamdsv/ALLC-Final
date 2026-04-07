import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const roleWeight = {
  REVIEWER: 1,
  ADMIN: 2,
  SUPERADMIN: 3,
};

export default function ProtectedRoute({ minRole = 'REVIEWER' }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  if (!user) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }
  if ((roleWeight[user.role] || 0) < (roleWeight[minRole] || 0)) {
    return <Navigate to="/admin" replace />;
  }
  return <Outlet />;
}
