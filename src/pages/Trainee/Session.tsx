import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';

import { SectionWrapper } from '@components/Common/SectionWrapper';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
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
  font-size: 1.4rem;
  font-weight: bold;
  color: #0d1b2a;
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
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
  max-height: 150px;
`;

const Image = styled.img`
  display: block;
  width: 100%;
`;

const RecordList = styled.div`
  border-top: 1px solid #000;
`;

const RecordItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #e0e0e0;
`;

interface Session {
  date: string;
  count: number;
}

const sessions: Session[] = [
  { date: '2024. 00. 00', count: 3 },
  { date: '2024. 00. 00', count: 2 },
  { date: '2024. 00. 00', count: 1 },
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
    setImages(getMoreImages(5));

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          loadMoreImages();
        }
      },
      {
        root: null,
        rootMargin: '0px',
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
              <RecordItem key={index}>
                <div>{session.date}</div>
                <div>{session.count}회차</div>
              </RecordItem>
            ))}
          </RecordList>
        </RecordBox>
      </Wrapper>
    </SectionWrapper>
  );
};

export default Session;
