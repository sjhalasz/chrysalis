import React from 'react';
import { StoriesList } from './StoryList';
import { ProfileShow } from './ProfileShow';

/* Home screen displays welcome message and list of published stories. */
export const Stories = () => (
    <>
        <ProfileShow />
        <StoriesList />
    </>
);
