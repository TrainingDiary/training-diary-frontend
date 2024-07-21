import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import InfiniteScroll from 'react-infinite-scroll-component';

import addBtn from '@icons/home/addbtn.svg';
import { AddButton } from '@components/Common/AddButton';
import Modal from '@components/Common/Modal/Modal';
import Alert from '@components/Common/Alert/Alert';
import DietUploadModal from '@components/Trainee/DietUploadModal';
import useModals from 'src/hooks/useModals';

const Wrapper = styled.div`
  height: calc(100vh - 150px);
  overflow: auto;
`;

const Gallery = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
`;

const ImageWrapper = styled.div`
  width: calc(100vw / 3);
  height: calc(100vw / 3);
  max-width: 150px;
  max-height: 150px;
  cursor: pointer;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
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
  const navigate = useNavigate();
  const { traineeId } = useParams<{ traineeId: string }>();
  const { openModal, closeModal, isOpen } = useModals();
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState<{
    photo: FileList | null;
    content: string;
  }>({ photo: null, content: '' });
  const [isLoading, setLoading] = useState<boolean>(false);
  const [errorAlert, setErrorAlert] = useState<string>('');

  const fetchMoreImages = async () => {
    if (isLoading) return;
    setLoading(true);

    setImages(prevImages => [...prevImages, ...getMoreImages()]);
    setLoading(false);
  };

  const onClickDiet = (dietId: number) => {
    navigate(`/trainee/${traineeId}/diet/${dietId}`);
  };

  const onClickAddButton = () => {
    setFormData({ photo: null, content: '' });
    openModal('addModal');
  };

  const onSaveAddModal = () => {
    if (!formData.photo) {
      return setErrorAlert('식단 사진을 추가해주세요.');
    }

    if (!formData.content) {
      return setErrorAlert('식단 내용을 입력해주세요.');
    }

    // 식단 추가 API 요청 단계 추가
    console.log(formData);

    closeModal('addModal');
  };

  const onChangeFormData = (
    data: React.SetStateAction<{ photo: FileList | null; content: string }>
  ) => {
    setFormData(data);
  };

  const onCloseErrorAlert = () => setErrorAlert('');

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
            <ImageWrapper key={index} onClick={() => onClickDiet(index)}>
              <Image src={src} alt={`image ${index}`} loading="lazy" />
            </ImageWrapper>
          ))}
        </Gallery>
      </InfiniteScroll>
      <AddButton onClick={onClickAddButton}>
        <img src={addBtn} alt="add button" />
      </AddButton>
      <Modal
        title="식단 올리기"
        type="custom"
        isOpen={isOpen('addModal')}
        onClose={() => closeModal('addModal')}
        onSave={() => onSaveAddModal()}
        btnConfirm="등록"
      >
        <DietUploadModal
          onChangeFormData={onChangeFormData}
          formData={formData}
        />
      </Modal>
      {errorAlert && (
        <Alert $type="error" text={errorAlert} onClose={onCloseErrorAlert} />
      )}
    </Wrapper>
  );
};

export default Diet;
