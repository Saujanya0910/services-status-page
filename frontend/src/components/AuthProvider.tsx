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
        const response = await apiService.saveUser({
          name: user.name,
          email: user.email,
          sub: user.sub,
          orgIdentifier: organization.name,
        });
        setCurrentUser(response.data);
      } catch (error) {
        console.error('Failed to save user to backend:', error);
      }
    };

    if (auth0Authenticated && user) {
      const mockUser = {
        uuid: user.sub,
        email: user.email,
        name: user.name,
        role: 'admin' as const,
        organizationId: organization.name,
      };
      setCurrentUser(mockUser);
      saveUserToBackend(mockUser);
      navigate(`/${organization.name}/dashboard`);
    }
  }, [auth0Authenticated, user, setCurrentUser, navigate, organization.name]);

  return (
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      redirectUri={`${import.meta.env.VITE_APP_URL}`}
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