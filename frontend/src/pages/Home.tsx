import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as apiService from '../services/api';
import { Organization } from '@/types';

export function Home() {
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await apiService.fetchOrganizations();
        setOrganizations(response);
      } catch (error) {
        console.error('Failed to fetch organizations:', error);
      }
    };

    fetchOrganizations();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Welcome to the Services Status Page
        </h2>
        <p className="text-center text-lg text-gray-600">
          Track the status of services for various organizations.
        </p>
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