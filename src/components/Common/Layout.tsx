import React from 'react';
import { Outlet } from 'react-router-dom';

import Header from '@components/Common/Header/Header';
import Navigation from '@components/Common/Navigation/Navigation';

const Layout: React.FC = () => {
  return (
    <React.Fragment>
      <Header />
      <Navigation />
      <Outlet />
    </React.Fragment>
  );
};

export default Layout;
