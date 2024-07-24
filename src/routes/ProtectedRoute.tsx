import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import useUserStore from 'src/stores/userStore';

const ProtectedRoute: React.FC = () => {
  const location = useLocation();
  const user = useUserStore(state => state.user);

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
