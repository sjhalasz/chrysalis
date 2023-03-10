import React from 'react';
import XCircleIcon from '@heroicons/react/24/solid/XCircleIcon';

export const ErrorAlert = ({ message }) => (
  <div className="rounded-md bg-red-50 p-4">
    <div className="flex">
      <div className="flex-shrink-0">
        {message ? 
        (<XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />) : 
        (<div className="h-5 w-5"></div>)}
      </div>
      <div className="ml-3">
        <h3 className="text-sm font-medium text-red-800">{message}</h3>
      </div>
    </div>
  </div>
);
