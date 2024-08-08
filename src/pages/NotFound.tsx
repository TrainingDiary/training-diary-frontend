import React from 'react';
import styled from 'styled-components';

import logo from '../assets/images/main-logo.png'; // 이미지 파일 경로
import { hexToRgba } from 'src/utils/hexToRgba';

const NotFoundWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  height: 100dvh;
  max-width: 450px;
  text-align: center;

  background-color: ${({ theme }) => theme.colors.main100};
  color: ${({ theme }) => theme.colors.white};
  position: relative;

  &::before {
    content: '';
    display: block;
    position: absolute;
    width: 100%;
    height: 95%;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    background-color: ${({ theme }) => theme.colors.main200};
    z-index: 0;
    border-radius: 50%;
  }

  &::after {
    content: '';
    display: block;
    position: absolute;
    width: 85%;
    height: 85%;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: ${({ theme }) => theme.colors.main300};
    z-index: 1;
    border-radius: 50%;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  align-items: center;
  z-index: 3;

  &::after {
    content: '';
    display: block;
    position: absolute;
    width: 70%;
    height: 75%;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: ${({ theme }) => theme.colors.main400};
    z-index: -1;
    border-radius: 50%;
  }

  .title {
    margin: 0 auto;

    h1 {
      font-size: 12rem;
      line-height: 1;
      border-bottom: solid 2px ${({ theme }) => theme.colors.white};
    }

    h2 {
      font-size: 4rem;
      font-weight: bold;
    }
  }

  .contents {
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    padding-top: 5px;
    border-top: dashed 2px ${({ theme }) => theme.colors.white};
    border-bottom: dashed 2px ${({ theme }) => theme.colors.white};

    .logo_box {
      max-width: 150px;

      img {
        display: block;
        width: 100%;
        opacity: 0.5;
      }
    }

    .message {
      font-size: 3rem;
      font-family: 'NanumSquareBold';
      text-align: center;
      line-height: 1;
      display: flex;
      flex-direction: column;
      gap: 10px;
      text-shadow: 0 2px 4px
        ${({ theme }) => hexToRgba(theme.colors.black, 0.35)};

      .top {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
      }

      strong {
        font-size: 5rem;
        font-family: 'NanumSquareExtraBold';
        line-height: 1.2;
      }
    }
  }

  button {
    width: 100%;
    max-width: 280px;
    font-size: 3rem;
    color: ${({ theme }) => theme.colors.main600};
    background: ${({ theme }) => theme.colors.white};
    border: none;
    border-radius: 10px;
    padding: 10px 20px;
    cursor: pointer;
    margin-top: 20px;
    font-family: 'NanumSquareExtraBold';
    box-shadow: 0 4px 8px ${({ theme }) => hexToRgba(theme.colors.black, 0.35)};
  }
`;

const NotFound: React.FC = () => {
  return (
    <NotFoundWrapper>
      <Wrapper>
        <div className="title">
          <h1>404</h1>
          <h2>Error</h2>
        </div>
        <div className="contents">
          <p className="logo_box">
            <img src={logo} alt="logo" />
          </p>
          <div className="message">
            <div className="top">
              <strong>O</strong>
              <p>ooops!</p>
            </div>
            <p>Page Not Found</p>
          </div>
        </div>
        <button onClick={() => (window.location.href = '/')}>Go Home</button>
      </Wrapper>
    </NotFoundWrapper>
  );
};

export default NotFound;
