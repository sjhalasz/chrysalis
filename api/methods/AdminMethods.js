import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import {ApplicationRoles} from '../../infra/ApplicationRoles';

Meteor.methods({
  'users.retrieve'() {
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
  
    return Meteor.users.find({}).fetch();
  }
});
