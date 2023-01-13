import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const StoriesCollection = new Mongo.Collection('stories');

const StoriesSchema = new SimpleSchema({

  title: {
    type: String,
    defaultValue: "",
  },

  trimmedTitle: {
    type: String,
    defaultValue: "",
  },

  text: {
    type: String,
    defaultValue: "",
  },

  published: {
    type: Boolean,
    defaultValue: false,
  },

  createdAt: {
    type: Date,
  },

  userId: {
    type: String,
  },
});

StoriesCollection.attachSchema(StoriesSchema);
