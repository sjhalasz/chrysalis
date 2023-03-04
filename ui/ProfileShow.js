import React from 'react';
import { ProfilesCollection } from '../api/collections/ProfilesCollection';
import { useSubscribe, useFind } from 'meteor/react-meteor-data';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

export const ProfileShow = () => {

  profile = {};

  {/* Get a cursor over profile for this user.  */}
  const isLoadingProfiles = useSubscribe('allProfiles');
  const profilesCursor = useFind(() => ProfilesCollection.find({userId:useParams()._id}));

  profilesCursor.map((doc) => {
    profile = doc.profile;
  });
  
  return (
    <div>
      <br/>
      <img src={profile.photo} height="200" alt="" />
      <div>
        {profile.text}
      </div>
    </div>
     
  )
}