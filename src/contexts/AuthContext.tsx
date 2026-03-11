import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as api from '@/lib/api';

interface AuthContextType {
  user: string | null;
  isAuthenticated: boolean;
  signin: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string) => Promise<void>;
  signout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('current_user');
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  const signin = async (username: string, password: string) => {
    const data = await api.signin(username, password);
    localStorage.setItem('current_user', data.username);
    setUser(data.username);
  };

  const signup = async (username: string, password: string) => {
    const data = await api.signup(username, password);
    localStorage.setItem('current_user', data.username);
    setUser(data.username);
  };

  const signout = () => {
    localStorage.removeItem('current_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, signin, signup, signout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
