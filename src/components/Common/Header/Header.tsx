import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import backIcon from '@icons/header/backIcon.svg';
import bellIcon from '@icons/header/bell.svg';
import hamBtnIcon from '@icons/header/hamBtn.svg';
import Drawer from './Drawer';
import { hexToRgba } from 'src/utils/hexToRgba';
import { user } from 'src/stores/userStore';

const HeaderWrapper = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  text-align: center;

  position: relative;

  padding: 20px;
  line-height: 1;

  a {
    display: block;
    font-size: 2.4rem;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    margin: 0;
    text-decoration: none;
    color: ${({ theme }) => theme.colors.gray900};
  }

  h1 {
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Icon = styled.div`
  cursor: pointer;
  padding: 10px 13px;
`;

const BackIcon = styled.div`
  cursor: pointer;
  & > img {
    padding: 10px 13px;
    box-shadow: 0 0 10px ${({ theme }) => hexToRgba(theme.colors.gray900, 0.2)};
    border-radius: 10px;
  }
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

  const shouldHideBackButton = () => {
    if (user?.role === 'TRAINER' && location.pathname === '/trainer/trainees') {
      return true;
    }

    if (
      user?.role === 'TRAINEE' &&
      location.pathname === `/trainee/${user.id}/dashboard`
    ) {
      return true;
    }

    return false;
  };

  return (
    <React.Fragment>
      <HeaderWrapper>
        <IconWrapper>
          {!shouldHideBackButton() && (
            <BackIcon onClick={handleBackClick}>
              <img src={backIcon} alt="Back" />
            </BackIcon>
          )}
        </IconWrapper>
        <Link to={'/'}>
          <h1>트.다</h1>
        </Link>
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
