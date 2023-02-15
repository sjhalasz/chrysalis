import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { AlertProvider, Alert } from 'meteor/quave:alert-react-tailwind';
import { Header } from './Header';
import { Router } from './Router';
import { Meteor } from 'meteor/meteor';

export const App = () => (
  <BrowserRouter>
    <AlertProvider>
      <div>
        <Header />
        <Alert />
        <div className="min-h-full">
          <div className="mx-auto max-w-4xl p-2">
            <Router />
          </div>
        </div>
      </div>
    </AlertProvider>
  </BrowserRouter>
);
