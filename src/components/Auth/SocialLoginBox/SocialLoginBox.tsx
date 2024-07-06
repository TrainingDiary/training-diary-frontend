import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import googleIcon from '@icons/google.svg';
import naverIcon from '@icons/naver.svg';
import kakaoIcon from '@icons/kakao.svg';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 148px;
  height: 72px;
`;

const Text = styled.span`
  text-align: center;
  color: ${({ theme }) => theme.colors.gray900};
  font-size: 1.2rem;
  font-family: 'NanumSquareExtraBold';
`;

const IconBox = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;

  a {
    font-size: 0;
  }
`;

const SocialLoginBox: React.FC = () => {
  return (
    <Wrapper>
      <Text>OR SIGN IN WITH</Text>
      <IconBox>
        <Link to={'/'}>
          <img src={googleIcon} alt="google" />
        </Link>

        <Link to={'/'}>
          <img src={naverIcon} alt="naver" />
        </Link>

        <Link to={'/'}>
          <img src={kakaoIcon} alt="kakao" />
        </Link>
      </IconBox>
    </Wrapper>
  );
};

export default SocialLoginBox;
