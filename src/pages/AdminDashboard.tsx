import React, { useState } from 'react';
import { useStore } from '../store';
import { ServiceCard } from '../components/ServiceCard';
import { AddServiceDialog } from '../components/AddServiceDialog';
import { Plus } from 'lucide-react';
import { Button } from '../components/ui/button';

export function AdminDashboard() {
  const { services, incidents } = useStore();
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <Button onClick={() => setIsAddServiceOpen(true)}>
          <Plus className="h-5 w-5 mr-2" />
          Add Service
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>

      {incidents.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Active Incidents</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <ul className="divide-y divide-gray-200">
              {incidents.map((incident) => (
                <li key={incident.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {incident.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {incident.description}
                      </p>
                    </div>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      incident.severity === 'critical' 
                        ? 'bg-red-100 text-red-800'
                        : incident.severity === 'major'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {incident.severity}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <AddServiceDialog
        open={isAddServiceOpen}
        onOpenChange={setIsAddServiceOpen}
      />
    </div>
  );
}