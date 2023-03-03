import { Meteor } from 'meteor/meteor';
import { ProfilesCollection } from '../collections/ProfilesCollection';

Meteor.methods({
  'profiles.save'(profile) {
    /* Method to save a profile.  */
    /* If the profile already exists, it will update it.  */
    /* Otherwise it will insert a new profile.  */

    /* Magic to get user id and user name...  */
    const { userId} = this;

    /* Make sure a user is logged on.  */
    if (!userId) {
      throw new Meteor.Error('Access denied');
    };
    const username = Meteor.user().username;
    /* Find the user id and update the profile if found.  */
    const profilesCursor = ProfilesCollection.find({username})
    if( profilesCursor.count()) {
      profilesCursor.forEach(doc => 
        ProfilesCollection.update({_id: doc._id},{$set:{
          profile:profile
        }}) 
        );
    }
    else {
      /* This must be a new profile.  */
      /* Insert the new profile.  */
      return ProfilesCollection.insert({
        userId,
        username,
        profile
      });
    }
  },

});
