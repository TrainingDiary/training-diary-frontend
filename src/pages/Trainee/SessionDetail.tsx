import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';

import { SectionWrapper } from '@components/Common/SectionWrapper';
import Modal from '@components/Common/Modal/Modal';
import Button from '@components/Common/Button/Button';
import PhotoUploadModal from '@components/Trainee/PhotoUploadModal';
import VideoUploadModal from '@components/Trainee/VideoUploadModal';
import EditSessionModal from '@components/Trainee/EditSessionModal';
import ImageModal from '@components/Trainee/ImageModal';
import { hexToRgba } from 'src/utils/hexToRgba';
import useFetchUser from 'src/hooks/useFetchUser';
import useModals from 'src/hooks/useModals';
import CreateTraineeApi from 'src/api/trainee';
import CreateTrainerApi from 'src/api/trainer';
import useUserStore from 'src/stores/userStore';

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

const LabelWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;

  span {
    color: ${({ theme }) => theme.colors.red400};
    font-size: 1rem;
    flex: 1;
  }
`;

const ScrollContainer = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
  user-select: none;
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
  user-select: none;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
  }
`;

const VideoContainer = styled(ScrollContainer)`
  video {
    width: 90%;
    height: 100%;
    object-fit: cover;
  }
`;

export interface Workout {
  workoutId: number;
  workoutTypeId: number;
  workoutTypeName: string;
  targetMuscle: string;
  remarks: string;
  weight: number;
  rep: number;
  sets: number;
  time: number;
  speed: number;
}

export interface SessionDetailType {
  sessionId: number;
  sessionDate: string;
  sessionNumber: number;
  specialNote: string;
  workouts: Workout[];
  photoUrls: string[];
  videoUrls: string[];
  thumbnailUrls: string[];
}

const SessionDetail: React.FC = () => {
  useFetchUser();
  const navigate = useNavigate();
  const { user } = useUserStore();
  const traineeApi = CreateTraineeApi(navigate);
  const trainerApi = CreateTrainerApi(navigate);
  const { traineeId, sessionId } = useParams<{
    traineeId: string;
    sessionId: string;
  }>();
  const { openModal, closeModal, isOpen } = useModals();
  const [sessionData, setSessionData] = useState<SessionDetailType | null>(
    null
  );
  const [workoutTypes, setWorkoutTypes] = useState<
    {
      id: number;
      name: string;
      workoutTypeId: number;
      targetMuscle: string;
      weightInputRequired: boolean;
      setInputRequired: boolean;
      repInputRequired: boolean;
      timeInputRequired: boolean;
      speedInputRequired: boolean;
    }[]
  >([]);
  const [formState, setFormState] = useState<SessionDetailType | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  // useQuery 데이터 불러오기
  const { data, isLoading, refetch } = useQuery(
    ['sessionDetail', sessionId],
    () => traineeApi.getSessionDetail(Number(sessionId)),
    {
      enabled: !!sessionId,
    }
  );

  useEffect(() => {
    if (data) {
      setSessionData(data.data);
    }
  }, [data]);

  useEffect(() => {
    // Fetch workout types
    if (user?.role === 'TRAINER') {
      const fetchWorkoutTypes = async () => {
        try {
          const res = await trainerApi.getWorkouts();
          setWorkoutTypes(res.data.content);
        } catch (error) {
          console.error('운동 종류 가져오기 실패 : ', error);
        }
      };
      fetchWorkoutTypes();
    }
  }, [traineeId, sessionId]);

  // 가로 스크롤 구현
  const handleHorizontalScroll = (container: HTMLDivElement | null) => {
    if (!container) return;

    let startX: number;
    let scrollLeft: number;
    let isDown = false;

    const mouseDownHandler = (e: MouseEvent) => {
      isDown = true;
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    };

    const mouseLeaveHandler = () => {
      isDown = false;
    };

    const mouseUpHandler = () => {
      isDown = false;
    };

    const mouseMoveHandler = (e: MouseEvent) => {
      if (!isDown) return;

      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 2;
      container.scrollLeft = scrollLeft - walk;
    };

    const wheelHandler = (e: WheelEvent) => {
      container.scrollLeft += e.deltaY;
      e.preventDefault();
    };

    container.addEventListener('mousedown', mouseDownHandler);
    container.addEventListener('mouseleave', mouseLeaveHandler);
    container.addEventListener('mouseup', mouseUpHandler);
    container.addEventListener('mousemove', mouseMoveHandler);
    container.addEventListener('wheel', wheelHandler);

    return () => {
      container.removeEventListener('mousedown', mouseDownHandler);
      container.removeEventListener('mouseleave', mouseLeaveHandler);
      container.removeEventListener('mouseup', mouseUpHandler);
      container.removeEventListener('mousemove', mouseMoveHandler);
      container.removeEventListener('wheel', wheelHandler);
    };
  };

  useEffect(() => {
    const imageContainer = imageContainerRef.current;
    const videoContainer = videoContainerRef.current;

    const cleanupImageScroll = handleHorizontalScroll(imageContainer);
    const cleanupVideoScroll = handleHorizontalScroll(videoContainer);

    return () => {
      cleanupImageScroll?.();
      cleanupVideoScroll?.();
    };
  }, [imageContainerRef.current, videoContainerRef.current]);

  // 이미지 업로드 핸들러
  const handlePhotoUpload = async (images: File[]) => {
    setUploading(true);
    try {
      await traineeApi.sessionPhotoUpload(sessionId, images);
      refetch();
    } catch (error) {
      console.error('운동 기록 이미지 추가 에러: ', error);
    }
    setUploading(false);
    closeModal('photoUpload');
  };

  // 동영상 업로드 핸들러
  const handleVideoUpload = async (video: File) => {
    setUploading(true);
    try {
      await traineeApi.sessionVideoUpload(sessionId, video);
      refetch();
    } catch (error) {
      console.error('운동 기록 동영상 추가 에러: ', error);
    }
    setUploading(false);
    closeModal('videoUpload');
  };

  const handleEditSession = () => {
    setFormState(sessionData);
    openModal('editSessionModal');
  };

  const handleSaveSession = (updatedSession: SessionDetailType) => {
    setSessionData(updatedSession);
    closeModal('editSessionModal');
    refetch();
  };

  const handleDeleteSession = async () => {
    try {
      await traineeApi.deleteSession(sessionId);
    } catch (error) {
      console.error('운동 기록 삭제 에러: ', error);
      return;
    }
    navigate(`/trainee/${traineeId}/session`);
  };

  const handleConfirmDelete = () => {
    openModal('deleteSessionModal');
  };

  const handleImageClick = (imageUrl: string, e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    setSelectedImageUrl(imageUrl);
    openModal('imageModal');
  };

  if (!sessionData) {
    return (
      <div
        style={{
          fontSize: '1.4rem',
          display: 'flex',
          justifyContent: 'center',
          height: '50vh',
          alignItems: 'center',
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <SectionWrapper>
      {isLoading ? (
        <div
          style={{
            fontSize: '1.4rem',
            display: 'flex',
            justifyContent: 'center',
            height: '50vh',
            alignItems: 'center',
          }}
        >
          Loading...
        </div>
      ) : (
        <DetailWrapper>
          <Header>
            <Title>
              {sessionData.sessionDate} / {sessionData.sessionNumber}회차
            </Title>
            {user?.role === 'TRAINER' ? (
              <ButtonGroup>
                <Button $size="small" type="button" onClick={handleEditSession}>
                  수정
                </Button>
                <Button
                  $size="small"
                  type="button"
                  onClick={handleConfirmDelete}
                >
                  삭제
                </Button>
              </ButtonGroup>
            ) : null}
          </Header>
          <Section>
            <Label>특이 사항</Label>
            <TextArea value={sessionData.specialNote} readOnly />
          </Section>
          <Section>
            <Label>운동 종류 기록</Label>
            {sessionData.workouts.map((workout, index) => (
              <NoteWrap key={index}>
                <NoteHead>
                  <p>운동명 : {workout.workoutTypeName}</p>
                  <p>/</p>
                  <p>대상 근육 : {workout.targetMuscle}</p>
                </NoteHead>
                <NoteBody>
                  {workout.weight > 0 && <p>무게: {workout.weight}kg</p>}
                  {workout.rep > 0 && <p>횟수: {workout.rep}회</p>}
                  {workout.sets > 0 && <p>세트: {workout.sets}세트</p>}
                  {workout.time > 0 && <p>시간: {workout.time}초</p>}
                  {workout.speed > 0 && <p>속도: {workout.speed}m/s</p>}
                </NoteBody>
              </NoteWrap>
            ))}
          </Section>
          <Section>
            <ImageTitle>
              <LabelWrap>
                <Label>자세 사진</Label>
                {user?.role === 'TRAINER' ? (
                  <span>사진은 최대 10장 까지 등록 가능합니다.</span>
                ) : null}
              </LabelWrap>
              {user?.role === 'TRAINER' ? (
                <Button
                  $size="small"
                  $variant="primary"
                  onClick={() => openModal('photoUpload')}
                  disabled={sessionData.photoUrls.length >= 10}
                >
                  업로드
                </Button>
              ) : null}
            </ImageTitle>
            <ScrollContainer ref={imageContainerRef}>
              {sessionData.photoUrls.slice(0, 10).map((photo, index) => (
                <ImagePreview
                  key={index}
                  onClick={e => handleImageClick(photo, e)}
                >
                  <img src={photo} alt={`자세 사진 ${index}`} loading="lazy" />
                </ImagePreview>
              ))}
            </ScrollContainer>
          </Section>
          <Section>
            <ImageTitle>
              <LabelWrap>
                <Label>운동 영상</Label>
                {user?.role === 'TRAINER' ? (
                  <span>동영상은 최대 5개 까지 등록 가능합니다.</span>
                ) : null}
              </LabelWrap>
              {user?.role === 'TRAINER' ? (
                <Button
                  $size="small"
                  $variant="primary"
                  onClick={() => openModal('videoUpload')}
                  disabled={sessionData.videoUrls.length >= 5}
                >
                  업로드
                </Button>
              ) : null}
            </ImageTitle>
            <VideoContainer ref={videoContainerRef}>
              {sessionData.videoUrls.slice(0, 5).map((video, index) => (
                <video key={index} controls>
                  <source src={video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ))}
            </VideoContainer>
          </Section>
        </DetailWrapper>
      )}

      <PhotoUploadModal
        isOpen={isOpen('photoUpload')}
        onClose={() => closeModal('photoUpload')}
        onUpload={handlePhotoUpload}
        uploading={uploading}
      />
      <VideoUploadModal
        isOpen={isOpen('videoUpload')}
        onClose={() => closeModal('videoUpload')}
        onUpload={handleVideoUpload}
        uploading={uploading}
      />
      <EditSessionModal
        isOpen={isOpen('editSessionModal')}
        onClose={() => closeModal('editSessionModal')}
        onSave={handleSaveSession}
        formState={formState}
        setFormState={setFormState}
        workoutTypes={workoutTypes}
      />
      <ImageModal
        isOpen={isOpen('imageModal')}
        onClose={() => closeModal('imageModal')}
        imageUrl={selectedImageUrl || ''}
      />
      <Modal
        title="운동 기록 삭제"
        type="confirm"
        isOpen={isOpen('deleteSessionModal')}
        onClose={() => closeModal('deleteSessionModal')}
        onSave={handleDeleteSession}
        btnConfirm="삭제"
      >
        운동 기록을 삭제하시겠습니까?
      </Modal>
    </SectionWrapper>
  );
};

export default SessionDetail;
