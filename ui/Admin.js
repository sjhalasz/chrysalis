import React from 'react';
import { AdminSettings } from './AdminSettings';
import { AdminUsers } from './AdminUsers';

export const Admin = () => (
    <>
        <div>
            ADMIN FUNCTIONS
        </div>
        <AdminSettings />
        <hr/>
        <AdminUsers />
    </>
);