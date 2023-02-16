import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import SimpleSchema from 'simpl-schema';
import { SettingsCollection } from '../collections/SettingsCollection';
import { Roles } from 'meteor/alanning:roles';
import {ApplicationRoles} from '../../infra/ApplicationRoles';

Meteor.methods({
  'settings.save'(settings) {
    /* Method to save settings.  */
    /* Only ever one document in this collection */

    /* Magic to get user id and user name...  */
    const { userId } = this;
    console.log(userId);

    /* Make sure a user is logged on.  */
    if (!userId) {
      throw new Meteor.Error('Access denied');
    };

    /* Make sure user is an admin.  */
    if(!Roles.userIsInRole(userId, ApplicationRoles.ADMIN)){
      console.log("user not admin")
      throw new Meteor.Error('Access denied');
    };  

    /* Find the settings and update  if found.  */
    const settingsCursor = SettingsCollection.find({});
    if( settingsCursor.count()) {
      settingsCursor.forEach(doc => 
        SettingsCollection.update({_id: doc._id},{$set:{settings:settings}}) 
      );
    }
    else {
      /* This must be first time settings.  */
      return SettingsCollection.insert({settings});
    }
  }
});
