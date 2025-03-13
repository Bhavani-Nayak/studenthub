
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

export type UserRole = 'admin' | 'faculty' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Mock users for local authentication
const MOCK_USERS: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin' },
  { id: '2', name: 'Faculty User', email: 'faculty@example.com', role: 'faculty' },
  { id: '3', name: 'Student User', email: 'student@example.com', role: 'student' }
];

// Mock credentials (in a real app, this would be stored securely)
const MOCK_CREDENTIALS = {
  'admin@example.com': 'password123',
  'faculty@example.com': 'password123',
  'student@example.com': 'password123'
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  isAuthenticated: false
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Load user from localStorage on initial load
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
    try {
      // Check if email exists in mock credentials
      if (!MOCK_CREDENTIALS.hasOwnProperty(email)) {
        throw new Error('User not found');
      }

      // Check if password matches
      if (MOCK_CREDENTIALS[email as keyof typeof MOCK_CREDENTIALS] !== password) {
        throw new Error('Invalid password');
      }

      // Find the user with matching email
      const foundUser = MOCK_USERS.find(u => u.email === email);
      
      if (!foundUser) {
        throw new Error('User not found');
      }

      // Set the user in state and localStorage
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));

      toast({
        title: "Login successful",
        description: `Welcome back, ${foundUser.name}`,
      });

      navigate('/dashboard');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      });
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      // Check if email already exists
      if (MOCK_CREDENTIALS.hasOwnProperty(email) || MOCK_USERS.some(u => u.email === email)) {
        throw new Error('User with this email already exists');
      }

      // Create a new user object
      const newUser: User = {
        id: `user_${Date.now()}`, // Generate a simple ID
        name,
        email,
        role
      };

      // Add the user to mock data (in a real app, this would add to the database)
      // Note: This is only in memory and will reset on page refresh
      // In a production app, you'd want to persist these changes
      MOCK_USERS.push(newUser);
      (MOCK_CREDENTIALS as any)[email] = password;

      // Set the user in state and localStorage
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));

      toast({
        title: "Registration successful",
        description: `Welcome, ${name}!`,
      });

      navigate('/dashboard');
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Registration failed",
        variant: "destructive",
      });
      return false;
    }
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
    register,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
