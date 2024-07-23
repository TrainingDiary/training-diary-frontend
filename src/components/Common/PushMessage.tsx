import React from 'react';
import styled from 'styled-components';
import { NotificationPayload } from 'firebase/messaging';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const ImageContainer = styled.div`
  display: flex;
  align-items: center;
  width: 20px;
  height: 30px;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const NotificationHeader = styled.div`
  align-items: center;
  font-size: 1.6rem;
  color: ${({ theme }) => theme.colors.main900};
`;

const NotificationBody = styled.div`
  font-size: 1.4rem;
  color: ${({ theme }) => theme.colors.gray900};
`;

interface PushMessageProps {
  notification: NotificationPayload;
}

const PushMessage: React.FC<PushMessageProps> = ({ notification }) => {
  return (
    <Container>
      <Wrapper>
        {notification.image && (
          <ImageContainer>
            <img src={notification.image} alt="Notification" />
          </ImageContainer>
        )}
        <NotificationHeader>{notification.title}</NotificationHeader>
      </Wrapper>
      <NotificationBody>{notification.body}</NotificationBody>
    </Container>
  );
};

export default PushMessage;
