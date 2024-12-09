import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store';
import * as apiService from '../services/api';
import debounce from 'lodash/debounce';
import { capitalize } from 'lodash';
import { useAuth0 } from '@auth0/auth0-react';

export function CreateOrJoinOrg() {
  const [orgName, setOrgName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [orgExists, setOrgExists] = useState(false);
  const [inviteValid, setInviteValid] = useState(false);
  const [inviteOrgName, setInviteOrgName] = useState('');
  const { currentUser, setCurrentUser } = useStore();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
      if (currentUser?.Organization) {
        navigate(`/${encodeURIComponent(currentUser.Organization.name ?? '')}/manage`);
      } else {
        navigate('/create-or-join-org');
      }
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if(!currentUser) {
      navigate('/');
    }
  }, [currentUser]);

  useEffect(() => {
    const checkOrgExists = debounce(async (name) => {
      try {
        const org = await apiService.fetchOrganization(name);
        setOrgExists(!!org);
      } catch (error) {
        setOrgExists(false);
      }
    }, 650);

    if (orgName) {
      checkOrgExists(orgName);
    } else {
      setOrgExists(false);
    }

    return () => {
      checkOrgExists.cancel();
    };
  }, [orgName]);

  const handleCreateOrg = async () => {
    if (orgExists) return;
    if (!currentUser) {
      console.error('Current user is null');
      return;
    }
    try {
      const organization = await apiService.createOrganization({ name: orgName, userIdentifier: currentUser.uuid || '' });
      setCurrentUser({ ...currentUser, Organization: organization });
      navigate(`/${encodeURIComponent(organization.name ?? '')}/manage`);
    } catch (error) {
      console.error('Failed to create organization:', error);
    }
  };

  const handleVerifyInvite = async () => {
    try {
      const organization = await apiService.fetchOrganizationByInviteCode(inviteCode);
      setInviteOrgName(organization.name || '');
      setCurrentUser({ ...currentUser, Organization: organization });
      setInviteValid(true);
    } catch (error) {
      setInviteValid(false);
      setInviteOrgName('');
      console.error('Invalid invite code:', error);
    }
  };

  const handleJoinOrg = async () => {
    if (!inviteValid) return;
    try {
      if (!currentUser?.uuid) {
        console.error('User identifier is undefined');
        return;
      }
      const organization = await apiService.joinOrganization({ inviteCode, userIdentifier: currentUser.uuid });
      navigate(`/${encodeURIComponent(organization.name ?? '')}/manage`);
    } catch (error) {
      console.error('Failed to join organization:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create or Join an Organization
          </h2>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={currentUser?.name || ''}
            disabled
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          />
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="text"
            value={currentUser?.email || ''}
            disabled
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          />
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Create Organization</h3>
          <input
            type="text"
            placeholder="Organization Name"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm mb-2"
          />
          {orgExists && <p className="text-red-500 text-sm">Organization already exists</p>}
          <button
            onClick={!(!orgName || orgExists) ? handleCreateOrg : () => {}}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={!orgName || orgExists}
          >
            Create Organization
          </button>
        </div>
        <div className="flex items-center justify-center my-4">
          <div className="border-t border-gray-300 flex-grow mr-3"></div>
          <span className="text-gray-500">OR</span>
          <div className="border-t border-gray-300 flex-grow ml-3"></div>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Join Organization</h3>
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Invite Code"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm mb-2"
            />
            <button
              onClick={handleVerifyInvite}
              className="ml-2 group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Verify
            </button>
          </div>
          {inviteValid && <p className="text-green-500 text-sm">Organization: {capitalize(inviteOrgName)}</p>}
          <button
            onClick={!(!inviteCode || !inviteValid) ? handleJoinOrg : () => {}}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={!inviteCode || !inviteValid}
          >
            Join Organization
          </button>
        </div>
      </div>
    </div>
  );
}