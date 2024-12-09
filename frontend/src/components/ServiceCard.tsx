import { format } from 'date-fns';
import type { Service, ServiceStatus } from '../types';
import { statusText } from '@/constants';
import { Chip } from '../components/ui/chip';

interface ServiceCardProps {
  service: Service;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onUpdateStatus: (serviceIdentifier: string, status: ServiceStatus) => void;
}

export function ServiceCard({ service, onClick, onEdit, onDelete, onUpdateStatus }: ServiceCardProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between">
        <div className="flex items-center" onClick={onClick}>
          <div className="">
            <h3 className="text-lg font-medium text-gray-900 hover:underline cursor-pointer">{service.name}</h3>
            <div className="mt-2">
              <Chip status={
                service.status === 'partial_outage' ? 'degraded' : 
                service.status === 'down' ? 'down' : 
                service.status ?? 'operational'
              }>
                {statusText[service.status as keyof typeof statusText ?? 'operational']}
              </Chip>
            </div>
          </div>
        </div>
        <span className="text-sm text-gray-500 hover:underline mt-1 text-right">
          Updated {format(service.updatedAt || new Date(), 'MMM d, yyyy HH:mm')}
        </span>
      </div>
      <p className="mt-2 text-sm text-gray-600">{service.description}</p>
      <div className="mt-4 flex space-x-2">
        <button onClick={onEdit} className="text-blue-500 hover:underline">Edit</button>
        <button onClick={onDelete} className="text-red-500 hover:underline">Delete</button>
        <button onClick={() => service.uuid && onUpdateStatus(service.uuid, 'operational')} className="text-green-500 hover:underline">Set Operational</button>
      </div>
    </div>
  );
}