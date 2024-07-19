import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import ProtectedRoute from './ProtectedRoute';
import HomeRedirect from './HomeRedirect';
import PublicRoute from './PublicRoute';
import Layout from '@components/Layout';
import Login from '@pages/Login/Login';
import Signup from '@pages/Signup/Signup';
import TrainerHome from '@pages/Trainer/TrainerHome';

const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          {
            path: '/',
            element: <HomeRedirect />,
          },
          {
            path: 'trainer/*',
            element: <TrainerHome />,
          },
          // {
          //   path: 'trainee/:traineeId/*',
          //   element: <TraineeHome />,
          // },
          // {
          //   path: 'appointment/*',
          //   element: <AppointmentHome />,
          // },
        ],
      },
    ],
  },
  {
    path: '/login',
    element: <PublicRoute />,
    children: [
      {
        path: '/login',
        element: <Login />,
      },
    ],
  },
  {
    path: '/signup',
    element: <PublicRoute />,
    children: [
      {
        path: '/signup',
        element: <Signup />,
      },
    ],
  },
]);

const AppRoutes: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
