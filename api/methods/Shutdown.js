import { SettingsCollection } from '../collections/SettingsCollection';
import { Roles } from 'meteor/alanning:roles';
import {ApplicationRoles} from '../../infra/ApplicationRoles';

  export const Shutdown = () => {
  // Returns true if system is shut down for non-admin, false otherwise


  // If called on client side, no shutdown
  if(Meteor.isClient){
    return false;
  }

  const settings = SettingsCollection.find({}, {skip: 0, limit: 1}).fetch();
  if(!settings[0]){
    // If there are no settings, no shutdown
    return false;
  }

  // Read the shutdown flag from settings
  var shutdown = JSON.parse(settings[0].settings.settings).SHUTDOWN;
  
  // If shut down flag has been set...
  if(shutdown){
    // If not logged in or user is not admin, shut down
    if (!Meteor.userId()
      || !Roles.userIsInRole(Meteor.userId(), ApplicationRoles.ADMIN)) 
        return true;
  };

    // User is an admin or shutdown flag not set, no shutdown
    return false;
}
