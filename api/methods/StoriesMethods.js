import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import SimpleSchema from 'simpl-schema';
import { StoriesCollection } from '../collections/StoriesCollection';
import { StoryRoles } from '../../infra/StoryRoles';
import { Configuration, OpenAIApi } from "openai";
import {fetch, Headers} from 'meteor/fetch';

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
          StoriesCollection.update({_id: doc._id},{$set:{
            trimmedTitle: trimmedTitle
            , title: title
            , text: text
            , published: published
            , createdAt: new Date()
          }}) 
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
      textGPT:'',
      published,
      createdAt: new Date(),
      userId,
    });}}}
  },

  'story.aiassist'({storyId, text}){
const got = require('got');
const prompt = `write a story in first person based on the following facts: ` 
  + text;

(async () => {
  const url = 'https://api.openai.com/v1/completions';
  const params = {
    "model": "text-davinci-003",
    "prompt": prompt,
    "max_tokens": 2000,
    "temperature": 0.5,
  };
  const headers = {
    'Authorization': 'Bearer ' + Meteor.settings.GPTKey
  };

  try {
    const response = await got.post(url, { json: params, headers: headers }).json();
    console.log(response);
    const storiesCursor = StoriesCollection.find({_id:storyId})
    if( storiesCursor.count()) {
      storiesCursor.forEach(doc => 
        StoriesCollection.update(
          {_id: doc._id}
          ,{$set:{
            textGPT: response.choices[0].text
            ,gotGPT: true 
        }}
          ) 
        );
    }
  ;
  } catch (err) {
    console.log(err);
  }
})();  },

'story.resetGotGPT'({storyId}){
        return StoriesCollection.update(
          {_id: storyId}
          ,{$set:{gotGPT: false }}
          ); 
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
