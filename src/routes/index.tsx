// 라우트 설정 파일
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Home from './Home/Home';
import Login from './Login/Login';
import Layout from './Layout';
import Appointment from './Appointment';

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
]);

const AppRoutes: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
