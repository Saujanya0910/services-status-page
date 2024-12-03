import { createContext, useContext, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store';
import { useAuth0, Auth0Provider } from '@auth0/auth0-react';
import * as apiService from '../services/api'; // Import apiService
import { User } from '@/types';

interface AuthContextType {
  login: () => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { organization, setCurrentUser } = useStore();
  const { loginWithRedirect, logout, user, isAuthenticated: auth0Authenticated } = useAuth0();

  useEffect(() => {
    const saveUserToBackend = async (user: (User & { sub?: string })) => {
      try {
        const response = await apiService.createOrUpdateUser({
          name: user.name,
          email: user.email,
          auth0Id: user.sub
        });
        setCurrentUser(response);
      } catch (error) {
        console.error('Failed to save user to backend:', error);
      }
    };

    if (auth0Authenticated && user) {
      const mockUser = {
        email: user.email,
        name: user.name,
        auth0Id: user.sub
      };
      setCurrentUser(mockUser);
      saveUserToBackend(mockUser);
      navigate(`/${organization.name}/manage`);
    }
  }, [auth0Authenticated, user, setCurrentUser, navigate, organization.name]);

  useEffect(() => {
    const handleAuthCallback = async () => {
      if (auth0Authenticated && user) {
        navigate('/signup');
      }
    };

    handleAuthCallback();
  }, [auth0Authenticated, user, setCurrentUser, navigate]);

  return (
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      redirectUri={`${window.location.origin}/callback`}
      maxAge={43200}
    >
      <AuthContext.Provider value={{ login: loginWithRedirect, logout: () => logout({ returnTo: window.location.origin }), isAuthenticated: auth0Authenticated }}>
        {children}
      </AuthContext.Provider>
    </Auth0Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};