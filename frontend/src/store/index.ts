import create from 'zustand';
import { persist } from 'zustand/middleware';
import type { Service, Incident, User, Organization } from '../types';
import { fetchServices as fetchServicesApi, fetchIncidents as fetchIncidentsApi } from '../services/api';

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
      addService: (service) => set((state) => ({ services: [...state.services, service] })),
      updateIncident: (incident) => set((state) => ({
        incidents: state.incidents.map((inc) =>
          inc.id === incident.id ? { ...inc, ...incident } : inc
        ),
      })),
      addIncident: (incident) => set((state) => ({ incidents: [...state.incidents, incident] })),
      fetchServices: async (orgId) => {
        const services = await fetchServicesApi(orgId);
        set({ services });
      },
      fetchIncidents: async (orgId) => {
        const incidents = await fetchIncidentsApi(orgId);
        set({ incidents });
      },
      deleteService: (serviceId) => set((state) => ({
        services: state.services.filter((service) => service.uuid !== serviceId),
      })),
      deleteIncident: (incidentId) => set((state) => ({
        incidents: state.incidents.filter((incident) => incident.uuid !== incidentId),
      })),
      deleteIncidentUpdate: (updateId) => set((state) => ({
        incidents: state.incidents.map((incident) => ({
          ...incident,
          updates: incident.updates ? incident.updates.filter((update) => update.uuid !== updateId) : [],
        })),
      })),
      resetStatuses: () => set({
        organization: {},
        services: [],
        incidents: [],
        currentUser: null,
        isAuthenticated: false,
      }),
      resetAllState: () => set({
        organization: {},
        services: [],
        incidents: [],
        currentUser: null,
        isAuthenticated: false,
      })
    }),
    {
      name: 'status-page-store', // name of the item in the storage (must be unique)
      getStorage: () => localStorage, // (optional) by default, 'localStorage' is used
    }
  )
);

export { useStore };