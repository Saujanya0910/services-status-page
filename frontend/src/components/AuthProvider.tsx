import { createContext, useContext, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';

interface AuthContextType {
  login: () => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { setCurrentUser, isAuthenticated } = useStore();
  const { loginWithRedirect, logout, user, isAuthenticated: auth0Authenticated } = useAuth0();

  useEffect(() => {
    if (auth0Authenticated && user) {
      const mockUser = {
        uuid: user.sub,
        email: user.email,
        name: user.name,
        role: 'admin' as const,
        organizationId: '1',
      };
      setCurrentUser(mockUser);
      navigate('/admin');
    }
  }, [auth0Authenticated, user, setCurrentUser, navigate]);

  return (
    <AuthContext.Provider value={{ login: loginWithRedirect, logout: () => logout({ returnTo: window.location.origin }), isAuthenticated: auth0Authenticated }}>
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