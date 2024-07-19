import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import homeIcon from '@icons/navigation/home.svg';
import appointmentIcon from '@icons/navigation/appointment.svg';
import logOutIcon from '@icons/navigation/logout.svg';
import { hexToRgba } from 'src/utils/hexToRgba';

const DrawerWrapper = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 0;
  right: 0;
  width: 250px;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: -2px 0 8px ${({ theme }) => hexToRgba(theme.colors.black, 0.3)};
  transform: ${({ $isOpen }) =>
    $isOpen ? 'translateX(0)' : 'translateX(120%)'};
  transition: transform 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  padding: 20px;
  z-index: 1002;
`;

const DrawerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray300};
  margin-bottom: 20px;
`;

const DrawerTitle = styled.h2`
  font-size: 1.8rem;
  color: ${({ theme }) => theme.colors.main500};
  margin: 0;
  font-family: 'NanumSquareExtraBold';
`;

const DrawerCloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.6rem;
  color: ${({ theme }) => theme.colors.gray900};
  line-height: 1;
`;

const DrawerItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 15px 0;
  color: ${({ theme }) => theme.colors.gray900};
  text-decoration: none;
  font-size: 1.4rem;
  gap: 15px;
  border-bottom: solid 1px ${({ theme }) => theme.colors.gray200};
  &:hover {
    background-color: ${({ theme }) => hexToRgba(theme.colors.main500, 0.1)};
  }
  img {
    margin-right: 10px;
  }
`;

const DrawerItemDiv = styled.div`
  display: flex;
  align-items: center;
  padding: 15px 0;
  color: ${({ theme }) => theme.colors.gray900};
  text-decoration: none;
  font-size: 1.4rem;
  gap: 15px;
  cursor: pointer;
  border-bottom: solid 1px ${({ theme }) => theme.colors.gray200};
  &:hover {
    background-color: ${({ theme }) => hexToRgba(theme.colors.main500, 0.1)};
  }
  img {
    margin-right: 10px;
  }
`;

const DrawerBg = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 1001;
  background-color: ${({ theme }) => hexToRgba(theme.colors.gray900, 0.2)};
  transform: ${({ $isOpen }) =>
    $isOpen ? 'translateX(0)' : 'translateX(120%)'};
`;

interface DrawerProps {
  $isOpen: boolean;
  onClose: () => void;
  onLogout: () => void; // 추가: 로그아웃을 처리하는 함수
}

const Drawer: React.FC<DrawerProps> = ({ $isOpen, onClose, onLogout }) => {
  useEffect(() => {
    const $root = document.getElementById('root');
    if (!$root) return;
    if ($isOpen) {
      $root.style.overflow = 'hidden';
    } else {
      $root.style.overflow = 'unset';
      $root.style.overflowX = 'hidden';
    }
    return () => {
      $root.style.overflow = 'unset';
      $root.style.overflowX = 'hidden';
    };
  }, [$isOpen]);
  return (
    <React.Fragment>
      <DrawerWrapper $isOpen={$isOpen}>
        <DrawerHeader>
          <DrawerTitle>Menu</DrawerTitle>
          <DrawerCloseButton onClick={onClose}>✕</DrawerCloseButton>
        </DrawerHeader>
        <DrawerItem to="/" onClick={onClose}>
          <img src={homeIcon} alt="Home" />
          Home
        </DrawerItem>
        <DrawerItem to="/appointment/monthly" onClick={onClose}>
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
      <DrawerBg $isOpen={$isOpen} onClick={onClose} />
    </React.Fragment>
  );
};

export default Drawer;
