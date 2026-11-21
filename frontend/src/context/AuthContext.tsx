import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axiosInstance';
import { authApi } from '../api/authApi';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'owner' | 'customer';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => Promise<void>;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem('token')));

  const logout = useCallback(async () => {
    if (token) {
      try {
        await authApi.logout();
      } catch {
        // Local logout must complete even when the audit request fails.
      }
    }
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setLoading(false);
  }, [token]);

  const fetchUser = useCallback(async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data.data || res.data);
    } catch {
      await logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token, fetchUser]);

  const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setLoading(true);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};