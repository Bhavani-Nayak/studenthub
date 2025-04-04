
import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Shield, LogOut, Clock, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// Session timeout in milliseconds (30 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000;

const SessionManager = () => {
  const { session, logout } = useAuth();
  const [sessionTime, setSessionTime] = useState<number>(0);
  const [showInactiveWarning, setShowInactiveWarning] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());
  
  // Update session time every minute
  useEffect(() => {
    if (!session) return;
    
    // Use session creation time or current time as fallback
    const startTime = new Date().getTime();
    
    const timer = setInterval(() => {
      const now = Date.now();
      setSessionTime(now - startTime);
      
      // Check for inactivity
      if (now - lastActivity > SESSION_TIMEOUT - (5 * 60 * 1000)) { // 5 min before timeout
        setShowInactiveWarning(true);
      }
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, [session, lastActivity]);
  
  // Track user activity
  useEffect(() => {
    const updateActivity = () => {
      setLastActivity(Date.now());
      setShowInactiveWarning(false);
    };
    
    // Add event listeners to track user activity
    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keydown', updateActivity);
    window.addEventListener('click', updateActivity);
    window.addEventListener('scroll', updateActivity);
    
    return () => {
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('click', updateActivity);
      window.removeEventListener('scroll', updateActivity);
    };
  }, []);
  
  // Auto-logout after session timeout
  useEffect(() => {
    if (!session) return;
    
    const logoutTimer = setTimeout(() => {
      toast({
        title: "Session expired",
        description: "You have been logged out due to inactivity",
      });
      logout();
    }, SESSION_TIMEOUT);
    
    return () => clearTimeout(logoutTimer);
  }, [session, lastActivity, logout]);
  
  // Format time display
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / (60 * 1000));
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${minutes}m`;
  };
  
  if (!session) return null;
  
  return (
    <>
      <Dialog open={showInactiveWarning} onOpenChange={setShowInactiveWarning}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
              Session Timeout Warning
            </DialogTitle>
            <DialogDescription>
              Your session will expire soon due to inactivity. Would you like to stay logged in?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInactiveWarning(false)}>
              Stay Logged In
            </Button>
            <Button variant="destructive" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Card className="mt-4">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center">
              <Shield className="h-4 w-4 mr-2 text-blue-500" />
              Session Security
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              Active for {formatTime(sessionTime)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-2 text-xs text-muted-foreground">
          <p>Your session will expire after 30 minutes of inactivity.</p>
        </CardContent>
        <CardFooter className="pt-0">
          <Button variant="ghost" size="sm" className="text-xs" onClick={logout}>
            <LogOut className="h-3 w-3 mr-1" />
            Logout
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default SessionManager;
