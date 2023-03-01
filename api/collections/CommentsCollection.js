import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const CommentsCollection = new Mongo.Collection('comments');

const CommentsSchema = new SimpleSchema({
    storyId:{
        type:String,
    },

    userName: {
    type: String,
  },

  parentId: {
    type: String,
    defaultValue:""
  },

  text: {
    type: String,
    defaultValue: "",
  },

  blocked: {
    type: Boolean,
    defaultValue: false,
  },

  createdAt: {
    type: Date,
  },

});

CommentsCollection.attachSchema(CommentsSchema); 