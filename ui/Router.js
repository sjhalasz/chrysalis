import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Story } from './Story';
import { NotFound } from './NotFound';
import { SignIn } from './SignIn';
import { SignUp } from './SignUp';
import { Admin } from './Admin';
import { RoutePaths } from './RoutePaths';
import { ForgotPassword } from './ForgotPassword';
import { ResetPassword } from './ResetPassword';
import { LoggedUserOnly } from './components/LoggedUserOnly';
import { AnonymousOnly } from './components/AnonymousOnly';
import { AdminOnly } from './components/AdminOnly';
import { Home } from './Home';
import { Stories } from './Stories';
import { Profile } from './Profile';
import { Shutdown } from './Shutdown';

export const Router = () => (
  <Routes>
 <Route
      path={RoutePaths.HOME}
      element={
          <Home />
      }
    />
 <Route
      path={RoutePaths.STORIES}
      element={
          <Stories />
      }
    />
 <Route
      path={RoutePaths.PROFILE}
      element={
          <Profile />
      }
    />
 <Route
      path={RoutePaths.SHUTDOWN}
      element={
          <Shutdown />
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
    <Route
      path={RoutePaths.ADMIN}
      element={
        <AdminOnly>
          <Admin />
        </AdminOnly>
      }
    />

    <Route path="*" element={<NotFound />} />
  </Routes>
);
