import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import homeIcon from '@icons/home.svg';
import appointmentIcon from '@icons/appointment.svg';
import logOutIcon from '@icons/logout.svg';
import { hexToRgba } from 'src/utils/hexToRgba';

const DrawerWrapper = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 0;
  right: 0;
  width: 300px;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: -2px 0 5px ${({ theme }) => hexToRgba(theme.colors.black, 0.2)};
  transform: ${({ $isOpen }) => ($isOpen ? 'translateX(0)' : 'translateX(120%)')};
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  padding: 20px;
  z-index: 1000;
`;

const DrawerItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 10px 0;
  color: ${({ theme }) => theme.colors.gray900};
  text-decoration: none;
  img {
    margin-right: 10px;
  }
`;

const DrawerItemDiv = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 0;
  color: ${({ theme }) => theme.colors.gray900};
  text-decoration: none;
  cursor: pointer;
  img {
    margin-right: 10px;
  }
`;

interface DrawerProps {
  $isOpen: boolean;
  onClose: () => void;
  onLogout: () => void; // 추가: 로그아웃을 처리하는 함수
}

const Drawer: React.FC<DrawerProps> = ({ $isOpen, onClose, onLogout }) => {
  return (
    <DrawerWrapper $isOpen={$isOpen}>
      <DrawerItem to="/" onClick={onClose}>
        <img src={homeIcon} alt="Home" />
        Home
      </DrawerItem>
      <DrawerItem to="/appointment" onClick={onClose}>
        <img src={appointmentIcon} alt="Appointment" />
        Appointment
      </DrawerItem>
      <DrawerItemDiv
        onClick={() => {
          onClose();
          onLogout();
        }}
      >
        <img src={logOutIcon} alt="Logout" />
        Logout
      </DrawerItemDiv>
    </DrawerWrapper>
  );
};

export default Drawer;
