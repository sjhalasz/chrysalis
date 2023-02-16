import { Meteor } from 'meteor/meteor';
import { CommentsCollection } from '../collections/CommentsCollection';

/* This is used to publish comments from all users. */
/* It includes unblocked comments only. */
Meteor.publish('allComments', function publishAllComments() {
  return CommentsCollection.find({blocked:false});
});
