import { useState, useEffect } from 'react';
import useStore from '../store';
import { ServiceCard } from '../components/ServiceCard';
import { Plus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { ServiceDialog } from '../components/dialogs/ServiceDialog';
import { Service } from '@/types';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

export function AdminDashboard() {
  const { currentUser, services, fetchServices, fetchIncidents, addService, updateService, updateServiceStatus, deleteService, resetStatuses } = useStore();
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const navigate = useNavigate();
  const { orgIdentifier } = useParams();

  useEffect(() => {
    resetStatuses();
  }, [])

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
    } else if(currentUser?.Organization?.name !== orgIdentifier) {
      navigate(`/${currentUser.Organization?.name}/manage`);
    }
  }, [currentUser, orgIdentifier]);

  useEffect(() => {
    if (currentUser?.Organization?.name) {
      fetchServices(currentUser.Organization.name);
      fetchIncidents(currentUser?.Organization?.name);
    }
  }, [currentUser?.Organization?.name, fetchServices, fetchIncidents]);

  const handleAddOrUpdateService = async (service: Service) => {
    if(currentUser?.Organization?.uuid) {
      try {
        if (selectedService) {
          if(selectedService.uuid) {
            await updateService(service);
          }
        } else {
          addService(currentUser?.Organization?.uuid, service);
        }
      } catch (error) {
        console.error('Failed to save service:', error);
        toast.error('Failed to save service');
      } finally {
        setSelectedService(null);
        setIsServiceDialogOpen(false);
      }
    }
  };

  const handleDeleteService = (serviceId: string) => {
    deleteService(serviceId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Manage your services</h1>
        <Button onClick={() => { setSelectedService(null); setIsServiceDialogOpen(true); }}>
          <Plus className="h-5 w-5 mr-2" />
          Add Service
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.length === 0 ? (
          <div className="text-center text-gray-500 col-span-full">
            <p className="text-xl">No services available at the moment.</p>
            <p>Please add a new service to get started.</p>
          </div>
        ) : (
          services.map((service) => (
            <ServiceCard 
              key={service.uuid} 
              service={service} 
              onClick={() => navigate(`/${currentUser?.Organization?.name}/manage/service/${service.uuid}`)}
              onEdit={() => { setSelectedService(service); setIsServiceDialogOpen(true); }}
              onDelete={() => service.uuid && handleDeleteService(service.uuid)}
              onUpdateStatus={updateServiceStatus}
            />
          ))
        )}
      </div>

      <ServiceDialog
        open={isServiceDialogOpen}
        onOpenChange={setIsServiceDialogOpen}
        service={selectedService}
        onSave={handleAddOrUpdateService}
      />
    </div>
  );
}