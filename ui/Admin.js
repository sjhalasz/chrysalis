import React from 'react';
import { AdminSettings } from './AdminSettings';
import { AdminUsers } from './AdminUsers';
import { AdminDump } from './AdminDump';

export const Admin = () => (
    <>
        <div>
            ADMIN FUNCTIONS
        </div>
        <AdminSettings />
        <hr/>
        <AdminUsers />
        <hr/>
        <AdminDump />
    </>
);