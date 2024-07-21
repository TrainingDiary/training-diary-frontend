import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import homeIcon from '@icons/navigation/home.svg';
import activeHomeIcon from '@icons/navigation/activeHome.svg';
import appointmentIcon from '@icons/navigation/appointment.svg';
import activeAppointmentIcon from '@icons/navigation/activeAppointment.svg';
import logOutIcon from '@icons/navigation/logout.svg';
import { hexToRgba } from 'src/utils/hexToRgba';

// 하단에 고정된 네비게이션 바 스타일 정의
const Nav = styled.nav`
  position: fixed;
  bottom: 0;
  width: 100%;
  max-width: 450px;
  display: flex;
  align-items: center;
  gap: 30px;
  padding: 5px 0;
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: 0 -2px 20px ${({ theme }) => hexToRgba(theme.colors.black, 0.1)};
  justify-content: space-between;
  border-radius: 20px 20px 0 0;
  z-index: 1000;
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
    color: ${({ $isActive, theme }) =>
      $isActive ? theme.colors.main700 : theme.colors.gray500};
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
  color: ${({ theme }) => theme.colors.gray500};
  cursor: pointer;
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

  const handleLogout = () => {
    // TODO : 로그아웃 로직 구현
    // 현재 publicRoute 때문에 동작하지 않음
    console.log('Logged out');
  };

  const isHomeActive = !location.pathname.startsWith('/appointment');
  const isAppointmentActive = location.pathname.startsWith('/appointment');

  return (
    <React.Fragment>
      <Nav>
        <NavItem $isActive={isHomeActive}>
          <Link to={''}>
            <span>
              <HomeBtn
                src={isHomeActive ? activeHomeIcon : homeIcon}
                alt="home link button"
              />
            </span>
            Home
          </Link>
        </NavItem>
        <NavItem $isActive={isAppointmentActive}>
          <Link to={'appointment/monthly'}>
            <span>
              <AppointmentIconBtn
                src={
                  isAppointmentActive ? activeAppointmentIcon : appointmentIcon
                }
                alt="appointment link button"
              />
            </span>
            Appointment
          </Link>
        </NavItem>
        <NavItem>
          {
            <LogOutNav onClick={handleLogout}>
              <span>
                <LogOutBtn src={logOutIcon} alt="logout button" />
              </span>
              Logout
            </LogOutNav>
          }
        </NavItem>
      </Nav>
    </React.Fragment>
  );
};

export default Navigation;
