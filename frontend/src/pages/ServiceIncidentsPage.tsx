import { useEffect } from 'react';
import { toast } from 'react-toastify';
import * as apiService from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';
import useStore from '../store';
import { Button } from '../components/ui/button';
import { IncidentListItem } from '../components/IncidentListItem';
import { statusText } from '../constants/index';
import { Chip } from '../components/ui/chip';

export function ServiceIncidentsPage() {
  const { orgIdentifier, serviceIdentifier } = useParams();
  const navigate = useNavigate();
  const { services, incidents, setIncidents } = useStore();
  let service = services.find((s) => s.uuid === serviceIdentifier);

  useEffect(() => {
    if (!serviceIdentifier) {
      navigate('/page-not-found');
      return;
    }

    const fetchService = async () => {
      try {
        const response = await apiService.fetchService(serviceIdentifier);
        if (!response) {
          toast.error('Failed to fetch service data');
          navigate('/page-not-found');
          return;
        }

        service = response;
      } catch (error) {
        console.error('Failed to fetch service:', error);
        toast.error('Failed to fetch service data');
        navigate('/page-not-found');
      }
    }

    const fetchServiceIncidents = async () => {
      try {
        const incidentsResponse = await apiService.fetchIncidents(serviceIdentifier);
        setIncidents(incidentsResponse);
      } catch (error) {
        if(error && (error as any).status !== 404) {
          console.error('Failed to fetch incidents:', error);
          toast.error('Failed to fetch incidents');
        }
      }
    };
    
    if(!service) {
      fetchService();
    }
    fetchServiceIncidents();

  }, [serviceIdentifier, setIncidents, navigate]);

  if (!service) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button onClick={() => navigate(`/${orgIdentifier}/status`)} className="mb-4">Back to Status Page</Button>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-6 py-8 sm:px-8">
            <h2 className="text-2xl font-bold text-gray-900">{service.name}</h2>
            <p className="mt-2 text-base text-gray-500">{service.description}</p>
            <div className="mt-4 flex items-center">
              <Chip status={service.status === 'partial_outage' ? 'degraded' : service.status ?? 'operational'}>
                {statusText[service.status as keyof typeof statusText]}
              </Chip>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-300 mb-8"></div>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          {incidents.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No incidents reported.</div>
          ) : (
            <ul className="divide-y divide-gray-300">
              {incidents.map((incident) => (
                <div key={incident.uuid} className="mb-6">
                  <IncidentListItem incident={incident} />
                  <div className="border-t border-gray-200 mt-6"></div>
                </div>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}