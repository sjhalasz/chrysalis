import { Meteor } from 'meteor/meteor';
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loading } from './Loading';
import { RoutePaths } from '../RoutePaths';
import { useLoggedUser } from 'meteor/quave:logged-user-react';
 
export const PublisherOnly = ({ children }) => {
  const [isPublisher, setIsPublisher] = useState();
  const location = useLocation();
  const { loggedUser, isLoadingLoggedUser } = useLoggedUser();
  
  useEffect(() => {
     Meteor.call('roles.isPublisher', (error, isPublisherReturn) => {
      if (error) {
        setIsPublisher(false);
        return;
      }
      setIsPublisher(isPublisherReturn);
    });
  }, []);

  if (isPublisher == null) {
    return <Loading />;
  }

  if (!loggedUser || !isPublisher) {
    return <Navigate to={RoutePaths.HOME} state={{ from: location }} replace />;
  }

  return children;
};
