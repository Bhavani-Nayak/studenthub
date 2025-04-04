
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { UserRole } from './AuthContext';
import DashboardLayout from './DashboardLayout';
import { Loader2, RefreshCcw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface PrivateRouteProps {
  children: React.ReactNode;
  roles?: UserRole[];
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, roles = [] }) => {
  const { user, profile, isAuthenticated, isLoading, refreshProfile } = useAuth();
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const navigate = useNavigate();

  // Automatically attempt to refresh the profile when the component mounts
  // or when user is authenticated but profile is missing
  useEffect(() => {
    let timeoutId: number | undefined;
    
    if (isAuthenticated && !profile && !isLoading && retryCount < 3) {
      timeoutId = window.setTimeout(async () => {
        console.log('Automatically retrying profile fetch, attempt:', retryCount + 1);
        setIsRetrying(true);
        await refreshProfile();
        setIsRetrying(false);
        setRetryCount(prev => prev + 1);
      }, 1000); // Wait 1 second between retries
    }
    
    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [isAuthenticated, profile, isLoading, retryCount, refreshProfile]);

  // Show loading state while auth is being checked
  if (isLoading || isRetrying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">
            {isRetrying ? 'Retrying profile load...' : 'Verifying your access...'}
          </p>
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
          <AlertDescription className="py-2">
            <p className="mb-4">Unable to load your profile. This can happen after email verification or if your account is new.</p>
            <div className="flex flex-col sm:flex-row gap-2 justify-between mt-2">
              <Button 
                onClick={async () => {
                  setIsRetrying(true);
                  await refreshProfile();
                  setIsRetrying(false);
                  if (!profile) {
                    toast({
                      title: "Profile refresh failed",
                      description: "Please try again or logout and login",
                      variant: "destructive"
                    });
                  }
                }}
                className="flex items-center gap-2"
              >
                <RefreshCcw className="h-4 w-4" /> Refresh Profile
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
              >
                Return to Login
              </Button>
            </div>
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
