import React from 'react';
import styled from 'styled-components';
import bgImg from '../assets/images/notPage.png'; // 이미지 파일 경로

const NotFoundWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
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
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  h1 {
    font-size: 4rem;
  }

  h2 {
    font-size: 2rem;
  }

  p {
    font-size: 2rem;
  }

  button {
    font-size: 1.2rem;
    color: ${({ theme }) => theme.colors.main900};
    background: white;
    border: 1px solid ${({ theme }) => theme.colors.main900};
    border-radius: 5px;
    padding: 10px 20px;
    cursor: pointer;
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
          <p>Oooops! Page Not Found</p>
        </div>
        <button onClick={() => (window.location.href = '/')}>Go Home</button>
      </Wrapper>
    </NotFoundWrapper>
  );
};

export default NotFound;
