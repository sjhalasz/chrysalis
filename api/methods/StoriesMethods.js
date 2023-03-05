import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import { StoriesCollection } from '../collections/StoriesCollection';
import { SettingsCollection } from '../collections/SettingsCollection';
import { Shutdown } from './Shutdown';

Meteor.methods({
  'story.save'(args) {
    if(Shutdown()) throw new Meteor.Error("System shut down.");
    /* Method to save a story.  */
    /* If the story already exists, it will update it.  */
    /* Otherwise it will insert a new story.  */
    /*   */
    /*   */
    /* Magic to get user id and user name...  */
    const { userId } = this;
    const userName = Meteor.user().username;

    /* Make sure a user is logged on.  */
    if (!userId) {
      throw Meteor.Error('Access denied');
    };
    /* Split out the arguments.  */
    const {storyId, title, text, published } =  args;
    /* Put the title in canonical form to prevent duplicate titles.  */
    /* Remove beginning and ending white space and redundant spaces.  */
    /* Convert to lower case.  */
    const trimmedTitle = title.trim().replace(/\s+/g,' ').toLowerCase();
    /* Remove leading and trailing white space from text to check if empty.  */
    const trimmedText = text.trim();
    if (!trimmedTitle){
      throw new Meteor.Error('title blank', 'Title is required.');
    }
    /* Don't allow title to include asterisk to avoid confusion  */
    /*   with use of asterisk to identify a new story.  */
    else if (trimmedTitle.includes("*")) {
      throw new Meteor.Error('title asterisk', 'Title cannot contain *.')
    }
    /* Text cannot be empty.  */
    else if (!trimmedText) {
      throw new Meteor.Error('text required', 'Text is required.');
    }
    else {
      /* Find the story id and update the story if found.  */
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
          return storyId;
      }
      else {
      /* This must be a new story.  */
      /* Make sure this user doesn't already have a story with this canonical name.  */
        if(StoriesCollection.find({userId: userId, trimmedTitle: trimmedTitle}).count() != 0)
        {
          throw new Meteor.Error('duplicate name', 'This name already exists.');
        }
        else{
    /* Insert the new story.  */
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

   /* Method to use OpenAI GPT to enhance the story.  */
  'story.aiassist'({text}){
    if(Shutdown()) throw new Meteor.Error("System shut down.");
    /* text is the current, possibly unsaved text in the client.  */
    const got = require('got');
    /* prompt is what we ask GPT to do.  */
    const prompt = `write a story in first person based on the following facts: ` 
      + text;

    return (async () => {
      const url = 'https://api.openai.com/v1/completions';
      const params = {
        "model": "text-davinci-003",
        "prompt": prompt,
        /* Maximum tokens to return. Tokens are roughly equal to syllables.  */
        /* There are roughly 750 words per 1000 tokens.  */
        "max_tokens": 2000,
        /* temperature is value from 0 to 1 indicating how much risk  */
        /*   to take in guessing the answer.*/
        "temperature": 0.5,
      };
      const settings = SettingsCollection.find({}, {skip: 0, limit: 1}).fetch();
      if(!settings[0]){throw new Meteor.Error(
        {error:"settings empty"
        , reason: "Settings not available."
        }
      );}
      const headers = {
        /* The OpenAI key for this GPT account.  */
        'Authorization': 'Bearer ' + 
          JSON.parse(settings[0].settings.settings).GPT_KEY
      };
      try {
        /* Send the request to GPT and get response.  */
        const response = await got.post(url, { json: params, headers: headers }).json();
        return response.choices[0].text;
      } catch (err) {
        console.log(err);
      }
    })();  
  },

});
