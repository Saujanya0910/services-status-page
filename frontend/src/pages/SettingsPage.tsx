import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { User } from '@/types';
import { fetchInviteCode, fetchUsers, regenerateInviteCode as regenerateInviteCodeService } from '../services/api';
import { toast } from 'react-toastify';
import useStore from '@/store';


export function SettingsPage() {
  const { orgIdentifier } = useParams();
  const [inviteCode, setInviteCode] = useState<string | undefined>('');
  const [users, setUsers] = useState<User[]>([]);
  const [orgName, setOrgName] = useState<string>('');
  const { currentUser } = useStore();
  const currentUserEmail = currentUser?.email;
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      return navigate('/');
    }
    if(orgIdentifier !== currentUser?.Organization?.name) {
      return navigate(`${currentUser?.Organization?.name}/manage/settings`);
    }
    async function fetchData() {
      if (orgIdentifier) {
        const [inviteCodeResponse, usersResponse] = await Promise.all([
          fetchInviteCode(orgIdentifier),
          fetchUsers(orgIdentifier)
        ]);
        setInviteCode(inviteCodeResponse.inviteCode);
        setUsers(usersResponse);
        setOrgName(currentUser?.Organization?.name || orgIdentifier);
      }
    }
    fetchData();
  }, [currentUser, orgIdentifier]);

  const regenerateInviteCode = async () => {
    if (orgIdentifier) {
      const response = await regenerateInviteCodeService(orgIdentifier);
      setInviteCode(response.inviteCode);
    }
  };

  const copyInviteCode = () => {
    if (inviteCode) {
      navigator.clipboard.writeText(inviteCode);
      toast.success('Invite code copied to clipboard!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Organization Settings</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="mb-6">
          <label className="text-sm text-gray-500">Organization Name</label>
          <h2 className="text-xl font-semibold">{orgName}</h2>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Invite Code</label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inviteCode}
                disabled
                className="w-full px-4 py-2 bg-gray-50 rounded-md"
              />
              <button
                onClick={copyInviteCode}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-gray-700"
                title="Copy invite code"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                </svg>
              </button>
            </div>
            <button
              onClick={regenerateInviteCode}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Regenerate
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Users</h2>
        <ul className="divide-y divide-gray-200">
          {users.map(user => (
            <li key={user.uuid} className="py-3 flex items-center justify-between">
              <div>
                <span className="font-medium">{user.name}</span>
                <span className="text-gray-500 ml-2">({user.email})</span>
                {user.email === currentUserEmail && (
                  <span className="ml-2 text-sm text-gray-500">(You)</span>
                )}
              </div>
              <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                {user.role}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}