import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { user } from 'src/stores/userStore';

const PublicRoute: React.FC = () => {
  if (user) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default PublicRoute;
