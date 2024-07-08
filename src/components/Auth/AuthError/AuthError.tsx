import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { fadeInStyles, fadeOutStyles } from 'src/styles/animations/fadeInOut';
import errorIcon from '@icons/error.svg';

interface WrapperProps {
  $isFadingIn: boolean;
}

const Wrapper = styled.div<WrapperProps>`
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

  ${({ $isFadingIn }) => ($isFadingIn ? fadeInStyles : fadeOutStyles)};
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

interface AuthErrorProps {
  text: string;
  onClose: () => void;
}

const AuthError: React.FC<AuthErrorProps> = ({ text, onClose }) => {
  const [isFadingIn, setIsFadingIn] = useState(true);

  useEffect(() => {
    if (isFadingIn) {
      const timer = setTimeout(() => setIsFadingIn(false), 2000);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => onClose(), 500);
      return () => clearTimeout(timer);
    }
  }, [isFadingIn, text]);

  return (
    <Wrapper $isFadingIn={isFadingIn}>
      <Icon src={errorIcon} alt="error icon" />
      <Text>{text}</Text>
    </Wrapper>
  );
};

export default AuthError;
