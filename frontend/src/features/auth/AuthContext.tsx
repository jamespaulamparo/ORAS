import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../../types/auth';
import { fetchWithCsrf } from '../../lib/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<User>;
  register: (data: { username: string; email: string; password: string; password_confirm: string; first_name?: string; last_name?: string }) => Promise<User>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const data = await fetchWithCsrf<User>('/api/auth/me/');
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (username: string, password: string): Promise<User> => {
    const data = await fetchWithCsrf<User>('/api/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    setUser(data);
    return data;
  };

  const register = async (payload: {
    username: string;
    email: string;
    password: string;
    password_confirm: string;
    first_name?: string;
    last_name?: string;
  }): Promise<User> => {
    const data = await fetchWithCsrf<User>('/api/auth/register/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    setUser(data);
    return data;
  };

  const logout = async (): Promise<void> => {
    try {
      await fetchWithCsrf('/api/auth/logout/', { method: 'POST' });
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
