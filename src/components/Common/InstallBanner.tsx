import React, { useState } from 'react';
import styled from 'styled-components';

import closeIcon from '@icons/modal/closeBtn.svg';

const Wrapper = styled.div`
  display: none;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.blue500};
  color: ${({ theme }) => theme.colors.white};
  padding: 10px;
  width: 100%;
  max-width: 450px;
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1004;
`;

const Container = styled.div`
  display: flex;
  align-items: flex-start;
`;

const BannerContent = styled.div`
  display: flex;
  flex-direction: column;

  strong {
    font-size: 1.4rem;
    margin-bottom: 5px;
  }

  p {
    margin: 0;
    font-size: 1.2rem;
  }
`;

const InstallButton = styled.button`
  background-color: #ffffff;
  color: ${({ theme }) => theme.colors.blue500};
  border: none;
  padding: 10px 20px;
  font-size: 1.4rem;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  line-height: 1;
`;

const InstallBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  const handleCloseClick = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Wrapper id="installBanner">
      <Container>
        <CloseButton onClick={handleCloseClick}>
          <img src={closeIcon} alt="Close Icon" />
        </CloseButton>
        <BannerContent>
          <strong>🏋️‍♀️ 트다: Training Diary 🏋️‍♀️</strong>
          <p>
            트다는 앱에서 원활히 사용하실 수 있습니다.
            <br />
            설치하시겠습니까?
          </p>
        </BannerContent>
      </Container>
      <InstallButton id="installButton">Install</InstallButton>
    </Wrapper>
  );
};

export default InstallBanner;
