import { Meteor } from 'meteor/meteor';
import { CommentsCollection } from '../collections/CommentsCollection';
import { Roles } from 'meteor/alanning:roles';
import {ApplicationRoles} from '../../infra/ApplicationRoles';

/* This is used to publish all comments, blocked or not. */
Meteor.publish('dumpComments', function dumpComments() {
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
  
    return CommentsCollection.find({});
});

/* This is used to publish comments from all users. */
/* It includes unblocked comments only. */
Meteor.publish('allComments', function publishAllComments() {
  return CommentsCollection.find({blocked:false});
});
