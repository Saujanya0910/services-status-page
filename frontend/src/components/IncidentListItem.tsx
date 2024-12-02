import { format } from 'date-fns';
import { Incident } from '../types';
import { STATUS_STYLES } from '@/constants';

interface IncidentListItemProps {
  incident: Incident;
}

export function IncidentListItem({ incident }: IncidentListItemProps) {
  return (
    <li className="bg-white shadow overflow-hidden sm:rounded-lg mb-4">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">{incident.title}</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">{incident.description}</p>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">Last updated: {incident.updatedAt ? format(new Date(incident.updatedAt), 'PPpp') : 'N/A'}</p>
      </div>
      <div className="border-t border-gray-200 bg-white">
        {(incident.IncidentUpdates ?? []).length === 0 ? (
          <div className="p-4 text-center text-gray-500">No updates available.</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {(incident.IncidentUpdates ?? []).map((update) => (
              <li key={update.uuid} className="px-4 py-4 sm:px-6 bg-gray-50">
                <div className="text-sm font-medium text-gray-900">{update.message}</div>
                <div className="mt-1 text-sm text-gray-500">Last updated: {update.updatedAt ? format(new Date(update.updatedAt), 'PPpp') : 'N/A'}</div>
                <div className="mt-2">
                  <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${STATUS_STYLES[update.status ?? 'investigating']}`}>
                    {update.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}