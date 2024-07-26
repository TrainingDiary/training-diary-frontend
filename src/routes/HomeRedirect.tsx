import React from 'react';
import { Navigate } from 'react-router-dom';

import useUserStore from 'src/stores/userStore';

const HomeRedirect: React.FC = () => {
  const { user } = useUserStore();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role === 'TRAINER') {
    return <Navigate to="/trainer/trainees" />;
  } else if (user.role === 'TRAINEE') {
    return <Navigate to={`/trainee/${user.id}/dashboard`} />;
  } else {
    return <Navigate to="/login" />;
  }
};

export default HomeRedirect;
