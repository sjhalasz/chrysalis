// used to sign in a user who is already signed up

import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { RoutePaths } from './RoutePaths';
import { useNavigate } from 'react-router-dom';
import { ErrorAlert } from './components/ErrorAlert';

export const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState();

  /* Function to sign in the user. */
  const signIn = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Email is required.')
    }
    else if (!password) {
      setError('Password is required.')
    }
    else Meteor.loginWithPassword(email, password, (err) => {
      if (err) {
        setError(err.reason);
        return;
      }
      navigate(RoutePaths.HOME);
    });
  };

  /* HTML for sign in page. */
  return (
    <div className="flex flex-col items-center">
      <h3 className="px-3 py-2 text-lg text-base font-medium">
        Sign In
      </h3>
      {<ErrorAlert message = { error }/> }
      <form className="mt-6 flex flex-col">
        <div className="flex flex-col space-y-4">
          <div className="">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Button to return home without signing in. */}
        <div className="flex justify-center py-3">
          <button
            onClick={() => navigate(RoutePaths.HOME)}
            className="inline-flex  justify-center rounded-md border border-gray-300 py-2 px-4 text-sm font-medium text-black shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
          >
            Back to Home
          </button>

          {/* Button to submit sign in. */}
            <button
              onClick={signIn}
              type="submit"
              className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
              autoFocus
            >
              Sign In
            </button>
        </div>

        {/* Link to switch to sign up page. */}
        <div className="py-3">
          <a
            className="cursor-pointer text-indigo-800"
            onClick={() => navigate(RoutePaths.SIGNUP)}
          >
              If you don't have an account, click here.
          </a>
        </div>

        {/* Link to switch to forgot password page. */}
        <div className="py-3">
          <a
            className="cursor-pointer text-indigo-800"
            onClick={() => navigate(RoutePaths.FORGOT_PASSWORD)}
          >
            Forgot password?
          </a>
        </div>
      </form>
    </div>
  );
};
