import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import React from 'react';

export const statusIcons = {
  operational: React.createElement(CheckCircle, { className: 'h-6 w-6 text-green-500' }),
  degraded: React.createElement(AlertCircle, { className: 'h-6 w-6 text-yellow-500' }),
  partial_outage: React.createElement(AlertCircle, { className: 'h-6 w-6 text-orange-500' }),
  major_outage: React.createElement(XCircle, { className: 'h-6 w-6 text-red-500' }),
  outage: React.createElement(XCircle, { className: 'h-6 w-6 text-red-500' }),
};

export const statusText = {
  operational: 'Operational',
  degraded: 'Degraded Performance',
  partial_outage: 'Partial Outage',
  major_outage: 'Major Outage',
  outage: 'Outage',
};

export const statusColors = {
  operational: 'bg-green-500 text-white',
  degraded: 'bg-yellow-500 text-white',
  outage: 'bg-red-500 text-white',
  partial_outage: 'bg-orange-500 text-white',
  default: 'bg-gray-500 text-white',
};