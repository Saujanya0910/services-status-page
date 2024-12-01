import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { format } from 'date-fns';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import * as apiService from '../services/api';
import { Button } from '../components/ui/button'; // Import Button component
import { toast } from 'react-toastify'; // Import toast

const statusIcons = {
  operational: <CheckCircle className="h-6 w-6 text-green-500" />,
  degraded: <AlertCircle className="h-6 w-6 text-yellow-500" />,
  partial_outage: <AlertCircle className="h-6 w-6 text-orange-500" />,
  major_outage: <XCircle className="h-6 w-6 text-red-500" />,
};

const statusText = {
  operational: 'Operational',
  degraded: 'Degraded Performance',
  partial_outage: 'Partial Outage',
  major_outage: 'Major Outage',
};

export function PublicStatusPage() {
  const { orgName } = useParams();
  const navigate = useNavigate();
  const { services, incidents, organization, setServices, setIncidents, setOrganization } = useStore();

  useEffect(() => {
    if (!orgName) {
      navigate('/page-not-found');
      return;
    }

    const fetchOrg = async () => {
      try {
        const response = await apiService.fetchOrganization(orgName);
        // console.log("fetchOrg() response: ", response);
        if (!response.data) {
          toast.error('Failed to fetch organization data');
          navigate('/page-not-found');
          return;
        }
        setOrganization(response.data);
      } catch (error) {
        console.error('Failed to fetch org:', error);
        toast.error('Failed to fetch organization data');
        navigate('/page-not-found');
      }
    }

    const fetchServicesAndIncidents = async () => {
      try {
        const [servicesResponse, incidentsResponse] = await Promise.all([
          apiService.fetchServices(orgName),
          apiService.fetchIncidents(orgName),
        ]);

        setServices(servicesResponse);
        setIncidents(incidentsResponse);
      } catch (error) {
        console.error('Failed to fetch services and incidents:', error);
        toast.error('Failed to fetch services and incidents');
      }
    };

    fetchOrg().then(() => fetchServicesAndIncidents());
  }, [orgName, setServices, setIncidents, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">System Status</h1>
          <p className="mt-3 text-xl text-gray-500">
            Current status of services at {orgName}
          </p>
          <Button onClick={() => navigate(`/${orgName}/login`)} className="mt-6">
            Login / Signup
          </Button>
        </div>

        <div className="mt-12">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">Services</h2>
            </div>
            <div className="border-t border-gray-200">
              <ul className="divide-y divide-gray-200">
                {services.map((service) => (
                  <li key={service.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {statusIcons[service.status ?? 'operational']}
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {service.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {statusText[service.status ?? 'operational']}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        Updated {format(service.updatedAt || new Date(), 'MMM d, yyyy HH:mm')}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {incidents.length > 0 && (
          <div className="mt-8">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg font-medium text-gray-900">
                  Active Incidents
                </h2>
              </div>
              <div className="border-t border-gray-200">
                <ul className="divide-y divide-gray-200">
                  {incidents.map((incident) => (
                    <li key={incident.id} className="px-4 py-4 sm:px-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {incident.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {incident.description}
                        </p>
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            {incident.status}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}