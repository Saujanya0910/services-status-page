import { useState, useEffect } from 'react';
import useStore from '../store';
import { ServiceCard } from '../components/ServiceCard';
import { Plus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { ServiceDialog } from '../components/dialogs/ServiceDialog';
import { Service } from '@/types';

export function AdminDashboard() {
  const { organization, services, fetchServices, fetchIncidents, addService, updateServiceStatus, addIncident, updateIncident, deleteService, deleteIncident, deleteIncidentUpdate } = useStore();
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    if (organization?.uuid && organization?.name) {
      fetchServices(organization.uuid);
      fetchIncidents(organization.name);
    }
  }, [organization.uuid, fetchServices, fetchIncidents]);

  const handleAddOrUpdateService = (service: Service) => {
    if (selectedService) {
      // Update service logic
    } else {
      addService(service);
    }
    setIsServiceDialogOpen(false);
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
        {services.map((service) => (
          <ServiceCard 
            key={service.uuid} 
            service={service} 
            onClick={() => { setSelectedService(service); setIsServiceDialogOpen(true); }}
            onDelete={() => service.uuid && handleDeleteService(service.uuid)}
            onUpdateStatus={updateServiceStatus}
          />
        ))}
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