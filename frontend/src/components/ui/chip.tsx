import React from 'react';
import { statusColors } from '../../constants/index'; // Import statusColors
import { ServiceStatus } from '@/types';

interface ChipProps {
  status: ServiceStatus;
  children: React.ReactNode;
}

export function Chip({ status, children }: ChipProps) {
  const color = statusColors[status] || statusColors['default'];

  return (
    <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${color}`} style={{ width: 'max-content' }}>
      {children}
    </span>
  );
}