import React from 'react';
import { Meteor } from 'meteor/meteor';

export const Shutdown = () => {
Meteor.logout();
return (
  <div>
    <div className="mt-10">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        System shut down for maintenance.
      </h3>
    </div>
  </div>
);
}