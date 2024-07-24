import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import useUserStore from 'src/stores/userStore';

const PublicRoute: React.FC = () => {
  const user = useUserStore(state => state.user);

  if (user) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default PublicRoute;
