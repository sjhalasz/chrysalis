import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createRoot } from 'react-dom/client';
import { App } from '../ui/App';
import '../api/methods/CommentsMethods';
import '../api/methods/StoriesMethods';

Meteor.startup(() => {
  Meteor.logout();

  const href = window.location.href.match(/^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/);
  if(href[5] != '/') window.location.href = href[1] + href[3];

  const root = createRoot(document.getElementById('react-target'));
  root.render(<App />);
});
