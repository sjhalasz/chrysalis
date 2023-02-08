import React from 'react';
import { StoriesList } from './StoryList';

/* Home screen displays welcome message and list of published stories. */
export const Home = () => (
    <>
        <div>
            Welcome to Chrysalis Connection.
        </div>
        <StoriesList />
    </>
);
