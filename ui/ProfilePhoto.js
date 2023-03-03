import React from 'react';
import { ProfilesCollection } from '../api/collections/ProfilesCollection';
import { useSubscribe, useFind } from 'meteor/react-meteor-data';
import { useState } from 'react';

export const ProfilePhoto = () => {
  const [profile, setProfile] = useState({
    photo:"/images/add-contact-icon.png"
  });

  {/* Get a cursor over profile for this user.  */}
  const isLoadingProfiles = useSubscribe('myProfile');
  const profilesCursor = useFind(() => ProfilesCollection.find({}));

  profilesCursor.map((doc) => {
    data = doc.profile;
    if(data.photo != profile.photo) setProfile(data);
  });
  
  function handleEvent(event) {
    profile.photo = event.currentTarget.result;
    Meteor.call('profiles.save', profile);
  }
  
  function addListeners(reader) {
    reader.addEventListener("load", handleEvent);
  }
  
  function handleSelected(e) {
    const fileInput = document.querySelector('input[type="file"]');
    if(fileInput.files[0].size > 50000){window.alert("File too large");return;}
    const reader = new FileReader();
    addListeners(reader);
    reader.readAsDataURL(fileInput.files[0]);
  }
 
  return (
    <div>
      <br/>
      <input 
        type="file" 
        id="input-file" 
        onChange = {handleSelected} 
        accept="image/*" 
        className="hidden"
      /> 
      <label htmlFor="input-file">
        <img 
          position="relative"
          src={profile.photo} 
          height="200" 
          alt="Click to select an image." 
        />
      </label>
    </div>    
  )
}