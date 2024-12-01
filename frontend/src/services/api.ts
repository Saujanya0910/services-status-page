import axiosInstance from './index';

/**
 * Fetches the organization details
 * @param orgIdentifier 
 */
export const fetchOrganization = (orgIdentifier: string): Promise<any> => {
  return axiosInstance.get(`/api/org/${orgIdentifier}`);
}

/**
 * Fetches the services for the organization
 * @param orgIdentifier 
 */
export const fetchServices = (orgIdentifier: string): Promise<any> => {
  return axiosInstance.get(`/api/org/${orgIdentifier}/services`).then(response => response.data);
};

/**
 * Fetches the incidents for the organization
 * @param orgIdentifier
 */
export const fetchIncidents = (orgIdentifier: string): Promise<any> => {
  return axiosInstance.get(`/api/org/${orgIdentifier}/incidents`).then(response => response.data);
};

/**
 * Save user to the backend
 * @param user 
 */
export const saveUser = (user: { name?: string; email?: string; sub?: string; orgIdentifier?: string }): Promise<any> => {
  return axiosInstance.post('/api/user', { user: { name: user.name, email: user.email }, organization: { orgIdentifier: user.orgIdentifier } });
};