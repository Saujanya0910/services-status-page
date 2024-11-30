import React, { createContext, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';

interface AuthContextType {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { setCurrentUser, isAuthenticated } = useStore();

  const login = async (email: string, password: string) => {
    // TODO: Implement actual authentication
    const mockUser = {
      id: '1',
      email,
      name: 'Admin User',
      role: 'admin' as const,
      organizationId: '1',
    };
    setCurrentUser(mockUser);
    navigate('/admin');
  };

  const logout = () => {
    setCurrentUser(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};