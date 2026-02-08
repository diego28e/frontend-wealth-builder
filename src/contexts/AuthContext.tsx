import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService } from '../services/auth';
import type { User, LoginRequest, RegisterRequest } from '../types/api';
import { ApiError } from '../lib/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(()=> {
    async function checkSession() {
        try {
            const response = await authService.getMe();
            setUser(response.user);
        } catch (error) {
            setUser(null);
        }finally{
            setIsLoading(false)
        }
    }
    checkSession();
},[])

  async function login(credentials: LoginRequest) {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(error.message);
      }
      throw new Error('Login failed');
    } finally {
      setIsLoading(false);
    }
  }

  async function register(data: RegisterRequest) {
    try {
      const response = await authService.register(data);
      setUser(response.user);
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(error.message);
      }
      throw new Error('Registration failed');
    }
  }

  async function logout() {
    try {
      await authService.logout();
    } catch (error) {
      // Ignore logout errors - clear user anyway
    } finally {
      setUser(null);
    }
  }

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
