import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as apiService from '../services/api';
import { Organization } from '@/types';
import { Bell } from 'lucide-react';
import useStore from '@/store';
import connectEventSource from '@/lib/server-sent-events';

export function Home() {
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const { resetStatuses } = useStore();

  useEffect(() => {
    resetStatuses();
    const fetchOrganizations = async () => {
      try {
        const response = await apiService.fetchOrganizations();
        setOrganizations(response);
      } catch (error) {
        console.error('Failed to fetch organizations:', error);
      }
    };

    fetchOrganizations();

    // Add event listeners for specific events
    const eventSource = connectEventSource();

    eventSource.addEventListener('organizationCreated', (event) => {
      const data = JSON.parse(event.data);
      setOrganizations((orgs) => [...orgs, data]);
    })

    return () => {
      eventSource.close();
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          <span className="mr-2">Welcome to</span>
          <div className="inline-flex justify-center align-middle">
            <Bell className="h-8 w-8 text-indigo-600 ml-2" />
            <span className="ml-2 text-gray-900">StatusPage</span>
          </div>
        </h2>
        <p className="text-center text-lg text-gray-600">
          Track the status of services for various organizations.
        </p>
        <div className="flex justify-center">
          <button
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            onClick={() => navigate('/signup')}
          >
            Signup/Login
          </button>
        </div>
        <div className="space-y-4">
          {organizations.map((org) => (
            <div
              key={org.uuid}
              className="p-4 border rounded-lg cursor-pointer hover:bg-gray-100"
              onClick={() => navigate(`/${org.name}/status`)}
            >
              <h3 className="text-xl font-bold">{org.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}