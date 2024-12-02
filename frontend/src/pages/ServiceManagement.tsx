
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useStore from '../store';
import { Button } from '../components/ui/button';
import { IncidentDialog } from '../components/dialogs/IncidentDialog';
import { IncidentUpdateDialog } from '../components/dialogs/IncidentUpdateDialog';
import { Incident, IncidentUpdate } from '@/types';

export function ServiceManagement() {
  const { serviceIdentifier } = useParams();
  const { incidents, organization, fetchIncidents, addIncident, updateIncident, deleteIncident, deleteIncidentUpdate } = useStore();
  const [isIncidentDialogOpen, setIsIncidentDialogOpen] = useState(false);
  const [isIncidentUpdateDialogOpen, setIsIncidentUpdateDialogOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [selectedIncidentUpdate, setSelectedIncidentUpdate] = useState<IncidentUpdate | null>(null);

  useEffect(() => {
    if (serviceIdentifier && organization?.uuid) {
      fetchIncidents(organization.uuid);
    }
  }, [serviceIdentifier, fetchIncidents]);

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

  const handleDeleteIncident = (incidentId: string) => {
    deleteIncident(incidentId);
  };

  const handleDeleteIncidentUpdate = (updateId: string) => {
    deleteIncidentUpdate(updateId);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Manage Service Incidents</h1>
      <Button onClick={() => { setSelectedIncident(null); setIsIncidentDialogOpen(true); }}>
        Add Incident
      </Button>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-4">
        <ul className="divide-y divide-gray-200">
          {incidents.map((incident) => (
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
                  {incident.IncidentUpdates?.map((update) => (
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

      <IncidentDialog
        open={isIncidentDialogOpen}
        onOpenChange={setIsIncidentDialogOpen}
        incident={selectedIncident}
        onSave={handleAddOrUpdateIncident}
        serviceId={serviceIdentifier}
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