import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Incident } from '@/types';

interface IncidentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  incident: Incident | null;
  onSave: (incident: Incident) => void;
  serviceId: string | undefined;
}

export function IncidentDialog({ open, onOpenChange, incident, onSave, serviceId }: IncidentDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<Incident['status']>('investigating');
  const [severity, setSeverity] = useState<Incident['severity']>('minor');

  useEffect(() => {
    if (incident) {
      setTitle(incident.title || '');
      setDescription(incident.description || '');
      setStatus(incident.status || 'investigating');
      setSeverity(incident.severity || 'minor');
    } else {
      setTitle('');
      setDescription('');
      setStatus('investigating');
      setSeverity('minor');
    }
  }, [incident]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newIncident: Incident = {
      ...incident,
      title,
      description,
      status,
      severity,
      updatedAt: new Date(),
    };
    onSave(newIncident);
    setTitle('');
    setDescription('');
    setStatus('investigating');
    setSeverity('minor');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{incident ? 'Edit Incident' : 'Add Incident'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Incident Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as 'investigating' | 'identified' | 'monitoring' | 'resolved')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            >
              <option value="investigating">Investigating</option>
              <option value="identified">Identified</option>
              <option value="monitoring">Monitoring</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Severity
            </label>
            <select
              id="severity"
              value={severity}
              onChange={(e) => setSeverity(e.target.value as 'minor' | 'major' | 'critical')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            >
              <option value="minor">Minor</option>
              <option value="major">Major</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{incident ? 'Update Incident' : 'Add Incident'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}