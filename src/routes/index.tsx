// 라우트 설정 파일
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Home from './Home';
import Login from './Login';

const router = createBrowserRouter([
  {
    path: '/',
    children: [
      {
        path: '',
        element: <Home />,
      },
      {
        path: 'login',
        element: <Login />,
      },
    ],
  },
]);

const AppRoutes: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
