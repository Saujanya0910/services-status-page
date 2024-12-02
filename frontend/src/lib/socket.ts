import { io } from 'socket.io-client';
import useStore from '../store';

const SOCKET_URL = 'http://localhost:3001'; // Replace with your actual WebSocket server URL

export const socket = io(SOCKET_URL);

socket.on('connect', () => {
  console.log('Connected to WebSocket server');
});

socket.on('serviceUpdate', (service) => {
  const { updateServiceStatus } = useStore.getState();
  updateServiceStatus(service.id, service.status);
});

socket.on('incidentUpdate', (incident) => {
  const { updateIncident } = useStore.getState();
  updateIncident(incident);
});

export const emitServiceUpdate = (serviceId: string, status: string) => {
  socket.emit('serviceUpdate', { serviceId, status });
};

export const emitIncidentUpdate = (incident: any) => {
  socket.emit('incidentUpdate', incident);
};