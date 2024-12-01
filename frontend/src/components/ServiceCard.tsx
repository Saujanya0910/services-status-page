import { format } from 'date-fns';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import type { Service, ServiceStatus } from '../types';

const statusIcons = {
  operational: <CheckCircle className="h-6 w-6 text-green-500" />,
  degraded: <AlertCircle className="h-6 w-6 text-yellow-500" />,
  partial_outage: <AlertCircle className="h-6 w-6 text-orange-500" />,
  major_outage: <XCircle className="h-6 w-6 text-red-500" />,
};

const statusText = {
  operational: 'Operational',
  degraded: 'Degraded Performance',
  partial_outage: 'Partial Outage',
  major_outage: 'Major Outage',
};

interface ServiceCardProps {
  service: Service;
  onClick: () => void;
  onDelete: () => void;
  onUpdateStatus: (serviceId: string, status: ServiceStatus) => void;
}

export function ServiceCard({ service, onClick, onDelete, onUpdateStatus }: ServiceCardProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {service.status && statusIcons[service.status]}
          <div className="ml-3">
            <h3 className="text-lg font-medium text-gray-900">{service.name}</h3>
            <p className="text-sm text-gray-500">{statusText[service.status ?? 'operational']}</p>
          </div>
        </div>
        <span className="text-sm text-gray-500">
          Updated {format(service.updatedAt || new Date(), 'MMM d, yyyy HH:mm')}
        </span>
      </div>
      <p className="mt-2 text-sm text-gray-600">{service.description}</p>
      <div className="mt-4 flex space-x-2">
        <button onClick={onClick} className="text-blue-500 hover:underline">Edit</button>
        <button onClick={onDelete} className="text-red-500 hover:underline">Delete</button>
        <button onClick={() => service.uuid && onUpdateStatus(service.uuid, 'operational')} className="text-green-500 hover:underline">Set Operational</button>
      </div>
    </div>
  );
}