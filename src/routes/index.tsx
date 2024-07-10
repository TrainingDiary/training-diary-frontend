import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Home from './Home';
import Login from './Login';
import Signup from './Signup';
import Layout from './Layout';
import Appointment from './Appointment/Appointment';

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
