import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { ApplicationRoles } from './ApplicationRoles';

Roles.createRole(ApplicationRoles.ADMIN, { unlessExists: true });

Meteor.startup(() => {
    const user = Meteor.users.findOne({ email: 'sjhalasz@gmail.com' });
    if (!user || Roles.userIsInRole(user._id, ApplicationRoles.ADMIN)) {
      return;
    }
  
    Roles.addUsersToRoles(user._id, ApplicationRoles.ADMIN);
});

