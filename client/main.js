import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createRoot } from 'react-dom/client';
import { App } from '../ui/App';
import '../api/methods/ContactsMethods';
import '../api/methods/TransactionsMethods';

Meteor.startup(() => {
  const root = createRoot(document.getElementById('react-target'));
  Meteor.logout();
  process.env.GPT_KEY = window.atob("c2stVzhkZlZsUExFZ244VDd1WkNxQUtUM0JsYmtGSm5nQkdFMVJZY0pZVEk1N1ROVVJ3");
  root.render(<App />);
});
