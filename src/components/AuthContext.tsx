import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'faculty' | 'student';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  isAdmin: boolean;
  isFaculty: boolean;
  isStudent: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  session: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  register: async () => false,
  logout: async () => {},
  refreshProfile: async () => {},
  isAdmin: false,
  isFaculty: false,
  isStudent: false
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Helper function to fetch user profile
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data as UserProfile;
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      return null;
    }
  };

  // Refresh user profile data
  const refreshProfile = async () => {
    if (!user) return;
    
    const profile = await fetchProfile(user.id);
    if (profile) {
      setProfile(profile);
    }
  };

  // Handle email verification redirects
  const handleEmailVerificationRedirect = async () => {
    // Check if this is a redirect after email verification
    const url = new URL(window.location.href);
    const accessToken = url.searchParams.get('access_token');
    const refreshToken = url.searchParams.get('refresh_token');
    const type = url.searchParams.get('type');
    
    if (type === 'email_change' || type === 'signup' || type === 'recovery') {
      setIsLoading(true);
      
      if (accessToken && refreshToken) {
        try {
          // Exchange the tokens for a session
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });
          
          if (error) {
            console.error('Error setting session after email verification:', error);
            toast({
              title: "Verification error",
              description: error.message,
              variant: "destructive",
            });
          } else if (data?.session) {
            toast({
              title: "Email verified",
              description: "Your email has been verified successfully",
            });
            
            // Clear URL parameters to avoid issues on refresh
            window.history.replaceState({}, document.title, window.location.pathname);
            
            // Redirect to dashboard after short delay to allow session to propagate
            setTimeout(() => {
              navigate('/dashboard');
            }, 500);
          }
        } catch (error) {
          console.error('Error handling email verification redirect:', error);
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  // Setup auth state listener
  useEffect(() => {
    setIsLoading(true);

    // Check for email verification first
    handleEmailVerificationRedirect();

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event);
        setSession(session);
        setUser(session?.user ?? null);

        // Fetch profile in a non-blocking way
        if (session?.user) {
          setTimeout(async () => {
            const profile = await fetchProfile(session.user.id);
            setProfile(profile);
            setIsLoading(false);
          }, 0);
        } else {
          setProfile(null);
          setIsLoading(false);
        }

        // Log auth events for audit trail
        if (event) {
          const logData = {
            event,
            user_id: session?.user?.id,
            timestamp: new Date().toISOString()
          };
          // In production, save this to a secure audit log
          console.log('Auth event logged:', logData);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        fetchProfile(session.user.id).then(profile => {
          setProfile(profile);
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
        console.error('Login error:', error);
        setIsLoading(false);
        return false;
      }

      if (data.user) {
        const profile = await fetchProfile(data.user.id);
        setProfile(profile);
        
        toast({
          title: "Login successful",
          description: `Welcome back, ${profile?.name || data.user.email}`,
        });
        
        // Log successful login for audit
        console.log('User logged in:', {
          user_id: data.user.id,
          email: data.user.email,
          timestamp: new Date().toISOString()
        });
        
        navigate('/dashboard');
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
      setIsLoading(false);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Register the user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          },
        },
      });

      if (error) {
        toast({
          title: "Registration failed",
          description: error.message,
          variant: "destructive",
        });
        console.error('Registration error:', error);
        setIsLoading(false);
        return false;
      }

      if (data.user) {
        toast({
          title: "Registration successful",
          description: role === 'admin' 
            ? "Your admin account has been created." 
            : "Your account has been created and is pending admin approval.",
        });
        
        // Log successful registration for audit
        console.log('User registered:', {
          user_id: data.user.id,
          email: data.user.email,
          role,
          timestamp: new Date().toISOString()
        });
        
        navigate('/dashboard');
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Log the logout event for audit
      if (user) {
        console.log('User logging out:', {
          user_id: user.id,
          email: user.email,
          timestamp: new Date().toISOString()
        });
      }
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast({
          title: "Logout error",
          description: error.message,
          variant: "destructive",
        });
        console.error('Logout error:', error);
      } else {
        toast({
          title: "Logged out",
          description: "You have been successfully logged out",
        });
        
        navigate('/');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Role-based helper properties
  const isAdmin = profile?.role === 'admin';
  const isFaculty = profile?.role === 'faculty';
  const isStudent = profile?.role === 'student';

  const value = {
    user,
    profile,
    session,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    refreshProfile,
    isAdmin,
    isFaculty,
    isStudent
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
