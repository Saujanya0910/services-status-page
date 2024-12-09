import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useStore from '../store';
import { LogOut, Settings, Bell } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { orgIdentifier } = useParams();
  const navigate = useNavigate();
  const { currentUser, resetAllState } = useStore();
  const { logout } = useAuth0();

  const handleLogout = () => {
    logout({ federated: true, returnTo: window.location.origin });
    resetAllState();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div
                className="flex-shrink-0 flex items-center cursor-pointer"
                onClick={() => navigate(`/${encodeURIComponent(orgIdentifier ?? '')}/status`)}
              >
              <Bell className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">StatusPage</span>
              </div>
            </div>
            
            {currentUser && (
              <div className="flex items-center">
                <button
                  type="button"
                  className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                  onClick={() => navigate(`/${encodeURIComponent(orgIdentifier ?? '') ?? ''}/manage/settings`)}
                >
                  <Settings className="h-6 w-6" />
                </button>
                <button
                  onClick={handleLogout}
                  className="ml-4 p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                >
                  <LogOut className="h-6 w-6" />
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}