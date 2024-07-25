import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';

import addBtn from '@icons/home/addbtn.svg';
import avatar from '@icons/home/avatar.svg';
import Modal from '@components/Common/Modal/Modal';
import Alert from '@components/Common/Alert/Alert';
import { AddButton } from '@components/Common/AddButton';
import { SectionWrapper } from '@components/Common/SectionWrapper';
import { hexToRgba } from 'src/utils/hexToRgba';
import formatDate from 'src/utils/formatDate';
import useModals from 'src/hooks/useModals';
import useFetchUser from 'src/hooks/useFetchUser';
import CreateTrainerApi from 'src/api/trainer';

// Styled components
const HomeLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 100%;
  gap: 10px;
`;

const DropDownWrapper = styled.div`
  width: 100%;
  max-width: 120px;
  select {
    width: 100%;
    border-radius: 5px;
    border: none;
    /* appearance: none; */
    padding: 10px;
    border-radius: 5px;
    background-color: ${({ theme }) => theme.colors.white};
    border: 1px solid ${({ theme }) => theme.colors.gray300};
    box-shadow: 0 1px 4px 0 ${({ theme }) => hexToRgba(theme.colors.black, 0.2)};
    font-size: 1.2rem;
    /* background-image: url('/src/assets/icons/home/dropDownArrow.svg');
    background-position: 97% center;
    background-repeat: no-repeat;
    background-size: auto; */

    &:focus {
      outline: none;
    }

    option {
      padding: 10px;
    }
  }
`;

const TraineeList = styled.ul`
  width: 100%;
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const TraineeItem = styled.li`
  display: flex;
  align-items: center;
  a {
    display: flex;
    align-items: center;
    gap: 10px;
    background-color: ${({ theme }) => theme.colors.white};
    width: 100%;
    text-decoration: none;
    flex: 1;
  }
`;

const Avatar = styled.span`
  display: flex;
  background-color: ${({ theme }) => theme.colors.main400};
  padding: 12px;
  border-radius: 50%;
  border: none;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
`;

const DeleteButton = styled.button`
  padding: 5px;
  background-color: ${({ theme }) => theme.colors.gray100};
  color: ${({ theme }) => theme.colors.gray600};
  border: solid 1px ${({ theme }) => theme.colors.gray300};
  max-width: 80px;
  width: 100%;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.6rem;
  max-height: 30px;
  line-height: 1;
`;

const TraineeInfo = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;

  p {
    font-size: 1.6rem;
    font-family: 'NanumSquareBold';
    color: ${({ theme }) => theme.colors.gray900};
  }

  span {
    font-size: 1.2rem;
    color: ${({ theme }) => theme.colors.gray600};
  }
`;

interface TraineeDataType {
  ptContractId: number;
  totalSessionUpdatedAt: string;
  totalSession: number;
  trainerId: number;
  traineeId: number;
  traineeName: string;
}

const TraineeManagement: React.FC = () => {
  useFetchUser();
  const navigate = useNavigate();
  const trainerApi = CreateTrainerApi(navigate);
  const { openModal, closeModal, isOpen } = useModals();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [traineeData, setTraineeData] = useState<TraineeDataType[]>([]);
  const [sortOption, setSortOption] = useState<string>('NAME');
  const [selectedTraineeId, setSelectedTraineeId] = useState<number | null>(
    null
  );
  const [errorAlert, setErrorAlert] = useState<string>('');

  // fetchData 추가, 삭제 등 이후로 여러 사용으로 인해 분리
  const fetchData = async (sortOption: string) => {
    try {
      setLoading(true);
      const res = await trainerApi.getTrainees(sortOption, 0, 100);

      if (res.status === 200 && res.data) {
        setTraineeData(res.data.content);
      }
    } catch (error) {
      console.error('Failed to fetch trainee data', error);
    } finally {
      setLoading(false);
    }
  };

  // 트레이니 api 연동
  useEffect(() => {
    fetchData(sortOption);
  }, [sortOption]);

  // 필터 정렬 로직
  const handleSort = (option: string) => {
    setSortOption(option);
  };

  //추가 버튼 모달
  const handleOpenAddModal = () => {
    openModal('addModal');
  };

  const handleCloseAddModal = () => {
    closeModal('addModal');
  };

  // 삭제 버튼 모달
  const handleOpenDeleteModal = (id: number) => {
    setSelectedTraineeId(id);
    openModal('deleteModal');
  };

  const handleCloseDeleteModal = () => {
    setSelectedTraineeId(null);
    closeModal('deleteModal');
  };

  // 트레이니 추가 로직
  const handleSaveInput = async (email: string) => {
    if (!email) {
      setErrorAlert('이메일을 입력해주세요.');
      return;
    }
    try {
      await trainerApi.addTrainee(email);
      fetchData(sortOption);
      closeModal('addModal');
    } catch (error: any) {
      if (error.response.status === 409) {
        setErrorAlert('이미 등록된 트레이니 입니다.');
      } else if (error.response.status === 406) {
        setErrorAlert('이메일을 확인해주세요.');
      }
      console.error('트레이니 추가 에러: ', error);
    }
  };

  // 트레이니 삭제 로직
  const handleDeleteConfirm = async () => {
    if (selectedTraineeId === null) return;
    try {
      await trainerApi.deleteTrainee(selectedTraineeId);
      fetchData(sortOption);
    } catch (error) {
      console.error('트레이니 삭제 에러: ', error);
    }
    closeModal('deleteModal');
  };

  const onCloseErrorAlert = () => setErrorAlert('');

  return (
    <React.Fragment>
      <SectionWrapper>
        <HomeLayout>
          <DropDownWrapper>
            <select
              onChange={e => handleSort(e.target.value)}
              value={sortOption}
            >
              <option value="NAME">이름순</option>
              <option value="SESSION_UPDATED_AT">PT 등록 최신순</option>
            </select>
          </DropDownWrapper>

          {isLoading ? (
            <div style={{ marginRight: 'auto', fontSize: '1.4rem' }}>
              트레이니 목록 로딩중...
            </div>
          ) : (
            <TraineeList>
              {traineeData.length > 0 ? (
                traineeData.map(trainee => (
                  <TraineeItem key={trainee.ptContractId}>
                    <Link to={`/trainee/${trainee.traineeId}/dashboard`}>
                      <Avatar>
                        <img src={avatar} alt="user avatar" />
                      </Avatar>
                      <TraineeInfo>
                        <p>{trainee.traineeName}</p>
                        <span>
                          등록일 : {formatDate(trainee.totalSessionUpdatedAt)}
                        </span>
                      </TraineeInfo>
                    </Link>
                    <DeleteButton
                      onClick={() =>
                        handleOpenDeleteModal(trainee.ptContractId)
                      }
                    >
                      삭제
                    </DeleteButton>
                  </TraineeItem>
                ))
              ) : (
                <li style={{ fontSize: '1.4rem' }}>
                  등록된 트레이니가 없습니다.
                </li>
              )}
            </TraineeList>
          )}

          <AddButton onClick={handleOpenAddModal}>
            <img src={addBtn} alt="add button" />
          </AddButton>
        </HomeLayout>

        <Modal
          title="트레이니 추가"
          type="input"
          isOpen={isOpen('addModal')}
          onClose={handleCloseAddModal}
          onSave={handleSaveInput}
        >
          E-mail을 입력해주세요.
        </Modal>
        <Modal
          title="트레이니 삭제"
          type="confirm"
          isOpen={isOpen('deleteModal')}
          onClose={handleCloseDeleteModal}
          onSave={handleDeleteConfirm}
          btnConfirm="삭제"
        >
          트레이니를 삭제하겠습니까?
        </Modal>

        {errorAlert && (
          <Alert $type="error" text={errorAlert} onClose={onCloseErrorAlert} />
        )}
      </SectionWrapper>
    </React.Fragment>
  );
};

export default TraineeManagement;
