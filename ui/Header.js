import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { RoutePaths } from './RoutePaths';
import { useLoggedUser } from 'meteor/quave:logged-user-react';

export const Header = () => {
  const navigate = useNavigate();
  const { loggedUser, isLoadingLoggedUser } = useLoggedUser();
  return (
    <header className="bg-indigo-600">
      <nav className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex w-full items-center justify-between border-b border-indigo-500 py-6 lg:border-none">
          <div className="flex grow items-center justify-between">
            <div>
              {/* The logo as hyperlink that returns to home screen. */}
              <a
                className="cursor-pointer"
                onClick={() => navigate(RoutePaths.HOME)}
              >
                <span className="sr-only">Chrysalis Connection </span>
                <img className="h-10 w-auto" src="/images/logo.png" alt="" />
              </a>
            </div>
            {/* If a user is logged on, display the link to write stories. */}
            {!isLoadingLoggedUser && loggedUser && (
            <a className="text-white cursor-pointer text-slate-200 hover:text-white"
                onClick={() => navigate(RoutePaths.STORY)}>
                  Write Stories
              </a>
            )}
            <div>
              {/* When no user is logged on, display buttons to log in or sign up. */}
              {!isLoadingLoggedUser && !loggedUser && (
                <>
                <button
                  className="font-bold text-white"
                  onClick={() => navigate(RoutePaths.SIGNIN)}
                >
                  Sign In
                </button>
                <div/> 
                <button
                className="font-bold text-white"
                onClick={() => navigate(RoutePaths.SIGNUP)}
              >
                Sign Up
              </button>
              </>
            )}
            {/* When user is logged in, display user name and button to log out. */}
              {!isLoadingLoggedUser && loggedUser && (
              <>
              <div className="text-white">
                {loggedUser.username}
              </div>
              <button
                  className="font-bold text-white"
                  onClick={() => {
                    Meteor.logout();
                    navigate(RoutePaths.HOME);
                  }}
                >
                  Log Out
                </button>
              </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
