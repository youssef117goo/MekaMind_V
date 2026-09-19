import React from 'react';
import { Navigate } from 'react-router-dom';
import { appStore } from '../store/appStore';
import { useSyncExternalStore } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole = 'admin' }) => {
  const currentUser = useSyncExternalStore(
    (cb) => appStore.subscribe(cb),
    () => appStore.getCurrentUser(),
    () => null
  );

  if (!currentUser) {
    return <Navigate to="/admin/login" replace />;
  }

  if (currentUser.role !== requiredRole) {
    return <Navigate to="/403" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
