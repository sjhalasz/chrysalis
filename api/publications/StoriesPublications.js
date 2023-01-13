import { Meteor } from 'meteor/meteor';
import { StoriesCollection } from '../collections/StoriesCollection';

Meteor.publish('myStories', function publishStories() {
  const { userId } = this;
  if (!userId) {
    throw Meteor.Error('Access denied');
  }

  return StoriesCollection.find({ userId });
});
