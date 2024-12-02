import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Service, Incident, IncidentUpdate, User, Organization } from '../types';
import { 
  fetchServices as fetchServicesApi, 
  fetchIncidentsByOrg as fetchIncidentsByOrgApi, 
  fetchIncidents as fetchIncidentsApi, 
  createService as createServiceApi, 
  updateService as updateServiceApi,
  deleteService as deleteServiceApi,
  createIncident as createIncidentApi, 
  updateIncident as updateIncidentApi,
  deleteIncident as deleteIncidentApi,
  createIncidentUpdate as createIncidentUpdateApi, 
  updateIncidentUpdate as updateIncidentUpdateApi,
  deleteIncidentUpdate as deleteIncidentUpdateApi,
} from '../services/api';

interface AppState {
  organization: Organization;
  services: Service[];
  incidents: Incident[];
  currentUser: User | null;
  isAuthenticated: boolean;
  setOrganization: (organization: Organization) => void;
  setServices: (services: Service[]) => void;
  setIncidents: (incidents: Incident[]) => void;
  setCurrentUser: (user: User | null) => void;
  fetchServices: (orgId: string) => void;
  updateServiceStatus: (serviceIdentifier: string, status: Service['status']) => void;
  addService: (orgIdentifier: string, service: Service) => Promise<void>;
  updateService: (service: Service) => Promise<void>;
  deleteService: (serviceId: string) => Promise<void>;
  fetchIncidents: (orgId: string) => void;
  addIncident: (serviceIdentifier: string, incident: Incident) => Promise<void>;
  updateIncident: (incident: Incident) => Promise<void>;
  deleteIncident: (incidentId: string) => Promise<void>;
  addIncidentUpdate: (incidentIdentifier: string, update: IncidentUpdate) => Promise<void>;
  updateIncidentUpdate: (incidentIdentifier: string, update: IncidentUpdate) => Promise<void>;
  deleteIncidentUpdate: (updateId: string) => Promise<void>;
  resetStatuses: () => void;
  resetAllState: () => void;
}

const useStore = create(
  persist<AppState>(
    (set) => ({
      organization: {},
      services: [],
      incidents: [],
      currentUser: null,
      isAuthenticated: false,
      setOrganization: (organization) => set({ organization }),
      setServices: (services) => set({ services }),
      setIncidents: (incidents) => set({ incidents }),
      setCurrentUser: (user) => set({ currentUser: user, isAuthenticated: !!user }),
      updateServiceStatus: async (serviceIdentifier, status) => {
        await updateServiceApi({ uuid: serviceIdentifier, status });
        set((state) => ({
          services: state.services.map((service) =>
            service.uuid === serviceIdentifier ? { ...service, status } : service
          ),
        }))
      },
      fetchServices: async (orgId) => {
        const services = await fetchServicesApi(orgId);
        set({ services });
      },
      addService: async (orgIdentifier, service) => {
        const newService = await createServiceApi(orgIdentifier, service);
        service.uuid = newService.uuid;
        set((state) => ({ services: [...state.services, service] }))
      },
      updateService: async (service) => {
        await updateServiceApi(service);
        set((state) => ({
          services: state.services.map((s) => (s.uuid === service.uuid ? service : s)),
        }))
      },
      deleteService: async (serviceId) => {
        await deleteServiceApi(serviceId);
        set((state) => ({
          services: state.services.filter((service) => service.uuid !== serviceId),
        }))
      },
      fetchIncidents: async (orgId) => {
        const incidents = await fetchIncidentsByOrgApi(orgId);
        set({ incidents });
      },
      addIncident: async (serviceIdentifier, incident) => {
        const newIncident = await createIncidentApi(serviceIdentifier, incident);
        incident.uuid = newIncident.uuid;
        set((state) => ({ incidents: [...state.incidents, incident] }))
      },
      updateIncident: async (incident) => {
        await updateIncidentApi(incident);
        set((state) => ({
          incidents: state.incidents.map((inc) =>
            inc.uuid === incident.uuid ? { ...inc, ...incident } : inc
          ),
        }))
      },
      deleteIncident: async (incidentId) => {
        await deleteIncidentApi(incidentId);
        set((state) => ({
          incidents: state.incidents.filter((incident) => incident.uuid !== incidentId)
        }))
      },
      addIncidentUpdate: async (incidentIdentifier, update) => {
        const newIncidentUpdate = await createIncidentUpdateApi(incidentIdentifier, update);
        update.uuid = newIncidentUpdate.uuid;
        set((state) => ({
          incidents: state.incidents.map((incident) => ({
            ...incident,
            IncidentUpdates: [...(incident.IncidentUpdates || []), update],
          })),
        }))
      },
      updateIncidentUpdate: async (incidentIdentifier, update) => {
        await updateIncidentUpdateApi(incidentIdentifier, update);
        set((state) => ({
          incidents: state.incidents.map((incident) => ({
            ...incident,
            IncidentUpdates: (incident.IncidentUpdates ?? []).map((up) => (up.uuid === update.uuid ? update : up)),
          })),
        }))
      },
      deleteIncidentUpdate: async (updateId) => {
        await deleteIncidentUpdateApi(updateId);
        set((state) => ({
          incidents: state.incidents.map((incident) => ({
            ...incident,
            updates: incident.IncidentUpdates?.filter((update) => update.uuid !== updateId),
          })),
        }))
      },
      resetStatuses: () => set({
        organization: {},
        services: [],
        incidents: []
      }),
      resetAllState: () => set({
        organization: {},
        services: [],
        incidents: [],
        currentUser: null,
        isAuthenticated: false
      }),
    }),
    {
      name: 'app-storage',
    }
  )
);

export default useStore;