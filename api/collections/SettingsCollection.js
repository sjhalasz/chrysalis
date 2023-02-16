import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const SettingsCollection = new Mongo.Collection('settings');