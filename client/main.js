import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createRoot } from 'react-dom/client';
import { App } from '../ui/App';
import '../api/methods/CommentsMethods';
import '../api/methods/StoriesMethods';

Meteor.startup(() => {
  Meteor.logout();

  // On startup, navigate to root if not already there.
  // This regex splits the url into parts.
  const href = window.location.href.match(/^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/);
  // Element [5] is the part after the domain.
  // Element [1] is http:
  // Element [3] is //domain.com
  if(href[5] != '/') window.location.href = href[1] + href[3];

  const root = createRoot(document.getElementById('react-target'));
  root.render(<App />);
});
