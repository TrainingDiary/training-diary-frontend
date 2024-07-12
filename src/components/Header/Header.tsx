import React, { useState } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';

import backIcon from '@icons/header/backIcon.svg';
import bellIcon from '@icons/header/bell.svg';
import hamBtnIcon from '@icons/header/hamBtn.svg';
import Drawer from './Drawer';

const HeaderWrapper = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  text-align: center;

  position: relative;

  padding: 20px;

  h1 {
    font-size: 2.4rem;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    margin: 0;
    line-height: 1;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
`;
const Icon = styled.div`
  cursor: pointer;
`;

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen);
  };

  const handleBackClick = () => {
    if (location.pathname !== '/') {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handleLogout = () => {
    // 로그아웃 처리 로직
    console.log('Logged out');
  };

  return (
    <React.Fragment>
      <HeaderWrapper>
        <IconWrapper>
          <Icon onClick={handleBackClick}>
            {location.pathname !== '/' &&
              location.pathname !== '/appointment' && (
                <img src={backIcon} alt="Back" />
              )}
          </Icon>
        </IconWrapper>
        <h1>트.다</h1>
        <IconWrapper>
          <Icon>
            <img src={bellIcon} alt="Bell" />
          </Icon>
          <Icon onClick={toggleDrawer}>
            <img src={hamBtnIcon} alt="Menu" />
          </Icon>
        </IconWrapper>
      </HeaderWrapper>
      <Drawer
        $isOpen={isDrawerOpen}
        onClose={toggleDrawer}
        onLogout={handleLogout}
      />
    </React.Fragment>
  );
};

export default Header;
