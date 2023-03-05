import { Meteor } from 'meteor/meteor';
import { StoriesCollection } from '../collections/StoriesCollection';
import { Roles } from 'meteor/alanning:roles';
import {ApplicationRoles} from '../../infra/ApplicationRoles';

/* This is used to publish all stories, published or not. */
Meteor.publish('dumpStories', function dumpStories() {
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
  
    return StoriesCollection.find({});
});

/* This is used to publish stories for a particular user; */
/* It includes both published and unpublished stories. */
Meteor.publish('myStories', function publishStories() {
  const { userId } = this;
  if (!userId) {
    throw Meteor.Error('Access denied');
  }

  const userName = Meteor.user().username;

  return StoriesCollection.find({ userName });
});

/* This is used to publish stories from all users. */
/* It includes published stories only. */
Meteor.publish('allStories', function publishAllStories() {
  return StoriesCollection.find({published:true});
});
