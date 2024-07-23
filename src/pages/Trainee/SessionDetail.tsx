import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { SectionWrapper } from '@components/Common/SectionWrapper';
import {
  sessionDetails,
  SessionDetailType,
} from 'src/mocks/data/workoutSessionList';
import { hexToRgba } from 'src/utils/hexToRgba';
import Button from '@components/Common/Button/Button';
import PhotoUploadModal from '@components/Trainee/PhotoUploadModal';
import VideoUploadModal from '@components/Trainee/VideoUploadModal';
import useModals from 'src/hooks/useModals';

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

  button {
    font-size: 1.4rem;
    line-height: 1;
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  button {
    font-size: 1.4rem;
    line-height: 1;
  }
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
  cursor: default;
`;

const ImageTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ImageContainer = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
`;

const ImagePreview = styled.div`
  max-width: 360px;
  width: 90%;
  height: 23vh;
  background-color: ${({ theme }) => theme.colors.gray200};
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 0 0 auto;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const VideoContainer = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
  width: 100%;
  height: 23vh;

  video {
    width: 90%;
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
  const { openModal, closeModal, isOpen } = useModals();

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

  const handlePhotoUpload = (photos: string[]) => {
    // 업로드된 사진 처리 로직 추가
    console.log('Uploaded Photos:', photos);
    closeModal('photoUpload');
  };

  const handleVideoUpload = (video: string) => {
    // 업로드된 비디오 처리 로직 추가
    console.log('Uploaded Video:', video);
    closeModal('videoUpload');
  };

  return (
    <SectionWrapper>
      <DetailWrapper>
        <Header>
          <Title>
            {sessionData.sessionDate} / {sessionData.sessionNumber}회차
          </Title>
          <ButtonGroup>
            <Button $size="small" type="button">
              Edit
            </Button>
            <Button $size="small" type="button">
              Delete
            </Button>
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
          <ImageTitle>
            <Label>자세 사진</Label>
            <Button
              $size="small"
              $variant="primary"
              onClick={() => openModal('photoUpload')}
            >
              업로드
            </Button>
          </ImageTitle>
          <ImageContainer>
            {sessionData.photoUrls.map((photo, index) => (
              <ImagePreview key={index}>
                <img src={photo} alt={`자세 사진 ${index}`} />
              </ImagePreview>
            ))}
          </ImageContainer>
        </Section>
        <Section>
          <ImageTitle>
            <Label>운동 영상</Label>
            <Button
              $size="small"
              $variant="primary"
              onClick={() => openModal('videoUpload')}
            >
              업로드
            </Button>
          </ImageTitle>
          <VideoContainer>
            {sessionData.videoUrls.map((video, index) => (
              <video key={index} controls>
                <source src={video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ))}
          </VideoContainer>
        </Section>
      </DetailWrapper>
      <PhotoUploadModal
        isOpen={isOpen('photoUpload')}
        onClose={() => closeModal('photoUpload')}
        onUpload={handlePhotoUpload}
      />
      <VideoUploadModal
        isOpen={isOpen('videoUpload')}
        onClose={() => closeModal('videoUpload')}
        onUpload={handleVideoUpload}
      />
    </SectionWrapper>
  );
};

export default SessionDetail;
