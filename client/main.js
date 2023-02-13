import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createRoot } from 'react-dom/client';
import { App } from '../ui/App';
import '../api/methods/CommentsMethods';
import '../api/methods/StoriesMethods';

Meteor.startup(() => {
  const root = createRoot(document.getElementById('react-target'));
  Meteor.logout();
  root.render(<App />);
});
