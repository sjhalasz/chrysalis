import { Meteor } from 'meteor/meteor';
import { ApplicationRoles } from '../../infra/ApplicationRoles';
import { Roles } from 'meteor/alanning:roles';

Meteor.methods({
    'roles.isAdmin'() {
        const { userId } = this;
        if (!userId) {
          throw new Error('Access denied');
        }
    
        return Roles.userIsInRole(userId, ApplicationRoles.ADMIN);
      },
});
