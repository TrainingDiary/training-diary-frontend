import React, { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useInfiniteQuery } from 'react-query';

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
  height: calc(100dvh - 150px);
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

interface Diet {
  dietId: number;
  thumbnailUrl: string;
}

interface DietResponse {
  content: Diet[];
  pageable: {
    pageNumber: number;
  };
  totalPages: number;
  last: boolean;
}

const Diet: React.FC = () => {
  useFetchUser();
  const { user } = useUserStore();
  const navigate = useNavigate();
  const traineeApi = CreateTraineeApi(navigate);
  const { traineeId } = useParams<{ traineeId: string }>();
  const { openModal, closeModal, isOpen } = useModals();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [formData, setFormData] = useState<{
    photo: FileList | null;
    content: string;
  }>({ photo: null, content: '' });
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [errorAlert, setErrorAlert] = useState<string>('');

  const fetchDiets = async ({ pageParam = 0 }): Promise<DietResponse> => {
    const response = await traineeApi.getDiets(
      parseInt(traineeId!),
      pageParam,
      9
    );
    return response.data;
  };

  const { data, fetchNextPage, hasNextPage, refetch } =
    useInfiniteQuery<DietResponse>('diets', fetchDiets, {
      getNextPageParam: lastPage =>
        lastPage.last ? null : lastPage.pageable.pageNumber + 1,
    });

  const diets = data?.pages.flatMap(page => page.content) || [];

  const loadMoreRef = (node: HTMLElement | null) => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });
    if (node) observerRef.current.observe(node);
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
      setIsUploading(true);
      await traineeApi.addDiet(photo, formData.content);
      refetch();
      closeModal('addModal');
    } catch (error) {
      console.error('식단 추가 에러: ', error);
    } finally {
      setIsUploading(false);
    }
  };

  const onCloseErrorAlert = () => setErrorAlert('');

  return (
    <Wrapper>
      {diets.length === 0 ? (
        <div
          style={{
            fontSize: '1.4rem',
            display: 'flex',
            justifyContent: 'center',
            height: '50vh',
            alignItems: 'center',
          }}
        >
          식단이 없습니다.
        </div>
      ) : (
        <Gallery>
          {diets.map((diet, index) => (
            <ImageWrapper
              key={diet.dietId}
              onClick={() => onClickDiet(diet.dietId)}
              ref={diets.length === index + 1 ? loadMoreRef : null}
            >
              <Image src={diet.thumbnailUrl} alt="diet image" loading="lazy" />
            </ImageWrapper>
          ))}
        </Gallery>
      )}

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
            btnConfirm={isUploading ? '등록 중...' : '등록'}
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
