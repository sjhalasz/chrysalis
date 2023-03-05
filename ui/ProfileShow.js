import React from 'react';
import { ProfilesCollection } from '../api/collections/ProfilesCollection';
import { useSubscribe, useFind } from 'meteor/react-meteor-data';
import { useParams } from 'react-router-dom';
import { Loading } from './components/Loading';

export const ProfileShow = () => {

  profile = {};

  {/* Get a cursor over profile for this user.  */}
  const isLoadingProfiles = useSubscribe('allProfiles');
  const user = useParams()._id;
  const profilesCursor = useFind(() => ProfilesCollection.find({userId:user}));
  
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