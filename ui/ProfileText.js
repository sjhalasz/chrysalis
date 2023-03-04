import React from 'react';
import { ProfilesCollection } from '../api/collections/ProfilesCollection';
import { useSubscribe, useFind } from 'meteor/react-meteor-data';
import { useState } from 'react';

export const ProfileText = () => {
  const [profile, setProfile] = useState({
    text:""
  });

  {/* Get a cursor over profile for this user.  */}
  const isLoadingProfiles = useSubscribe('myProfile');
  const profilesCursor = useFind(() => ProfilesCollection.find({}));

  profilesCursor.map((doc) => {
    data = doc.profile;
    if(data.text != profile.text) setProfile(data);
  });
  
  function handleEvent(event) {
    profile.text = event.target.value;
    Meteor.call('profiles.save', profile);
  }
  

  return (
    <div>
      <br/>
      <textarea
        className = "object-center mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        onInput={handleEvent}
        value={profile.text}
      /> 
    </div>    
  )
}