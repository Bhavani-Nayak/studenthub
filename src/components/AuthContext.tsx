
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

// User types
export type UserRole = 'admin' | 'faculty' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// Mock user data
const MOCK_USERS: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin' },
  { id: '2', name: 'Faculty Member', email: 'faculty@example.com', role: 'faculty' },
  { id: '3', name: 'Student One', email: 'student@example.com', role: 'student' }
];

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  logout: () => {},
  isAuthenticated: false
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // Check if user is already logged in from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in a real app, this would call an API
    const foundUser = MOCK_USERS.find(user => user.email === email);
    
    if (foundUser && password === 'password') { // Simple password check for demo
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      
      // Show success message
      toast({
        title: "Login successful",
        description: `Welcome back, ${foundUser.name}`,
      });
      
      // Redirect to dashboard
      navigate('/dashboard');
      return true;
    }
    
    // Show error message
    toast({
      title: "Login failed",
      description: "Invalid email or password",
      variant: "destructive",
    });
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    
    navigate('/');
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
