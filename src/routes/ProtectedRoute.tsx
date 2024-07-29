import React from 'react';
import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom';

import useUserStore from 'src/stores/userStore';

const ProtectedRoute: React.FC = () => {
  const location = useLocation();
  const { user } = useUserStore();
  const { traineeId } = useParams<{ traineeId: string }>();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  if (traineeId && isNaN(Number(traineeId))) {
    return <Navigate to="/not-found" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
