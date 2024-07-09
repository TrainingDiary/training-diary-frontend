import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import styled from 'styled-components';
import homeIcon from '@icons/home.svg';
import activeHomeIcon from '@icons/activeHome.svg';
import appointmentIcon from '@icons/appointment.svg';
import activeAppointmentIcon from '@icons/activeAppointment.svg';
import logOutIcon from '@icons/logout.svg';

// 하단에 고정된 네비게이션 바 스타일 정의
const Nav = styled.nav`
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 30px;
  padding: 5px 0;
  background-color: ${(props) => props.theme.colors.white};
  box-shadow: 0 -2px 20px rgba(0, 0, 0, 0.1);
  justify-content: space-between;
  border-radius: 20px 20px 0 0;
`;

// 네비게이션 링크 스타일 정의
const NavItem = styled.div<{ $isActive?: boolean }>`
  color: ${({ theme }) => theme.colors.white};
  font-size: 1.6rem;
  text-decoration: none;

  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  transition: background-color 0.3s;

  a {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 1rem;
    width: 100%;
    text-decoration: none;
    color: ${({ $isActive, theme }) => ($isActive ? theme.colors.main700 : theme.colors.gray500)};
    span {
      background-color: ${({ $isActive, theme }) =>
        $isActive ? theme.colors.main100 : 'transparent'};
      border-radius: 5px;
      padding: 8px;
      border-radius: 5px;
      line-height: 1;
    }
  }
`;

const LogOutNav = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1rem;
  width: 100%;
  text-decoration: none;
  color: ${(props) => props.theme.colors.gray500};
  span {
    border-radius: 5px;
    padding: 8px;
    border-radius: 5px;
    line-height: 1;
  }
`;

const HomeBtn = styled.img``;
const AppointmentIconBtn = styled.img``;
const LogOutBtn = styled.img``;

const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(true); // 로그인 상태 관리

  const handleLogout = () => {
    // TODO : 로그아웃 로직 구현
    setIsLoggedIn(false);
    navigate('login');
  };

  return (
    <>
      <Nav>
        <NavItem $isActive={location.pathname === '/'}>
          <Link to={''}>
            <span>
              <HomeBtn
                src={location.pathname === '/' ? activeHomeIcon : homeIcon}
                alt="home link button"
              />
            </span>
            Home
          </Link>
        </NavItem>
        <NavItem $isActive={location.pathname === '/appointment'}>
          <Link to={'appointment'}>
            <span>
              <AppointmentIconBtn
                src={location.pathname === '/appointment' ? activeAppointmentIcon : appointmentIcon}
                alt="appointment link button"
              />
            </span>
            Appointment
          </Link>
        </NavItem>
        <NavItem>
          {isLoggedIn && (
            <LogOutNav onClick={handleLogout}>
              <span>
                <LogOutBtn src={logOutIcon} alt="logout button" />
              </span>
              Logout
            </LogOutNav>
          )}
        </NavItem>
      </Nav>
    </>
  );
};

export default Navigation;
