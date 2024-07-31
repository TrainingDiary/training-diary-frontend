import React from 'react';
import styled from 'styled-components';
import bgImg from '../assets/images/notPage.png'; // 이미지 파일 경로

const NotFoundWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  height: 100dvh;
  max-width: 450px;
  text-align: center;
  background-color: ${({ theme }) => theme.colors.gray100};
  background-image: url(${bgImg});
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  color: ${({ theme }) => theme.colors.white};
  padding: 0 30px 50px;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 50px;
  width: 100%;
  .title {
    width: 50%;
    margin: 0 auto;

    h1 {
      font-size: 4rem;
      border-bottom: solid 2px ${({ theme }) => theme.colors.white};
    }

    h2 {
      font-size: 4rem;
      font-weight: bold;
    }
  }

  p {
    font-size: 3rem;
    font-family: 'NanumSquareBold';
    text-align: center;
    text-decoration: underline;
    padding-left: 60px;

    strong {
      font-size: 5rem;
      font-family: 'NanumSquareExtraBold';
    }
  }

  button {
    width: 100%;
    font-size: 3rem;
    color: ${({ theme }) => theme.colors.main900};
    background: ${({ theme }) => theme.colors.white};
    border: 2px solid ${({ theme }) => theme.colors.main900};
    border-radius: 10px;
    padding: 10px 20px;
    cursor: pointer;
    margin-top: 20px;
    font-family: 'NanumSquareExtraBold';
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
        <div>
          <p>
            <strong>O</strong>ooops!
            <br /> Page Not Found
          </p>
        </div>
        <button onClick={() => (window.location.href = '/')}>Go Home</button>
      </Wrapper>
    </NotFoundWrapper>
  );
};

export default NotFound;
