
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '../lib/api';

interface User {
  id: string;
  name: string;
  role: 'admin' | 'reception' | 'health';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo login
const mockUsers = [
  {
    id: "1",
    username: "admin",
    password: "admin123",
    name: "Admin User",
    role: "admin"
  },
  {
    id: "2",
    username: "reception",
    password: "reception123",
    name: "Reception Staff",
    role: "reception"
  },
  {
    id: "3",
    username: "health",
    password: "health123",
    name: "Health Officer",
    role: "health"
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('userData');
      if (token && storedUser) {
        try {
          // In a real app, we would verify the token with the API
          // For demo, we'll just use the stored user data
          const userData = JSON.parse(storedUser);
          setUser({
            id: userData.id,
            name: userData.name,
            role: userData.role as 'admin' | 'reception' | 'health'
          });
        } catch (error) {
          console.error('Failed to get current user:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('userData');
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      // In a real app, we would make an API call here
      // For demo, we'll check against our mock users
      const user = mockUsers.find(u => 
        u.username === username && u.password === password
      );
      
      if (user) {
        // Create a mock token (in real apps this would come from the API)
        const token = btoa(`${user.username}:${Date.now()}`);
        localStorage.setItem('token', token);
        
        // Store user data
        const userData = {
          id: user.id,
          name: user.name,
          role: user.role
        };
        
        localStorage.setItem('userData', JSON.stringify(userData));
        
        setUser(userData as User);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
