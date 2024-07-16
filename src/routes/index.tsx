import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Home from './Home';
import Login from './Login';
import Signup from './Signup';
import Layout from './Layout';
import Appointment from './Appointment/Appointment';
import TraineeInfo from './Trainee/TraineeInfo';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <Home />,
      },
      {
        path: 'appointment',
        element: <Appointment />,
      },
      {
        path: 'trainee/:id',
        element: <TraineeInfo />,
      },
    ],
  },
  {
    path: 'login',
    element: <Login />,
  },
  {
    path: 'signup',
    element: <Signup />,
  },
]);

const AppRoutes: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
