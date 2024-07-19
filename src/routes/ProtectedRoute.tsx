import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { user } from 'src/stores/userStore';

const ProtectedRoute: React.FC = () => {
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
