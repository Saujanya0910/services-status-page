import { Incident, IncidentUpdate, Organization, Service, User } from '@/types';
import axiosInstance from './index';

/**
 * Save user to the backend
 * @param user 
 */
export const saveUser = (user: Partial<User>, organization: { orgIdentifier?: string}): Promise<any> => {
  return axiosInstance.post('/api/user', { user, organization });
};

export const createOrUpdateUser = async (user: (Partial<User> & { orgIdentifier?: string })): Promise<Partial<User>> => {
  const response = await axiosInstance.post('/api/user', user);
  return response.data;
}

export const updateUser = async (user: Partial<User>) => {
  const response = await axiosInstance.put(`/api/user/${user.uuid}`, user);
  return response.data;
}


/**
 * Fetches the organization details
 * @param orgIdentifier 
 */
export const fetchOrganization = (orgIdentifier: string): Promise<Partial<Organization>> => {
  return axiosInstance.get(`/api/org/${encodeURIComponent(orgIdentifier)}`).then(response => response.data);
}

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

export const createService = async (orgIdentifier: string, service: Service): Promise<Partial<Service>> => {
  const response = await axiosInstance.post(`/api/org/${orgIdentifier}/service`, service);
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

export const createIncident = async (serviceIdentifier: string, incident: Incident): Promise<Partial<Incident>> => {
  const response = await axiosInstance.post(`/api/service/${serviceIdentifier}/incident`, incident);
  return response.data;
}

export const updateIncident = async (incident: Incident): Promise<Partial<Incident>> => {
  const response = await axiosInstance.put(`/api/incident/${incident.uuid}`, incident);
  return response.data;
}

export const deleteIncident = async (incidentIdentifier: string): Promise<void> => {
  return await axiosInstance.delete(`/api/incident/${incidentIdentifier}`);
}


export const createIncidentUpdate = async (incidentIdentifier: string, incidentUpdate: IncidentUpdate): Promise<Partial<IncidentUpdate>> => {
  const response = await axiosInstance.post(`/api/incident/${incidentIdentifier}/incident-update`, incidentUpdate);
  return response.data;
}

export const updateIncidentUpdate = async (incidentIdentifier: string, incidentUpdate: IncidentUpdate): Promise<Partial<IncidentUpdate>> => {
  const response = await axiosInstance.put(`/api/incident/${incidentIdentifier}/incident-update/${incidentUpdate.uuid}`, incidentUpdate);
  return response.data;
}

export const deleteIncidentUpdate = async (incidentUpdateId: string): Promise<void> => {
  return await axiosInstance.delete(`/api/incident-update/${incidentUpdateId}`);
}


export const createOrganization = async (data: { name: string; userIdentifier: string }): Promise<Partial<Organization>> => {
  const response = await axiosInstance.post('/api/org', data);
  return response.data;
};

export const joinOrganization = async (data: { inviteCode: string; userIdentifier: string }): Promise<Partial<Organization>> => {
  const response = await axiosInstance.post('/api/org/join', data);
  return response.data;
};

export const fetchOrganizationByInviteCode = async (inviteCode: string): Promise<Partial<Organization>> => {
  const response = await axiosInstance.get(`/api/org/check-invite`, { params: { inviteCode } });
  return response.data;
};

/**
 * Fetches the invite code for the organization
 * @param orgIdentifier 
 */
export const fetchInviteCode = (orgIdentifier: string): Promise<Partial<Organization>> => {
  return axiosInstance.get(`/api/org/${orgIdentifier}/invite-code`).then(response => response.data);
};

/**
 * Fetches the users for the organization
 * @param orgIdentifier 
 */
export const fetchUsers = (orgIdentifier: string): Promise<User[]> => {
  return axiosInstance.get(`/api/org/${orgIdentifier}/members`).then(response => response.data);
};

/**
 * Regenerates the invite code for the organization
 * @param orgIdentifier 
 */
export const regenerateInviteCode = (orgIdentifier: string): Promise<{ inviteCode: string }> => {
  return axiosInstance.post(`/api/org/${orgIdentifier}/regenerate-invite-code`).then(response => response.data);
};