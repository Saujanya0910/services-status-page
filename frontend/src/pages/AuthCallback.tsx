import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store';

export function AuthCallback() {
  const { isAuthenticated, user } = useAuth0();
  const { setCurrentUser, createOrUpdateUser, resetAllState } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    resetAllState();
    if (isAuthenticated && user) {
      const mockUser = {
        email: user.email,
        name: user.name
      };
      createOrUpdateUser(mockUser).then((receivedUserDetails) => {
        setCurrentUser(receivedUserDetails);
        navigate('/signup');
      });
    }
  }, [isAuthenticated, user, setCurrentUser, navigate]);

  return <div>Loading...</div>;
}