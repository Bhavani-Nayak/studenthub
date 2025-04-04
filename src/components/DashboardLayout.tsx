
import React from 'react';
import { useAuth } from './AuthContext';
import Sidebar from './Sidebar';
import { Navigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import SessionManager from './SessionManager';
import { Loader2 } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  requiredRoles?: Array<'admin' | 'faculty' | 'student'>;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  requiredRoles = ['admin', 'faculty', 'student'] 
}) => {
  const { user, profile, isAuthenticated, isLoading } = useAuth();
  const isMobile = useIsMobile();
  
  // If still loading, show a loading indicator
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  // If profile is not loaded yet, show a loading indicator
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }
  
  // Check if user has required role
  if (requiredRoles.length > 0 && !requiredRoles.includes(profile.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md text-center p-8">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You don't have permission to access this page.
          </p>
          <p className="text-sm text-muted-foreground">
            Please contact an administrator if you believe this is an error.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <main className={cn(
        "flex-1 transition-all ease-in-out duration-300 overflow-x-hidden",
        isMobile ? "ml-0" : "ml-64"
      )}>
        <div className="container mx-auto p-6 animate-fade-in">
          {children}
          
          {/* Session Management */}
          <div className={cn(
            "fixed bottom-4 right-4 z-50 w-64",
            isMobile ? "sm:right-4" : "right-4"
          )}>
            <SessionManager />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
