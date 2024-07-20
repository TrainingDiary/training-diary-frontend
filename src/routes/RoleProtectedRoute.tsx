import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { user } from 'src/stores/userStore';

const RoleProtectedRoute: React.FC = () => {
  const location = useLocation();

  if (user?.role !== 'TRAINER') {
    return <Navigate to="/not-found" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default RoleProtectedRoute;
