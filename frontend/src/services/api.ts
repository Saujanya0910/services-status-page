import { Incident, IncidentUpdate, Organization, Service } from '@/types';
import axiosInstance from './index';

/**
 * Fetches the organization details
 * @param orgIdentifier 
 */
export const fetchOrganization = (orgIdentifier: string): Promise<Partial<Organization>> => {
  return axiosInstance.get(`/api/org/${orgIdentifier}`).then(response => response.data);
}

/**
 * Save user to the backend
 * @param user 
 */
export const saveUser = (user: { name?: string; email?: string; sub?: string; orgIdentifier?: string }): Promise<any> => {
  return axiosInstance.post('/api/user', { user: { name: user.name, email: user.email }, organization: { orgIdentifier: user.orgIdentifier } });
};

/**
 * Fetches all organizations (supports search by name)
 */
export const fetchOrganizations = async (searchTerm: string = ''): Promise<Partial<Organization>[]> => {
  const response = await axiosInstance.get('/api/orgs', searchTerm ? { params: { search: encodeURIComponent(searchTerm.trim()) } } : {});
  return response.data;
};

/**
 * Fetches the services for the organization
 * @param orgIdentifier 
 */
export const fetchServices = (orgIdentifier: string): Promise<Partial<Service>[]> => {
  return axiosInstance.get(`/api/org/${orgIdentifier}/services`).then(response => response.data);
};

/**
 * Fetches the service details
 * @param serviceIdentifier 
 */
export const fetchService = (serviceIdentifier: string): Promise<Partial<Service>> => {
  return axiosInstance.get(`/api/service/${serviceIdentifier}`).then(response => response.data);
};

export const createService = async (service: Service): Promise<Partial<Service>> => {
  const response = await axiosInstance.post(`/api/service`, service);
  return response.data;
}

export const updateService = async (service: Service): Promise<Partial<Service>> => {
  const response = await axiosInstance.put(`/api/service/${service.uuid}`, service);
  return response.data;
}

export const deleteService = async (serviceId: string): Promise<void> => {
  await axiosInstance.delete(`/api/service/${serviceId}`);
}


/**
 * Fetches the incidents for the organization
 * @param serviceIdentifier
 */
export const fetchIncidents = (serviceIdentifier: string): Promise<Partial<Incident>[]> => {
  return axiosInstance.get(`/api/service/${serviceIdentifier}/incidents`).then(response => response.data);
};

/**
 * Fetches incidents for the organization
 * @param orgIdentifier 
 */
export const fetchIncidentsByOrg = async (orgIdentifier: string): Promise<Partial<Incident>[]> => {
  const response = await axiosInstance.get(`/api/org/${orgIdentifier}/incidents`);
  return response.data;
}

export const createIncident = async (incident: Incident): Promise<Partial<Incident>> => {
  const response = await axiosInstance.post(`/api/incident`, incident);
  return response.data;
}

export const updateIncident = async (incident: Incident): Promise<Partial<Incident>> => {
  const response = await axiosInstance.put(`/api/incident/${incident.uuid}`, incident);
  return response.data;
}

export const deleteIncident = async (incidentId: string): Promise<void> => {
  await axiosInstance.delete(`/api/incident/${incidentId}`);
}


export const createIncidentUpdate = async (incidentUpdate: IncidentUpdate): Promise<Partial<IncidentUpdate>> => {
  const response = await axiosInstance.post(`/api/incident-update/${incidentUpdate.uuid}`, incidentUpdate);
  return response.data;
}

export const deleteIncidentUpdate = async (incidentUpdateId: string): Promise<void> => {
  await axiosInstance.delete(`/api/incident-update/${incidentUpdateId}`);
}

export const updateIncidentUpdate = async (incidentUpdate: IncidentUpdate): Promise<Partial<IncidentUpdate>> => {
  const response = await axiosInstance.put(`/api/incident-update/${incidentUpdate.uuid}`, incidentUpdate);
  return response.data;
}