import React, { createContext, useContext, useState, useCallback } from 'react';
import { z } from 'zod';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

interface User {
  id: string;
  email: string;
  name: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    try {
      // Validate input
      userSchema.parse({ email, password, name: 'placeholder' });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock successful login
      setUser({
        id: '1',
        email,
        name: 'Admin User',
      });
      setIsAuthenticated(true);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error('Invalid email or password format');
      }
      throw new Error('Login failed');
    }
  }, []);

  const signup = useCallback(async (email: string, password: string, name: string) => {
    try {
      // Validate input
      userSchema.parse({ email, password, name });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock successful signup
      setUser({
        id: '1',
        email,
        name,
      });
      setIsAuthenticated(true);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error('Invalid signup data');
      }
      throw new Error('Signup failed');
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, signup, logout }}>
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