export type ServiceStatus = 'operational' | 'degraded' | 'partial_outage' | 'major_outage';

export interface Organization {
  id?: number;
  uuid?: string;
  name?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isActive?: boolean;
}

export interface Service {
  id?: number;
  uuid?: string;
  name?: string;
  description?: string;
  status?: ServiceStatus;
  updatedAt?: Date;
  isActive?: boolean;
}

export interface Incident {
  id?: number;
  uuid?: string;
  title?: string;
  description?: string;
  status?: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  severity?: 'minor' | 'major' | 'critical';
  createdAt?: Date;
  updatedAt?: Date;
  serviceIds?: string[];
  updates?: IncidentUpdate[];
  isActive?: boolean;
}

export interface IncidentUpdate {
  id?: number;
  uuid?: string;
  message?: string;
  status?: Incident['status'];
  createdAt?: Date;
  isActive?: boolean;
}

export interface User {
  id?: number;
  uuid?: string;
  email?: string;
  name?: string;
  role?: 'admin' | 'member';
  organizationId?: string;
  isActive?: boolean;
}