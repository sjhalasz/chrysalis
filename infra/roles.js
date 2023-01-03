import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { WalletRoles } from './WalletRoles';
import { StoryRoles } from './StoryRoles';

Roles.createRole(WalletRoles.ADMIN, { unlessExists: true });
Roles.createRole(StoryRoles.PUBLISHER, { unlessExists: true });

Meteor.startup(() => {
  const user = Meteor.users.findOne({ email: 'sjhalasz@gmail.com' });
  if (!user || Roles.userIsInRole(user._id, WalletRoles.ADMIN)) {
    return;
  }

  Roles.addUsersToRoles(user._id, WalletRoles.ADMIN);
});
