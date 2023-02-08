import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import SimpleSchema from 'simpl-schema';
import { CommentsCollection } from '../collections/CommentsCollection';

Meteor.methods({
  'comments.save'(args) {
    /* Method to save a comment.  */
    /* If the comment already exists, it will update it.  */
    /* Otherwise it will insert a new comment.  */

    /* Magic to get user id and user name...  */
    const { userId } = this;

    /* Make sure a user is logged on.  */
    if (!userId) {
      throw new Meteor.Error('Access denied');
    };
    const userName = Meteor.user().username;

    /* Split out the arguments.  */
    const {commentId, storyId, parentId, text } =  args;
    /* Remove leading and trailing white space from text to check if empty.  */
    const trimmedText = text.trim();
    /* Text cannot be empty.  */
    if (!trimmedText) {
      throw new Meteor.Error('text required', 'Text is required.');
    }
    else {
      /* Find the comment id and update the comment if found.  */
      const commentsCursor = CommentsCollection.find({_id:commentId})
      if( commentsCursor.count()) {
        commentsCursor.forEach(doc => 
          CommentsCollection.update({_id: doc._id},{$set:{
            text: text
          }}) 
          );
      }
      else {
      /* This must be a new comment.  */
      /* Insert the new comment.  */
    return StoriesCollection.insert({
      storyId,
      userId,
      userName,    
      parentId,
      text,
      createdAt: new Date(),
    });}}
  },

});
