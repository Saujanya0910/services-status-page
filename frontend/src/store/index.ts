import { create } from 'zustand';
import type { Service, Incident, User } from '../types';

interface AppState {
  services: Service[];
  incidents: Incident[];
  currentUser: User | null;
  isAuthenticated: boolean;
  setServices: (services: Service[]) => void;
  setIncidents: (incidents: Incident[]) => void;
  setCurrentUser: (user: User | null) => void;
  updateServiceStatus: (serviceId: string, status: Service['status']) => void;
  addService: (service: Service) => void;
  updateIncident: (incident: Incident) => void;
  addIncident: (incident: Incident) => void;
}

export const useStore = create<AppState>((set) => ({
  services: [],
  incidents: [],
  currentUser: null,
  isAuthenticated: false,
  setServices: (services) => set({ services }),
  setIncidents: (incidents) => set({ incidents }),
  setCurrentUser: (user) => set({ currentUser: user, isAuthenticated: !!user }),
  updateServiceStatus: (serviceId, status) =>
    set((state) => ({
      services: state.services.map((service) =>
        service.uuid === serviceId
          ? { ...service, status, updatedAt: new Date() }
          : service
      ),
    })),
  addService: (service) =>
    set((state) => ({
      services: [...state.services, service],
    })),
  updateIncident: (updatedIncident) =>
    set((state) => ({
      incidents: state.incidents.map((incident) =>
        incident.id === updatedIncident.id ? updatedIncident : incident
      ),
    })),
  addIncident: (incident) =>
    set((state) => ({
      incidents: [...state.incidents, incident],
    })),
}));