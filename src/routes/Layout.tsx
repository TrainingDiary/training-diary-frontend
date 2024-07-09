import React from 'react';

import Header from '@components/Header/Header';
import Navigation from '@components/Navigation/Navigation';
import { Outlet } from 'react-router-dom';

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
