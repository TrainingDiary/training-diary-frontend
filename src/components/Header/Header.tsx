import React, { useState } from 'react';
import styled from 'styled-components';
import backIcon from '@icons/backIcon.svg';
import bellIcon from '@icons/bell.svg';
import hamBtnIcon from '@icons/hamBtn.svg';
import { useLocation } from 'react-router-dom';
import Drawer from './Drawer';

const HeaderWrapper = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  text-align: center;

  position: relative;

  margin: 20px auto;
  padding: 0 20px;

  h1 {
    font-size: 2.4rem;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    margin: 0;
    line-height: 1;
  }
`;

const Icon = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
`;

const Header: React.FC = () => {
  const location = useLocation();
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen);
  };

  return (
    <>
      <HeaderWrapper>
        <Icon>
          <img src={location.pathname === '' ? '' : backIcon} alt="Back" />
        </Icon>
        <h1>트.다</h1>
        <Icon>
          <img src={bellIcon} alt="Bell" />
          <img src={hamBtnIcon} alt="Menu" onClick={toggleDrawer} />
        </Icon>
      </HeaderWrapper>
      <Drawer $isOpen={isDrawerOpen} onClose={toggleDrawer} />
    </>
  );
};

export default Header;
