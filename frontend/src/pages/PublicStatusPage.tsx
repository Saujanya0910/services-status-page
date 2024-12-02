import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useStore from '../store';
import { format } from 'date-fns';
import * as apiService from '../services/api';
import { toast } from 'react-toastify';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'; // Import Card components
import { statusIcons, statusText } from '@/constants';

export function PublicStatusPage() {
  const { orgIdentifier } = useParams();
  const navigate = useNavigate();
  const { services, organization, setServices, setOrganization, resetStatuses } = useStore();

  useEffect(() => {
    if (!orgIdentifier) {
      navigate('/page-not-found');
      return;
    }

    resetStatuses(); // Reset statuses everytime the user lands on the public status page

    const fetchOrg = async () => {
      try {
        const response = await apiService.fetchOrganization(orgIdentifier);
        if (!response) {
          toast.error('Failed to fetch organization data');
          navigate('/page-not-found');
          return;
        }
        setOrganization(response);
      } catch (error) {
        console.error('Failed to fetch org:', error);
        toast.error('Failed to fetch organization data');
        navigate('/page-not-found');
      }
    }

    const fetchServices = async () => {
      try {
        const servicesResponse = await apiService.fetchServices(orgIdentifier);
        setServices(servicesResponse);
      } catch (error) {
        console.error('Failed to fetch services:', error);
        toast.error('Failed to fetch services');
      }
    };

    fetchOrg().then(() => fetchServices());
  }, [orgIdentifier, setServices, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-start">
          <div className="text-left">
            <h1 className="text-3xl font-bold text-gray-900">Welcome to {organization.name}'s Status Page</h1>
            <p className="mt-3 text-xl text-gray-500">
              Below you'll find status information for each of {organization.name}'s products and services.
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">
              Org admin or member?{' '}
              <span
                onClick={() => navigate(`/${organization.name}/login`)}
                className="text-blue-500 hover:underline cursor-pointer"
              >
                Login here to manage
              </span>
            </p>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.uuid} onClick={() => navigate(`/${orgIdentifier}/service/${service.uuid}/incidents`)} className="cursor-pointer">
              <CardHeader>
                <CardTitle>{service.name}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  {statusIcons[service.status ?? 'operational']}
                  <span className="ml-2 text-sm">{statusText[service.status ?? 'operational']}</span>
                </div>
                <div className="text-sm text-gray-500">
                  Updated {format(service.updatedAt || new Date(), 'MMM d, yyyy HH:mm')}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}