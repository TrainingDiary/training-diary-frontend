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
import useFetchUser from 'src/hooks/useFetchUser';
import CreateTraineeApi from 'src/api/trainee';
import useUserStore from 'src/stores/userStore';

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
  useFetchUser();
  const { user } = useUserStore();
  const navigate = useNavigate();
  const traineeApi = CreateTraineeApi(navigate);
  const { traineeId } = useParams<{ traineeId: string }>();
  const { openModal, closeModal, isOpen } = useModals();
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState<{
    photo: FileList | null;
    content: string;
  }>({ photo: null, content: '' });
  const [preview, setPreview] = useState<string | null>(null);
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
    setPreview(null);
    openModal('addModal');
  };

  const onSaveAddModal = async () => {
    if (!formData.photo) {
      return setErrorAlert('식단 사진을 추가해주세요.');
    }

    if (!formData.content) {
      return setErrorAlert('식단 내용을 입력해주세요.');
    }

    const photo = formData.photo[0];

    try {
      await traineeApi.addDiet(photo, formData.content);
      closeModal('addModal');
    } catch (error) {
      console.error('식단 추가 에러: ', error);
    }
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
      {user?.role === 'TRAINEE' && (
        <React.Fragment>
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
              formData={formData}
              setFormData={setFormData}
              preview={preview}
              setPreview={setPreview}
            />
          </Modal>
        </React.Fragment>
      )}
      {errorAlert && (
        <Alert $type="error" text={errorAlert} onClose={onCloseErrorAlert} />
      )}
    </Wrapper>
  );
};

export default Diet;
