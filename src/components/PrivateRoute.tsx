
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { UserRole } from './AuthContext';
import DashboardLayout from './DashboardLayout';

interface PrivateRouteProps {
  children: React.ReactNode;
  roles?: UserRole[];
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, roles = [] }) => {
  const { user, isAuthenticated } = useAuth();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If roles are specified and user doesn't have required role, redirect to dashboard
  if (roles.length > 0 && user && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // Wrap the children in the DashboardLayout
  return <DashboardLayout>{children}</DashboardLayout>;
};
