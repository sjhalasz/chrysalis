import { Meteor } from 'meteor/meteor';
import { ProfilesCollection } from '../collections/ProfilesCollection';

/* This is used to publish profiles from all users. */
Meteor.publish('allProfiles', function publishAllProfiles() {
  return ProfilesCollection.find({});
});

/* This is used to publish profile of the current user. */
Meteor.publish('myProfile', function publishAllProfiles() {
      /* Magic to get user id and user name...  */
      const { userId } = this;
      /* Make sure a user is logged on.  */
      if (!userId) {
        throw new Meteor.Error('Access denied');
      };
  return ProfilesCollection.find({userId});
});
