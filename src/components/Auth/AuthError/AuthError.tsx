import React from 'react';
import styled from 'styled-components';

import errorIcon from '@icons/error.svg';
import closeIcon from '@icons/close.svg';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 20px;
  width: calc(100% - 40px);
  border: none;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.red500};
  position: absolute;
  bottom: 100px;
  left: 20px;
  z-index: 9999;
`;

const Icon = styled.img`
  margin-right: 8px;
`;

const Text = styled.span`
  flex-grow: 1;
  color: ${({ theme }) => theme.colors.white};
  font-size: 1.6rem;
  font-family: 'NanumSquareBold';
`;

const CloseButton = styled.img`
  cursor: pointer;
`;

interface AuthErrorProps {
  text: string;
  onClose: () => void;
}

const AuthError: React.FC<AuthErrorProps> = ({ text, onClose }) => {
  return (
    <Wrapper>
      <Icon src={errorIcon} alt="error icon" />
      <Text>{text}</Text>
      <CloseButton src={closeIcon} alt="close button" onClick={onClose} />
    </Wrapper>
  );
};

export default AuthError;
