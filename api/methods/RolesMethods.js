import { Meteor } from 'meteor/meteor';

import { Roles } from 'meteor/alanning:roles';
import { WalletRoles } from '../../infra/WalletRoles';
import { StoryRoles } from '../../infra/StoryRoles'

Meteor.methods({
  'roles.isAdmin'() {
    const { userId } = this;
    if (!userId) {
      throw new Error('Access denied');
    }

    return Roles.userIsInRole(userId, WalletRoles.ADMIN);
  },

  'roles.isPublisher'() {
    const { userId } = this;
    if (!userId) {
      throw new Error('Access denied');
    }

    return Roles.userIsInRole(userId, StoryRoles.PUBLISHER);
  },
});
