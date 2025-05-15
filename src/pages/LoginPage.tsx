
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Gavel } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: "Error",
        description: "Please enter both username and password",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await login(username, password);
      
      if (success) {
        toast({
          title: "Success",
          description: "Logged in successfully",
        });
        
        // Redirect based on user role
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        switch(userData.role) {
          case 'admin':
            navigate('/admin');
            break;
          case 'reception':
            navigate('/reception');
            break;
          case 'health':
            navigate('/health');
            break;
          default:
            navigate('/');
            break;
        }
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid username or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="p-2 rounded-full bg-[#F1F0FB] mb-2">
            <Gavel className="h-6 w-6 text-[#9b87f5]" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Prison Management System</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your portal
          </CardDescription>
          <div className="w-full border-t border-gray-200 my-2"></div>
          <div className="text-sm text-center text-muted-foreground bg-muted p-2 rounded-lg w-full">
            <p>Available login credentials:</p>
            <p>Admin: username: <strong>admin</strong> / password: <strong>admin123</strong></p>
            <p>Reception: username: <strong>reception</strong> / password: <strong>reception123</strong></p>
            <p>Health: username: <strong>health</strong> / password: <strong>health123</strong></p>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-[#9b87f5] hover:bg-[#7E69AB]" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
