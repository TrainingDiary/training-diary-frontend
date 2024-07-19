import React from 'react';
import { Navigate } from 'react-router-dom';
import { user } from 'src/stores/userStore';

const HomeRedirect: React.FC = () => {
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role === 'TRAINER') {
    return <Navigate to="/trainer/trainees" />;
  } else if (user.role === 'TRAINEE') {
    return <Navigate to={`/trainee/${user.id}`} />;
  } else {
    return <Navigate to="/login" />;
  }
};

export default HomeRedirect;
