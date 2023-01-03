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
              <a
                className="cursor-pointer"
                onClick={() => navigate(RoutePaths.HOME)}
              >
                <span className="sr-only">Chrysalis Connection</span>
                <img className="h-10 w-auto" src="/images/logo.png" alt="" />
              </a>
            </div>
            <p className="text-white"
                onClick={() => navigate(RoutePaths.STORY)}>
                  Stories
              </p>
            <div>
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
              {!isLoadingLoggedUser && loggedUser && (
              <>
              <div className="text-white">
                {loggedUser.username}
              </div>
              <button
                  className="font-bold text-white"
                  onClick={() => Meteor.logout()}
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
