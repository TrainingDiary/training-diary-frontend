import React from 'react';
import styled from 'styled-components';

const Switcher = styled.span`
  font-size: 1.4rem;
  color: ${({ theme }) => theme.colors.gray900};
  a {
    font-family: 'NanumSquareExtraBold';
    text-decoration: none;

    &:visited {
      color: ${({ theme }) => theme.colors.gray900};
    }
  }
`;

interface AuthSwitcherProps {
  children: React.ReactNode;
}

const AuthSwitcher: React.FC<AuthSwitcherProps> = ({ children }) => {
  return <Switcher>{children}</Switcher>;
};

export default AuthSwitcher;
