import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useInfiniteQuery } from 'react-query';
import { format } from 'date-fns';

import addBtn from '@icons/home/addbtn.svg';
import { SectionWrapper } from '@components/Common/SectionWrapper';
import { AddButton } from '@components/Common/AddButton';
import AddSessionModal, {
  SessionDataType,
} from '@components/Trainee/AddSessionModal';
import useUserStore from 'src/stores/userStore';
import useModals from 'src/hooks/useModals';
import useFetchUser from 'src/hooks/useFetchUser';
import CreateTraineeApi from 'src/api/trainee';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  position: relative;
  margin-bottom: 30px;
`;

const PhotoBox = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
`;

const RecordBox = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
`;

const SectionTitle = styled.h2`
  font-size: 1.6rem;
  font-family: 'NanumSquareBold';
  color: ${({ theme }) => theme.colors.gray900};
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 20px;
  overflow-x: auto;
  width: 100%;
  position: relative;
`;

const ImageLayout = styled.div`
  min-width: 250px;
  max-height: 150px;
  background-color: ${({ theme }) => theme.colors.gray800};
  display: flex;
  justify-content: center;
  user-select: none;
  cursor: pointer;
`;

const Image = styled.img`
  display: block;
  object-fit: cover;
  object-position: center;
  pointer-events: none;
`;

const RecordList = styled.div`
  border-top: solid 2px ${({ theme }) => theme.colors.main500};
  font-size: 1.4rem;

  a {
    text-decoration: none;
    color: ${({ theme }) => theme.colors.gray900};
  }
`;

const RecordItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray300};
`;

interface SessionData {
  sessionId: number;
  sessionDate: string;
  sessionNumber: number;
  thumbnailUrls: string[];
}

const Session: React.FC = () => {
  useFetchUser();
  const navigate = useNavigate();
  const traineeApi = CreateTraineeApi(navigate);
  const { user } = useUserStore();
  const { traineeId } = useParams<{ traineeId: string }>();
  const observerRef = useRef<HTMLDivElement | null>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const touchStartXRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const { openModal, closeModal, isOpen } = useModals();
  const [formState, setFormState] = useState<SessionDataType>({
    traineeId: traineeId,
    sessionDate: format(new Date(), 'yyyy-MM-dd'),
    sessionNumber: 0,
    specialNote: '',
    workouts: [
      { workoutTypeId: 0, weight: '', speed: '', time: '', sets: '', rep: '' },
    ],
  });

  const fetchSessions = async ({ pageParam = 0 }) => {
    const res = await traineeApi.getSessionsList(traineeId, pageParam, 20);
    return res.data;
  };

  const { data, fetchNextPage, hasNextPage, refetch } = useInfiniteQuery(
    'sessions',
    fetchSessions,
    {
      getNextPageParam: lastPage => lastPage.nextPage ?? false,
    }
  );

  const sessions = data?.pages.flatMap(page => page.content) ?? [];
  const images = sessions.flatMap((session: SessionData) =>
    session.thumbnailUrls.map((url: string) => ({
      src: url,
      sessionId: session.sessionId,
    }))
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      {
        root: imageContainerRef.current,
        rootMargin: '100px',
        threshold: 1.0,
      }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [hasNextPage, fetchNextPage]);

  useEffect(() => {
    const container = imageContainerRef.current;

    const handleMouseDown = (event: MouseEvent) => {
      isDraggingRef.current = true;
      startXRef.current = event.pageX - container!.offsetLeft;
      scrollLeftRef.current = container!.scrollLeft;
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDraggingRef.current) return;
      event.preventDefault();
      const x = event.pageX - container!.offsetLeft;
      const walk = x - startXRef.current;
      container!.scrollLeft = scrollLeftRef.current - walk;
    };

    const handleMouseUpOrLeave = () => {
      isDraggingRef.current = false;
    };

    const handleWheel = (event: WheelEvent) => {
      if (container) {
        if (event.deltaY !== 0) {
          container.scrollLeft += event.deltaY;
          event.preventDefault();
        }
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      touchStartXRef.current = event.touches[0].clientX;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (container && touchStartXRef.current !== null) {
        const touchCurrentX = event.touches[0].clientX;
        const touchDeltaX = (touchStartXRef.current - touchCurrentX) * 2;
        container.scrollLeft += touchDeltaX;
        touchStartXRef.current = touchCurrentX;
        event.preventDefault();
      }
    };

    if (container) {
      container.addEventListener('mousedown', handleMouseDown);
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseup', handleMouseUpOrLeave);
      container.addEventListener('mouseleave', handleMouseUpOrLeave);
      container.addEventListener('wheel', handleWheel);
      container.addEventListener('touchstart', handleTouchStart);
      container.addEventListener('touchmove', handleTouchMove);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousedown', handleMouseDown);
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseup', handleMouseUpOrLeave);
        container.removeEventListener('mouseleave', handleMouseUpOrLeave);
        container.removeEventListener('wheel', handleWheel);
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
      }
    };
  }, []);

  const handleSaveSession = () => {
    refetch();
  };

  const handleImageClick = (sessionId: number) => {
    navigate(`/trainee/${traineeId}/session/${sessionId}`); // traineeID
  };

  return (
    <SectionWrapper>
      <Wrapper>
        <PhotoBox>
          <SectionTitle>자세 사진 목록</SectionTitle>
          <ImageContainer ref={imageContainerRef}>
            {images.map((image, index) => (
              <ImageLayout
                key={index}
                onClick={() => handleImageClick(image.sessionId)}
              >
                <Image src={image.src} alt={`image ${index}`} loading="lazy" />
              </ImageLayout>
            ))}
            <div ref={observerRef} />
          </ImageContainer>
        </PhotoBox>
        <RecordBox>
          <SectionTitle>운동 기록 목록</SectionTitle>
          <RecordList>
            {sessions.map((session, index) => (
              <Link to={`${session.sessionId}`} key={index}>
                <RecordItem>
                  <div>{session.sessionDate}</div>
                  <div>{session.sessionNumber}회차</div>
                </RecordItem>
              </Link>
            ))}
          </RecordList>
        </RecordBox>
      </Wrapper>
      {user?.role === 'TRAINER' ? (
        <AddButton onClick={() => openModal('addSessionModal')}>
          <img src={addBtn} alt="add button" />
        </AddButton>
      ) : null}
      <AddSessionModal
        isOpen={isOpen('addSessionModal')}
        onClose={() => closeModal('addSessionModal')}
        onSave={handleSaveSession}
        formState={formState}
        setFormState={setFormState}
        traineeId={traineeId}
      />
    </SectionWrapper>
  );
};

export default Session;
