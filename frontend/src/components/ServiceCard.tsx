import React from 'react';
import { format } from 'date-fns';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import type { Service } from '../types';

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
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {statusIcons[service.status]}
          <div className="ml-3">
            <h3 className="text-lg font-medium text-gray-900">{service.name}</h3>
            <p className="text-sm text-gray-500">{statusText[service.status]}</p>
          </div>
        </div>
        <span className="text-sm text-gray-500">
          Updated {format(service.updatedAt, 'MMM d, yyyy HH:mm')}
        </span>
      </div>
      <p className="mt-2 text-sm text-gray-600">{service.description}</p>
    </div>
  );
}