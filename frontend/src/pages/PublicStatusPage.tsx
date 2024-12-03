import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useStore from '../store';
import { format } from 'date-fns';
import * as apiService from '../services/api';
import { toast } from 'react-toastify';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { statusText } from '@/constants';
import { capitalize } from 'lodash';
import { Chip } from '../components/ui/chip';
import connectEventSource from '@/lib/server-sent-events';

export function PublicStatusPage() {
  const { orgIdentifier } = useParams();
  const navigate = useNavigate();
  const { currentUser, services, organization, setServices, setOrganization, resetStatuses } = useStore();

  useEffect(() => {
    if (!orgIdentifier) {
      navigate('/page-not-found');
      return;
    }

    resetStatuses();

    const fetchData = async () => {
      const [orgResponse, servicesResponse] = await Promise.all([
        apiService.fetchOrganization(orgIdentifier),
        apiService.fetchServices(orgIdentifier)
      ]);

      if (!orgResponse) {
        toast.error('Failed to fetch organization data');
        navigate('/page-not-found');
        return;
      }

      setOrganization(orgResponse);
      setServices(servicesResponse);
    };

    fetchData();

    // Add event listeners for specific events
    const eventSource = connectEventSource();

    eventSource.addEventListener('serviceCreated', (event) => {
      const data = JSON.parse(event.data);
      const isMsgForCurrentOrg = data.orgIdentifier?.toLowerCase() === orgIdentifier.toLowerCase();
      if (!isMsgForCurrentOrg) return;
      setServices([...services, { uuid: data.uuid, name: data.name, description: data.description, status: data.status, updatedAt: data.updatedAt }]);
    });

    eventSource.addEventListener('serviceUpdated', (event) => {
      const data = JSON.parse(event.data);
      const isMsgForCurrentOrg = data.orgIdentifier?.toLowerCase() === orgIdentifier.toLowerCase();
      if (!isMsgForCurrentOrg) return;
      const updatedServices = services.map((service) => {
        if (service.uuid === data.uuid) {
          return { uuid: data.uuid, name: data.name, description: data.description, status: data.status, updatedAt: data.updatedAt };
        }
        return service;
      });
      setServices(updatedServices);
    });

    eventSource.addEventListener('serviceDeleted', (event) => {
      const data = JSON.parse(event.data);
      const isMsgForCurrentOrg = data.orgIdentifier?.toLowerCase() === orgIdentifier.toLowerCase();
      if (!isMsgForCurrentOrg) return;
      const updatedServices = services.filter((service) => service.uuid !== data.uuid);
      setServices(updatedServices);
    });

    // Error handling
    eventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
    };

    return () => {
      eventSource.close();
    };
  }, [orgIdentifier, navigate, setOrganization, setServices]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-start">
          <div className="text-left">
            <h1 className="text-3xl font-bold text-gray-900">Welcome to {capitalize(organization.name || orgIdentifier)}'s Status Page</h1>
            <p className="mt-3 text-xl text-gray-500">
              Below you'll find status information for each of {capitalize(organization.name || orgIdentifier)}'s products and services.
            </p>
          </div>
          <div className="text-right">
            {
              currentUser && currentUser.Organization && (currentUser.Organization.name?.toLowerCase() === orgIdentifier?.toLowerCase()) ? (
                <button
                  onClick={() => navigate(`/${currentUser.Organization?.name}/manage`)}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Manage Organization
                </button>
              ) :
              <p className="text-sm text-gray-500">
                Org admin or member?{' '}
                <span
                  onClick={() => navigate(`/${organization.name}/login`)}
                  className="text-blue-500 hover:underline cursor-pointer"
                >
                  Login here to manage
                </span>
              </p>
            }
          </div>
        </div>

        <div className="mt-12">
          {services.length === 0 ? (
            <div className="text-center text-gray-500">
              <p className="text-xl">No services available at the moment.</p>
              <p>Please check back later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <Card key={service.uuid} onClick={() => navigate(`/${orgIdentifier}/service/${service.uuid}/incidents`)} className="cursor-pointer">
                  <CardHeader>
                    <CardTitle>{service.name}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <Chip status={
                        service.status === 'partial_outage' ? 'degraded' : 
                        service.status === 'down' ? 'down' : 
                        service.status ?? 'operational'
                      }>
                        {statusText[service.status as keyof typeof statusText ?? 'operational']}
                      </Chip>
                    </div>
                    <div className="text-sm text-gray-500">
                      Updated {format(service.updatedAt || new Date(), 'MMM d, yyyy HH:mm')}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}