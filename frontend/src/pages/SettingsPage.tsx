import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { User } from '@/types';
import { fetchInviteCode, fetchUsers, regenerateInviteCode as regenerateInviteCodeService } from '../services/api';

export function SettingsPage() {
  const { orgIdentifier } = useParams();
  const [inviteCode, setInviteCode] = useState<string | undefined>('');
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Fetch the current invite code and users
    async function fetchData() {
      if (orgIdentifier) {
        const [inviteCodeResponse, usersResponse] = await Promise.all([fetchInviteCode(orgIdentifier), fetchUsers(orgIdentifier)]);
        setInviteCode(inviteCodeResponse.inviteCode);
        setUsers(usersResponse);
      }
    }
    fetchData();
  }, [orgIdentifier]);

  const regenerateInviteCode = async () => {
    if (orgIdentifier) {
      const response = await regenerateInviteCodeService(orgIdentifier);
      setInviteCode(response.inviteCode);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Organization Settings</h1>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Invite Code</label>
        <input
          type="text"
          value={inviteCode}
          disabled
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
        />
        <button
          onClick={regenerateInviteCode}
          className="mt-2 p-2 bg-indigo-600 text-white rounded-md"
        >
          Regenerate Invite Code
        </button>
      </div>
      <div>
        <h2 className="text-xl font-bold mb-2">Users</h2>
        <ul>
          {users.map(user => (
            <li key={user.uuid} className="mb-1">
              {user.name} ({user.email})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}