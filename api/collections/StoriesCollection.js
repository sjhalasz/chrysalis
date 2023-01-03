import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const StoriesCollection = new Mongo.Collection('stories');

const StoriesSchema = new SimpleSchema({

  title: {
    type: String,
    defaultValue: "",
  },

  text: {
    type: String,
    defaultValue: "",
  },

  year: {
    type: Number,
    min: 1900,
    max: 2099,
    defaultValue: 1900,
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
