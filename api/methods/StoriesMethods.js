import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import SimpleSchema from 'simpl-schema';
import { StoriesCollection } from '../collections/StoriesCollection';
import { StoryRoles } from '../../infra/StoryRoles';

Meteor.methods({
  'story.save'(args) {
    const { userId } = this;
    const userName = Meteor.user().username;

    if (!userId) {
      throw Meteor.Error('Access denied');
    };
    if (!Roles.userIsInRole(userId, StoryRoles.PUBLISHER)) {
      throw new Error('Permission denied');
    }
    const {storyId, title, text, published } =  args;
    const trimmedTitle = title.trim().replace(/\s+/g,' ').toLowerCase();
    const trimmedText = text.trim();
    if (!trimmedTitle){
      throw new Meteor.Error('title blank', 'Title is required.');
    }
    else if (trimmedTitle.includes("*")) {
      throw new Meteor.Error('title asterisk', 'Title cannot contain *.')
    }
    else if (!trimmedText) {
      throw new Meteor.Error('text required', 'Text is required.');
    }
    else {
      const storiesCursor = StoriesCollection.find({_id:storyId})
      if( storiesCursor.count()) {
        storiesCursor.forEach(doc => 
          StoriesCollection.update({_id: doc._id},{$set:{trimmedTitle: trimmedTitle, title: title, text: text, published: published}}) 
          );
      }
      else {
        if(StoriesCollection.find({trimmedTitle: trimmedTitle}).count() != 0)
        {
          throw new Meteor.Error('duplicate name', 'This name already exists.');
        }
        else{
        return StoriesCollection.insert({
      userName,    
      trimmedTitle,
      title,
      text,
      published,
      createdAt: new Date(),
      userId,
    });}}}
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
