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
  updateServiceStatus: (serviceId: string, status: Service['status']) => void;
  addService: (service: Service) => void;
  updateIncident: (incident: Incident) => void;
  addIncident: (incident: Incident) => void;
  fetchServices: (orgId: string) => void;
  fetchIncidents: (orgId: string) => void;
  deleteService: (serviceId: string) => void;
  deleteIncident: (incidentId: string) => void;
  deleteIncidentUpdate: (updateId: string) => void;
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
      updateServiceStatus: (serviceId, status) => set((state) => ({
        services: state.services.map((service) =>
          service.uuid === serviceId ? { ...service, status } : service
        ),
      })),
      addService: async (service) => {
        await createServiceApi(service);
        set((state) => ({ services: [...state.services, service] }))
      },
      updateIncident: async (incident) => {
        await updateIncidentApi(incident);
        set((state) => ({
          incidents: state.incidents.map((inc) =>
            inc.id === incident.id ? { ...inc, ...incident } : inc
          ),
        }))
      },
      addIncident: async (incident) => {
        await createIncidentApi(incident);
        set((state) => ({ incidents: [...state.incidents, incident] }))
      },
      fetchServices: async (orgId) => {
        const services = await fetchServicesApi(orgId);
        set({ services });
      },
      fetchIncidents: async (orgId) => {
        const incidents = await fetchIncidentsByOrgApi(orgId);
        set({ incidents });
      },
      deleteService: async (serviceId) => {
        await deleteServiceApi(serviceId);
        set((state) => ({
          services: state.services.filter((service) => service.uuid !== serviceId),
        }))
      },
      deleteIncident: async (incidentId) => {
        await deleteIncidentApi(incidentId);
        set((state) => ({
          incidents: state.incidents.filter((incident) => incident.uuid !== incidentId)
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