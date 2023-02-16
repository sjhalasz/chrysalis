import { Meteor } from 'meteor/meteor';
import { SettingsCollection } from '../collections/SettingsCollection';
import { Roles } from 'meteor/alanning:roles';
import {ApplicationRoles} from '../../infra/ApplicationRoles';

/* This is used to publish settings. */
/* It includes unblocked stories only. */
Meteor.publish('settings', function publishSettings() {
    /* Magic to get user id and user name...  */
    const { userId } = this;

    /* Make sure a user is logged on.  */
    if (!userId) {
      throw new Meteor.Error('Access denied');
    };
  
    /* Make sure user is an admin.  */
    if(!Roles.userIsInRole(userId, ApplicationRoles.ADMIN)){
        throw new Meteor.Error('Access denied');
    };  
  
    return SettingsCollection.find({});
});
