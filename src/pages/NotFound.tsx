import React from 'react';
import styled from 'styled-components';

// 404 페이지 디자인 후 전체 수정 필요
const NotFoundWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
`;

const NotFound: React.FC = () => {
  return (
    <NotFoundWrapper>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </NotFoundWrapper>
  );
};

export default NotFound;
