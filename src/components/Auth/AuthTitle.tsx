import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.main700};
  font-size: 3.2rem;
`;

const SubTitle = styled.h2`
  color: ${({ theme }) => theme.colors.gray900};
  font-size: 2rem;
`;

interface AuthTitleProps {
  title: string;
  subtitle: string;
}

const AuthTitle: React.FC<AuthTitleProps> = ({ title, subtitle }) => {
  return (
    <Wrapper>
      <Title>{title}</Title>
      <SubTitle>{subtitle}</SubTitle>
    </Wrapper>
  );
};

export default AuthTitle;
