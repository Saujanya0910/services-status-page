import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { IncidentUpdate } from '@/types';

interface IncidentUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  incidentUpdate: IncidentUpdate | null;
  onSave: (update: IncidentUpdate) => void;
  incidentId: string;
  isLoading?: boolean;
}

export function IncidentUpdateDialog({ open, onOpenChange, incidentUpdate, onSave, isLoading = false }: IncidentUpdateDialogProps) {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<IncidentUpdate['status']>('investigating');

  useEffect(() => {
    if (incidentUpdate) {
      setMessage(incidentUpdate.message || '');
      setStatus(incidentUpdate.status || 'investigating');
    } else {
      setMessage('');
      setStatus('investigating');
    }
  }, [incidentUpdate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUpdate: IncidentUpdate = {
      ...incidentUpdate,
      message,
      status,
      updatedAt: new Date(),
    };
    onSave(newUpdate);
    setMessage('');
    setStatus('investigating');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{incidentUpdate ? 'Edit Update' : 'Add Update'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Update Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
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
              onChange={(e) => setStatus(e.target.value as IncidentUpdate['status'])}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            >
              <option value="investigating">Investigating</option>
              <option value="identified">Identified</option>
              <option value="monitoring">Monitoring</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : (incidentUpdate ? 'Update' : 'Add')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}