import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createRoot } from 'react-dom/client';
import { App } from '../ui/App';
import '../api/methods/ContactsMethods';
import '../api/methods/TransactionsMethods';

Meteor.startup(() => {
  process.env.METEOR_SETTINGS = {
    "packages": {
      "quave:email-postmark": {
        "from": "noreply@gmail.com",
        "apiToken": "fedd0c18-5c64-46c2-91f7-6070858e7249"
      }
    }
  }
  const root = createRoot(document.getElementById('react-target'));
  root.render(<App />);
});
