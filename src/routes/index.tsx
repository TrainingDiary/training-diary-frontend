import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';

import ProtectedRoute from './ProtectedRoute';
import HomeRedirect from './HomeRedirect';
import PublicRoute from './PublicRoute';
import Layout from '@components/Layout';
import Login from '@pages/Login/Login';
import Signup from '@pages/Signup/Signup';
import TrainerHome from '@pages/Trainer/TrainerHome';
import TraineeManagement from '@pages/Trainer/TraineeManagement';
import WorkOutManagement from '@pages/Trainer/WorkOutManagement';
import TraineeHome from '@pages/Trainee/TraineeHome';
import Dashboard from '@pages/Trainee/Dashboard';
import Session from '@pages/Trainee/Session';
import Diet from '@pages/Trainee/Diet';
import NotFound from '@pages/NotFound';

const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          {
            index: true,
            element: <HomeRedirect />,
          },
          {
            path: 'trainer',
            element: <TrainerHome />,
            children: [
              {
                index: true,
                element: <Navigate to="trainees" />,
              },
              {
                path: 'trainees',
                element: <TraineeManagement />,
              },
              {
                path: 'workouts',
                element: <WorkOutManagement />,
              },
            ],
          },
          {
            path: 'trainee/:traineeId',
            element: <TraineeHome />,
            children: [
              {
                index: true,
                element: <Navigate to="dashboard" />,
              },
              {
                path: 'dashboard',
                element: <Dashboard />,
              },
              {
                path: 'session',
                element: <Session />,
              },
              {
                path: 'diet',
                element: <Diet />,
              },
            ],
          },
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
  {
    path: '/not-found',
    element: <NotFound />,
  },
  {
    path: '*',
    element: <Navigate to="/not-found" replace />,
  },
]);

const AppRoutes: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
