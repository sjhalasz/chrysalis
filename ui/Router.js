import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Transact } from './Transact';
import { Story } from './Story';
import { NotFound } from './NotFound';
import { SignIn } from './SignIn';
import { SignUp } from './SignUp';
import { RoutePaths } from './RoutePaths';
import { ForgotPassword } from './ForgotPassword';
import { ResetPassword } from './ResetPassword';
import { LoggedUserOnly } from './components/LoggedUserOnly';
import { AnonymousOnly } from './components/AnonymousOnly';
import { RemoveTransaction } from './RemoveTransaction';
import { AdminOnly } from './components/AdminOnly';
import { Home } from './Home';
import { PublisherOnly} from './components/PublisherOnly';

export const Router = () => (
  <Routes>
 <Route
      path={RoutePaths.HOME}
      element={
          <Home />
      }
    />
 <Route
      path={RoutePaths.TRANSACT}
      element={
        <LoggedUserOnly>
          <Transact />
        </LoggedUserOnly>
      }
    />
 <Route
      path={RoutePaths.STORY}
      element={
        <PublisherOnly>
          <Story />
        </PublisherOnly>
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
      path={RoutePaths.FORGOT_PASSWORD}
      element={
        <AnonymousOnly>
          <ForgotPassword />
        </AnonymousOnly>
      }
    />
    <Route
      path={`${RoutePaths.RESET_PASSWORD}/:token`}
      element={
        <AnonymousOnly>
          <ResetPassword />
        </AnonymousOnly>
      }
    />
    <Route
      path={RoutePaths.REMOVE_TRANSACTION}
      element={
        <AdminOnly>
          <RemoveTransaction />
        </AdminOnly>
      }
    />
    <Route path="*" element={<NotFound />} />
  </Routes>
);
