import { Meteor } from 'meteor/meteor';
import { StoriesCollection } from '../collections/StoriesCollection';

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
