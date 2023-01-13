import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import SimpleSchema from 'simpl-schema';
import { StoriesCollection } from '../collections/StoriesCollection';
import { StoryRoles } from '../../infra/StoryRoles';

Meteor.methods({
  'story.save'(args) {
    const { userId } = this;
    if (!userId) {
      throw Meteor.Error('Access denied');
    };
    if (!Roles.userIsInRole(userId, StoryRoles.PUBLISHER)) {
      throw new Error('Permission denied');
    }
    const {title, text, published } =  args;
    const trimmedTitle = title.trim().replace(/\s+/g,' ').toLowerCase();
    const trimmedText = text.trim();
    if (!trimmedTitle){
      throw new Meteor.Error('title blank', 'Title is required.');
    }
    else if (!trimmedText) {
      throw new Meteor.Error('text required', 'Text is required.');
    }
    else {
      const storiesCursor = StoriesCollection.find({trimmedTitle:trimmedTitle})
      if( storiesCursor.count()) {
        storiesCursor.forEach(doc => 
          StoriesCollection.update({_id: doc._id},{$set:{title: title, text: text, published: published}}) 
          );
      }
      else return StoriesCollection.insert({
      trimmedTitle,
      title,
      text,
      published,
      createdAt: new Date(),
      userId,
    });}

  },
  'story.remove'(storyId) {
    const { userId } = this;
    if (!userId) {
      throw Meteor.Error('Access denied');
    }
    check(storyId, String);

    if (!Roles.userIsInRole(userId, StoryRoles.PUBLISHER)) {
      throw new Error('Permission denied');
    }

    return StoriesCollection.remove(storyId);
  },
});
