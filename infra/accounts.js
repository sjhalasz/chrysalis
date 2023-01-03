import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { RoutePaths } from '../ui/RoutePaths';
import { Roles } from 'meteor/alanning:roles';
import { WalletsCollection } from '../api/collections/WalletsCollection';
import { StoryRoles } from './StoryRoles';

Accounts.emailTemplates.resetPassword.html = (user, url) =>
  `Hello,<br/><br/>Reset your password with this link: ${url}`;

Accounts.urls.resetPassword = (token) =>
  Meteor.absoluteUrl(`${RoutePaths.RESET_PASSWORD.substring(1)}/${token}`);

Accounts.onCreateUser((options, user) => {
  const customizedUser = { ...user };

  WalletsCollection.insert({ userId: user._id, createdAt: new Date() });
  Roles.addUsersToRoles(user._id, StoryRoles.PUBLISHER);
  
  customizedUser.email = user.emails[0].address;
  return customizedUser;
});

Accounts.setDefaultPublishFields({
  ...Accounts._defaultPublishFields.projection,
  email: 1,
});
