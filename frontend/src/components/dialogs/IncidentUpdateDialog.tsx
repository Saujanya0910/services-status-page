import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { IncidentUpdate } from '@/types';

interface IncidentUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  incidentUpdate: IncidentUpdate | null;
  onSave: (update: IncidentUpdate) => void;
}

export function IncidentUpdateDialog({ open, onOpenChange, incidentUpdate, onSave }: IncidentUpdateDialogProps) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (incidentUpdate) {
      setMessage(incidentUpdate.message || '');
    } else {
      setMessage('');
    }
  }, [incidentUpdate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUpdate = {
      ...incidentUpdate,
      message,
      updatedAt: new Date(),
    };
    onSave(newUpdate);
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
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{incidentUpdate ? 'Update' : 'Add'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}