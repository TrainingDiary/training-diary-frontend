import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import InfiniteScroll from 'react-infinite-scroll-component';

const Wrapper = styled.div`
  height: 100vh;
  overflow: auto;
`;

const Gallery = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
`;

const Image = styled.img`
  width: calc(100vw / 3);
  height: calc(100vw / 3);
  max-width: 150px;
  max-height: 150px;
  object-fit: cover;
`;

// pixabay에서 제공하는 150px 크기의 무료 이미지 링크 (추후 API 연동시 삭제)
const getMoreImages = (count = 9) => {
  const images = [];
  for (let i = 0; i < count; i++) {
    images.push(
      `https://via.placeholder.com/150?text=Image${Math.floor(Math.random() * 100)}`
    );
  }

  return images;
};

const Diet: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  const fetchMoreImages = async () => {
    if (isLoading) return;
    setLoading(true);

    setImages(prevImages => [...prevImages, ...getMoreImages()]);
    setLoading(false);
  };

  useEffect(() => setImages(getMoreImages(24)), []);

  return (
    <Wrapper id="scrollDiv">
      <InfiniteScroll
        dataLength={images.length}
        next={fetchMoreImages}
        hasMore={true}
        loader={<h4>Loading...</h4>}
        scrollableTarget="scrollDiv"
      >
        <Gallery>
          {images.map((src, index) => (
            <Image key={index} src={src} alt={`image ${index}`} />
          ))}
        </Gallery>
      </InfiniteScroll>
    </Wrapper>
  );
};

export default Diet;
