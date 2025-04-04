
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

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user ID:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      console.log('Profile fetched successfully:', data);
      return data as UserProfile;
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (!user) return;
    
    console.log('Refreshing profile for user ID:', user.id);
    const profile = await fetchProfile(user.id);
    if (profile) {
      console.log('Setting profile:', profile);
      setProfile(profile);
    } else {
      console.warn('Profile refresh failed - no data returned');
    }
  };

  const handleEmailVerificationRedirect = async () => {
    try {
      // Check if we're handling a redirect with tokens from email verification
      const url = new URL(window.location.href);
      
      // Look for tokens in URL parameters
      const accessToken = url.searchParams.get('access_token');
      const refreshToken = url.searchParams.get('refresh_token');
      const type = url.searchParams.get('type');
      
      const verificationTypes = ['email_change', 'signup', 'recovery', 'invite', 'magiclink'];
      
      if (accessToken && refreshToken && type && verificationTypes.includes(type)) {
        console.log('Detected email verification redirect with type:', type);
        setIsLoading(true);
        
        try {
          // Exchange tokens for session
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });
          
          if (error) {
            console.error('Email verification error:', error);
            toast({
              title: "Verification Failed",
              description: error.message || "Unable to complete email verification",
              variant: "destructive"
            });
            
            // Even on error, clean URL and navigate to home
            window.history.replaceState({}, document.title, window.location.pathname);
            navigate('/');
          } else if (data?.session) {
            console.log('Email verification successful, setting session');
            
            // Important: wait for the session to be set
            setSession(data.session);
            setUser(data.session.user);
            
            // Wait a moment for the session to be fully processed
            setTimeout(async () => {
              if (data.session?.user?.id) {
                const userProfile = await fetchProfile(data.session.user.id);
                if (userProfile) {
                  setProfile(userProfile);
                  console.log('Profile loaded after email verification');
                }
                
                toast({
                  title: "Email Verified",
                  description: "Your email has been successfully verified. Welcome!",
                });
                
                // Clean up URL parameters
                window.history.replaceState({}, document.title, window.location.pathname);
                
                // Always navigate to dashboard, even if profile isn't found
                navigate('/dashboard');
              }
            }, 500);
          }
        } catch (e) {
          console.error('Error processing verification tokens:', e);
          toast({
            title: "Verification Error",
            description: "An error occurred while processing your verification. Please try again.",
            variant: "destructive"
          });
          
          navigate('/');
        }
        
        return true; // Indicate we handled a verification redirect
      }
    } catch (error) {
      console.error('Unexpected error during email verification:', error);
    }
    
    return false; // No verification redirect handled
  };

  useEffect(() => {
    let didHandleVerification = false;
    
    // First try to handle email verification redirects
    handleEmailVerificationRedirect().then(handled => {
      didHandleVerification = handled;
      
      if (!handled) {
        // Only proceed with normal auth flow if not handling a verification
        initializeAuth();
      }
    });
    
    function initializeAuth() {
      console.log('Initializing auth state');
      
      // Set up auth state listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          console.log('Auth state changed:', event);
          setSession(session);
          setUser(session?.user ?? null);

          if (session?.user) {
            // Use setTimeout to avoid any auth state deadlocks
            setTimeout(async () => {
              const profile = await fetchProfile(session.user.id);
              setProfile(profile);
              setIsLoading(false);
            }, 0);
          } else {
            setProfile(null);
            setIsLoading(false);
          }
        }
      );

      // Then check for existing session
      supabase.auth.getSession().then(({ data: { session } }) => {
        console.log('Initial session check:', session ? 'Session found' : 'No session');
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

      return () => {
        subscription.unsubscribe();
      };
    }
    
    // Only call initializeAuth immediately if we're not handling verification
    if (!didHandleVerification) {
      const cleanup = initializeAuth();
      return cleanup;
    }
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
      console.log(`Registering user: ${email} with role: ${role}`);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          },
          // Explicitly set the redirect URL
          emailRedirectTo: window.location.origin,
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
          description: "Please check your email to verify your account.",
        });
        
        console.log('User registered:', {
          user_id: data.user.id,
          email: data.user.email,
          role,
          timestamp: new Date().toISOString()
        });
        
        // Don't navigate on registration - user needs to verify email first
        setIsLoading(false);
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
