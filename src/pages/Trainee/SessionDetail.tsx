import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';

import { SectionWrapper } from '@components/Common/SectionWrapper';
import {
  sessionDetails,
  SessionDetailType,
} from 'src/mocks/data/workoutSessionList';
import { hexToRgba } from 'src/utils/hexToRgba';

const DetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid ${({ theme }) => theme.colors.gray300};
  padding-bottom: 10px;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  font-family: 'NanumSquareBold';
  color: ${({ theme }) => theme.colors.gray900};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: ${({ theme }) => theme.colors.main500};
  color: ${({ theme }) => theme.colors.white};
  &:hover {
    background-color: ${({ theme }) => theme.colors.main600};
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Label = styled.label`
  font-size: 1.6rem;
  color: ${({ theme }) => theme.colors.gray900};
  font-family: 'NanumSquareBold';
`;

const NoteWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  border: solid 1px #ccc;
  border-radius: 5px;
  background: #fff;
  box-shadow: 0 4px 4px ${({ theme }) => hexToRgba(theme.colors.gray900, 0.2)};
`;

const NoteHead = styled.div`
  display: flex;
  font-size: 1.3rem;
  gap: 10px;
  padding-bottom: 5px;
  border-bottom: solid 2px ${({ theme }) => theme.colors.main500};
`;

const NoteBody = styled.div`
  display: flex;
  flex-wrap: wrap;
  font-size: 1.2rem;
  gap: 10px;
`;

const TextArea = styled.textarea`
  padding: 10px;
  font-size: 1.4rem;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: 5px;
  outline: none;
  width: 100%;
  font-family:
    'NanumSquare',
    'NotoSans KR',
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    Oxygen,
    Ubuntu,
    Cantarell,
    'Open Sans',
    'Helvetica Neue',
    sans-serif;
  resize: none;
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: 0 4px 4px ${({ theme }) => hexToRgba(theme.colors.gray900, 0.2)};
`;

const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ImageUploadGroup = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const ImagePreview = styled.div`
  width: 100px;
  height: 100px;
  background-color: ${({ theme }) => theme.colors.gray200};
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const SessionDetail: React.FC = () => {
  const { traineeId, sessionId } = useParams<{
    traineeId: string;
    sessionId: string;
  }>();
  const [sessionData, setSessionData] = useState<SessionDetailType | null>(
    null
  );

  useEffect(() => {
    // const fetchSessionData = async () => {
    //   try {
    //     const response = await axios.get(
    //       `/api/trainee/${traineeId}/session/${sessionId}`
    //     );
    //     setSessionData(response.data);
    //   } catch (error) {
    //     console.error('Failed to fetch session data', error);
    //   }
    // };

    // fetchSessionData();

    // 테스트 데이터 연동
    if (sessionId === undefined) return;
    setSessionData(sessionDetails[+sessionId - 1]);
  }, [traineeId, sessionId]);

  if (!sessionData) {
    return <div>Loading...</div>;
  }

  return (
    <SectionWrapper>
      <DetailWrapper>
        <Header>
          <Title>
            {sessionData.sessionDate} / {sessionData.sessionNumber}회차
          </Title>
          <ButtonGroup>
            <Button>Edit</Button>
            <Button>Delete</Button>
          </ButtonGroup>
        </Header>
        <Section>
          <Label>특이사항</Label>
          <TextArea value={sessionData.specialNote} readOnly />
        </Section>
        <Section>
          <Label>운동 종류 기록</Label>
          {sessionData.workouts.map((workout, index) => (
            <NoteWrap key={index}>
              <NoteHead>
                <p>운동명: {workout.workoutTypeName}</p>
                <p>/</p>
                <p>대상 근육: {workout.targetMuscle}</p>
              </NoteHead>
              <NoteBody>
                {workout.weight > 0 && <p>무게: {workout.weight}kg</p>}
                {workout.rep > 0 && <p>반복: {workout.rep}회</p>}
                {workout.sets > 0 && <p>세트: {workout.sets}세트</p>}
                {workout.time > 0 && <p>시간: {workout.time}초</p>}
                {workout.speed > 0 && <p>속도: {workout.speed}m/s</p>}
              </NoteBody>
            </NoteWrap>
          ))}
        </Section>
        <Section>
          <Label>자세 사진</Label>
          <ImageContainer>
            {sessionData.photoUrls.map((photo, index) => (
              <ImagePreview key={index}>
                <img src={photo} alt={`자세 사진 ${index}`} />
              </ImagePreview>
            ))}
            <Button>업로드</Button>
          </ImageContainer>
        </Section>
        <Section>
          <Label>운동 영상</Label>
          <ImageContainer>
            {sessionData.videoUrls.map((video, index) => (
              <video key={index} controls>
                <source src={video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ))}
            <Button>업로드</Button>
          </ImageContainer>
        </Section>
      </DetailWrapper>
    </SectionWrapper>
  );
};

export default SessionDetail;
