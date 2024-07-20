import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import addBtn from '@icons/home/addbtn.svg';
import { SectionWrapper } from '@components/Common/SectionWrapper';
import { AddButton } from '@components/Common/AddButton';
import { user } from 'src/stores/userStore';

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
  background-color: ${({ theme }) => theme.colors.white};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Image = styled.img`
  display: block;
  width: 100%;
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
  border-bottom: 1px solid #e0e0e0;
`;

interface Session {
  sessionDate: string;
  sessionNumber: number;
  sessionId: number;
}

const sessions: Session[] = [
  { sessionDate: '2024. 00. 00', sessionNumber: 3, sessionId: 3 },
  { sessionDate: '2024. 00. 00', sessionNumber: 2, sessionId: 2 },
  { sessionDate: '2024. 00. 00', sessionNumber: 1, sessionId: 1 },
];

const Session: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const getMoreImages = (count = 9) => {
    const newImages = [];
    for (let i = 0; i < count; i++) {
      newImages.push(
        `https://via.placeholder.com/250?text=Image${Math.floor(Math.random() * 100)}`
      );
    }

    return newImages;
  };

  const loadMoreImages = () => {
    setImages(prevImages => [...prevImages, ...getMoreImages()]);
  };

  useEffect(() => {
    setImages(getMoreImages(20));

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          loadMoreImages();
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
  }, []);

  useEffect(() => {
    const container = imageContainerRef.current;

    const handleWheel = (event: WheelEvent) => {
      if (container) {
        if (event.deltaY !== 0) {
          container.scrollLeft += event.deltaY;
          event.preventDefault();
        }
      }
    };

    if (container) {
      container.addEventListener('wheel', handleWheel);
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  return (
    <SectionWrapper>
      <Wrapper>
        <PhotoBox>
          <SectionTitle>자세 사진 목록</SectionTitle>
          <ImageContainer ref={imageContainerRef}>
            {images.map((src, index) => (
              <ImageLayout key={index}>
                <Image src={src} alt={`image ${index}`} />
              </ImageLayout>
            ))}
            <div ref={observerRef} />
          </ImageContainer>
        </PhotoBox>
        <RecordBox>
          <SectionTitle>운동 기록 목록</SectionTitle>
          <RecordList>
            {sessions.map((session, index) => (
              <Link to={`${session.sessionId}`}>
                <RecordItem key={index}>
                  <div>{session.sessionDate}</div>
                  <div>{session.sessionNumber}회차</div>
                </RecordItem>
              </Link>
            ))}
          </RecordList>
        </RecordBox>
      </Wrapper>
      {user?.role === 'TRAINER' ? (
        <AddButton>
          <img src={addBtn} alt="add button" />
        </AddButton>
      ) : null}
    </SectionWrapper>
  );
};

export default Session;
