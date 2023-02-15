import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Story } from './Story';
import { NotFound } from './NotFound';
import { SignIn } from './SignIn';
import { SignUp } from './SignUp';
import { RoutePaths } from './RoutePaths';
import { ForgotPassword } from './ForgotPassword';
import { ResetPassword } from './ResetPassword';
import { LoggedUserOnly } from './components/LoggedUserOnly';
import { AnonymousOnly } from './components/AnonymousOnly';
import { AdminOnly } from './components/AdminOnly';
import { Home } from './Home';

export const Router = () => (
  <Routes>
 <Route
      path={RoutePaths.HOME}
      element={
          <Home />
      }
    />
 <Route
      path={RoutePaths.STORY}
      element={
        <LoggedUserOnly>
          <Story />
        </LoggedUserOnly>
      }
    />
    <Route
      path={RoutePaths.SIGNIN}
      element={
        <AnonymousOnly>
          <SignIn />
        </AnonymousOnly>
      }
    />
    <Route
      path={RoutePaths.SIGNUP}
      element={
        <AnonymousOnly>
          <SignUp />
        </AnonymousOnly>
      }
    />
    <Route path="*" element={<NotFound />} />
  </Routes>
);
