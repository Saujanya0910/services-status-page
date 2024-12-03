import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useStore from '../store';
import { Button } from '../components/ui/button';
import { IncidentDialog } from '../components/dialogs/IncidentDialog';
import { IncidentUpdateDialog } from '../components/dialogs/IncidentUpdateDialog';
import { Incident, IncidentUpdate } from '@/types';
import { toast } from 'react-toastify';
import { capitalize } from 'lodash';

export function ServiceManagement() {
  const { orgIdentifier, serviceIdentifier } = useParams();
  const { currentUser, incidents, services, fetchIncidents, addIncident, updateIncident, deleteIncident, addIncidentUpdate, updateIncidentUpdate, deleteIncidentUpdate } = useStore();
  const service = services.find((s) => s.uuid === serviceIdentifier);
  const [isIncidentDialogOpen, setIsIncidentDialogOpen] = useState(false);
  const [isIncidentUpdateDialogOpen, setIsIncidentUpdateDialogOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [selectedIncidentUpdate, setSelectedIncidentUpdate] = useState<IncidentUpdate | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      return navigate('/');
    } 
    if(currentUser?.Organization?.name !== orgIdentifier) {
      return navigate(`/${currentUser.Organization?.name}/manage`);
    }
  }, [currentUser, orgIdentifier]);

  useEffect(() => {
    if (serviceIdentifier && orgIdentifier) {
      fetchIncidents(orgIdentifier);
    }
  }, [serviceIdentifier, fetchIncidents]);

  const handleAddOrUpdateIncident = async (incident: Incident) => {
    try {
      if (selectedIncident) {
        await updateIncident(incident);
      } else if (serviceIdentifier) {
        await addIncident(serviceIdentifier, incident);
      } else {
        toast.error('Service identifier is missing');
      }
    } catch (error) {
      toast.error('Failed to save incident');
    } finally {
      setIsIncidentDialogOpen(false);
      setSelectedIncident(null);
    }
  };

  const handleAddOrUpdateIncidentUpdate = async (incidentIdentifier: string, update: IncidentUpdate) => {
    try {
      if(update.uuid) {
        await updateIncidentUpdate(incidentIdentifier, update);
      } else {
        await addIncidentUpdate(incidentIdentifier, update);
      }
      toast.success('Incident update saved successfully');
    } catch (error) {
      toast.error('Failed to save incident update');
    } finally {
      setIsIncidentUpdateDialogOpen(false);
      setSelectedIncidentUpdate(null);
    }
  };

  const handleDeleteIncident = async (incidentId: string) => {
    try {
      await deleteIncident(incidentId);
      toast.success('Incident deleted successfully');
    } catch (error) {
      toast.error('Failed to delete incident');
    } finally {
      setSelectedIncident(null);
    }
  };

  const handleDeleteIncidentUpdate = async (updateId: string) => {
    try {
      await deleteIncidentUpdate(updateId);
      toast.success('Incident update deleted successfully');
    } catch (error) {
      toast.error('Failed to delete incident update');
    } finally {
      setSelectedIncidentUpdate(null);
    }
  };

  const handleAddIncidentUpdateUnderIncident = (incident: Incident) => {
    setSelectedIncident(incident);
    setSelectedIncidentUpdate(null);
    setIsIncidentUpdateDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Manage Service Incidents for {capitalize(service?.name)}</h1>
      <Button onClick={() => navigate(`/${orgIdentifier}/manage`)} className="mr-4">
        Back to Services
      </Button>
      <Button onClick={() => { setSelectedIncident(null); setIsIncidentDialogOpen(true); }}>
        Add Incident
      </Button>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-4">
        {incidents.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No incidents to display.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {incidents.map((incident) => (
              <li key={incident.uuid} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-medium text-gray-900">
                      {incident.title}
                    </h3>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      incident.status === 'resolved'
                        ? 'bg-green-100 text-green-800'
                        : incident.status === 'monitoring'
                        ? 'bg-blue-100 text-blue-800'
                        : incident.status === 'identified'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {capitalize(incident.status)}
                    </span>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      incident.severity === 'critical'
                        ? 'bg-red-100 text-red-800'
                        : incident.severity === 'major'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {capitalize(incident.severity)}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={() => { setSelectedIncident(incident); setIsIncidentDialogOpen(true); }}>Edit</Button>
                    <Button onClick={() => incident.uuid && handleDeleteIncident(incident.uuid)}>Delete</Button>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-900">Updates</h4>
                  <ul className="divide-y divide-gray-200">
                    {incident.IncidentUpdates?.map((update) => (
                      <li key={update.uuid} className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-500">{update.message}</p>
                          <div className="flex space-x-2">
                            <Button onClick={() => { setSelectedIncident(incident); setSelectedIncidentUpdate(update); setIsIncidentUpdateDialogOpen(true); }}>Edit</Button>
                            <Button onClick={() => update.uuid && handleDeleteIncidentUpdate(update.uuid)}>Delete</Button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <Button onClick={() => handleAddIncidentUpdateUnderIncident(incident)}>
                    Add Update
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
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
        onSave={(updatedIncidentUpdate) => handleAddOrUpdateIncidentUpdate(selectedIncident?.uuid || '', updatedIncidentUpdate)}
        incidentId={selectedIncident?.uuid || ''}
      />
    </div>
  );
}