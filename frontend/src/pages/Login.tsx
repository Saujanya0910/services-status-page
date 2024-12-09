import useStore from '@/store';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export function Login() {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const { currentUser } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      if (currentUser?.Organization) {
        navigate(`/${encodeURIComponent(currentUser.Organization.name ?? '')}/manage`);
      } else {
        navigate('/create-or-join-org');
      }
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <button
          onClick={() => loginWithRedirect()}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Sign in / Sign up
        </button>
      </div>
    </div>
  );
}