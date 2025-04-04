
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { UserRole } from './AuthContext';
import DashboardLayout from './DashboardLayout';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PrivateRouteProps {
  children: React.ReactNode;
  roles?: UserRole[];
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, roles = [] }) => {
  const { user, profile, isAuthenticated, isLoading } = useAuth();

  // Show loading state while auth is being checked
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Verifying your access...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Check if user profile has been loaded
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertDescription>
            Unable to load your profile. Please try refreshing the page or contact support.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // If roles are specified and user doesn't have required role, show access denied
  if (roles.length > 0 && !roles.includes(profile.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md text-center p-8">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You don't have permission to access this page. This area is restricted to {roles.join(' or ')} roles.
          </p>
          <p className="text-sm text-muted-foreground">
            Your current role: {profile.role}
          </p>
        </div>
      </div>
    );
  }

  // Wrap the children in the DashboardLayout
  return <DashboardLayout>{children}</DashboardLayout>;
};
