import React, { useState } from 'react';
import { useAuth } from '@/components/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await login(email, password);
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (role: 'admin' | 'faculty' | 'student') => {
    setLoading(true);
    let email;
    
    switch (role) {
      case 'admin': email = 'admin@example.com'; break;
      case 'faculty': email = 'faculty@example.com'; break;
      case 'student': email = 'student@example.com'; break;
    }
    
    try {
      await login(email, 'password');
    } catch (error) {
      console.error('Quick login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 p-4">
      <div className="animate-scale-in">
        <Card className="w-[380px] shadow-lg border-opacity-50">
          <CardHeader className="space-y-2">
            <div className="flex justify-center">
              <img 
                src="/lovable-uploads/74823540-2e67-496a-8656-b0ab67bfbdf7.png" 
                alt="StudentHub" 
                className="h-40 object-contain mx-auto"
              />
            </div>
            <CardDescription className="text-center">
              Login to access the student management system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="transition-all duration-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="transition-all duration-200"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  For demo, use 'password' as the password
                </p>
              </div>
              <Button 
                type="submit" 
                className="w-full btn-hover" 
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <div className="w-full">
              <p className="text-sm text-center text-muted-foreground mb-2">Quick demo login:</p>
              <div className="flex gap-2 w-full">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => quickLogin('admin')} 
                  className="flex-1 btn-hover"
                  disabled={loading}
                >
                  Admin
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => quickLogin('faculty')} 
                  className="flex-1 btn-hover"
                  disabled={loading}
                >
                  Faculty
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => quickLogin('student')} 
                  className="flex-1 btn-hover"
                  disabled={loading}
                >
                  Student
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Index;
