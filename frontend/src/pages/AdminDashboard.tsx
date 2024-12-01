import { useState, useEffect } from 'react';
import { useStore } from '../store';
import { ServiceCard } from '../components/ServiceCard';
import { Plus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { ServiceDialog } from '../components/dialogs/ServiceDialog';
import { IncidentDialog } from '../components/dialogs/IncidentDialog';
import { IncidentUpdateDialog } from '../components/dialogs/IncidentUpdateDialog';
import { Incident, IncidentUpdate, Service } from '@/types';

export function AdminDashboard() {
  const { organization, services, incidents, fetchServices, fetchIncidents, addService, updateServiceStatus, addIncident, updateIncident, deleteService, deleteIncident, deleteIncidentUpdate } = useStore();
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [isIncidentDialogOpen, setIsIncidentDialogOpen] = useState(false);
  const [isIncidentUpdateDialogOpen, setIsIncidentUpdateDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [selectedIncidentUpdate, setSelectedIncidentUpdate] = useState<IncidentUpdate | null>(null);

  useEffect(() => {
    if (organization?.uuid) {
      fetchServices(organization.uuid);
      fetchIncidents(organization.uuid);
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

  const handleAddOrUpdateIncident = (incident: Incident) => {
    if (selectedIncident) {
      updateIncident(incident);
    } else {
      addIncident(incident);
    }
    setIsIncidentDialogOpen(false);
  };

  const handleAddOrUpdateIncidentUpdate = (update: IncidentUpdate) => {
    // Logic to add or update incident update
    setIsIncidentUpdateDialogOpen(false);
  };

  const handleDeleteService = (serviceId: string) => {
    deleteService(serviceId);
  };

  const handleDeleteIncident = (incidentId: string) => {
    deleteIncident(incidentId);
  };

  const handleDeleteIncidentUpdate = (updateId: string) => {
    deleteIncidentUpdate(updateId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
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

      {selectedService && (
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Incidents for {selectedService.name}</h2>
          <Button onClick={() => { setSelectedIncident(null); setIsIncidentDialogOpen(true); }}>Add Incident</Button>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-4">
            <ul className="divide-y divide-gray-200">
              {incidents.filter(incident => incident.uuid === selectedService.uuid).map((incident) => (
                <li key={incident.uuid} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {incident.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {incident.description}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={() => { setSelectedIncident(incident); setIsIncidentDialogOpen(true); }}>Edit</Button>
                      <Button onClick={() => incident.uuid && handleDeleteIncident(incident.uuid)}>Delete</Button>
                    </div>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      incident.severity === 'critical' 
                        ? 'bg-red-100 text-red-800'
                        : incident.severity === 'major'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {incident.severity}
                    </span>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900">Updates</h4>
                    <ul className="divide-y divide-gray-200">
                      {incident.updates?.map((update) => (
                        <li key={update.uuid} className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500">{update.message}</p>
                            <div className="flex space-x-2">
                              <Button onClick={() => { setSelectedIncidentUpdate(update); setIsIncidentUpdateDialogOpen(true); }}>Edit</Button>
                              <Button onClick={() => update.uuid && handleDeleteIncidentUpdate(update.uuid)}>Delete</Button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <ServiceDialog
        open={isServiceDialogOpen}
        onOpenChange={setIsServiceDialogOpen}
        service={selectedService}
        onSave={handleAddOrUpdateService}
      />
      <IncidentDialog
        open={isIncidentDialogOpen}
        onOpenChange={setIsIncidentDialogOpen}
        incident={selectedIncident}
        onSave={handleAddOrUpdateIncident}
        serviceId={selectedService?.uuid}
      />
      <IncidentUpdateDialog
        open={isIncidentUpdateDialogOpen}
        onOpenChange={setIsIncidentUpdateDialogOpen}
        incidentUpdate={selectedIncidentUpdate}
        onSave={handleAddOrUpdateIncidentUpdate}
      />
    </div>
  );
}