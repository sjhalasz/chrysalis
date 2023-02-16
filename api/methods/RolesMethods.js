import { Meteor } from 'meteor/meteor';
import { ApplicationRoles } from '../../infra/ApplicationRoles';
import { Roles } from 'meteor/alanning:roles';

Meteor.methods({
    'roles.isAdmin'() {

        const { userId } = this;
        if (!userId) {
          return false;
        }
        const result = Roles.userIsInRole(userId, ApplicationRoles.ADMIN);
        return result;

      },
});
