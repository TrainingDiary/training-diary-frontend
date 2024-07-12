import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

import addBtn from '@icons/addbtn.svg';
import avatar from '@icons/avatar.svg';
import dropDownArrow from '@icons/dropDownArrow.svg';
import { hexToRgba } from 'src/utils/hexToRgba';
import Modal from '@components/Common/Modal/Modal';
import formatDate from 'src/utils/formatDate';

// Styled components
const HomeWrapper = styled.div``;

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
  position: relative;
  select {
    width: 100%;
    padding: 10px;
    border-radius: 5px;
    background-color: ${({ theme }) => theme.colors.white};
    border: 1px solid ${({ theme }) => theme.colors.gray300};
    box-shadow: 0 1px 4px 0 ${({ theme }) => hexToRgba(theme.colors.black, 0.2)};
    appearance: none;
    font-size: 1.2rem;

    &:focus {
      outline: none;
    }

    option {
      padding: 10px;
    }
  }
`;

const Arrow = styled.div`
  position: absolute;
  height: 100%;
  top: 0;
  right: 10px;
  display: inline-flex;
  align-items: center;
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
  gap: 10px;
  background-color: ${({ theme }) => theme.colors.white};
`;

const AddButton = styled.button`
  display: inline-block;
  background-color: ${({ theme }) => theme.colors.main400};
  padding: 15px 17px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  position: sticky;
  bottom: 90px;
  right: 30px;
  transition: 0.1s;
  opacity: 0.8;

  &:active {
    background-color: ${({ theme }) => theme.colors.main600};
    opacity: 1;
  }

  &:hover {
    opacity: 1;
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
  const [traineeData, setTraineeData] = useState<TraineeDataType[]>([]);
  const [sortOption, setSortOption] = useState<string>('name');
  const [isInputModalOpen, setInputModalOpen] = useState(false);
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedTraineeId, setSelectedTraineeId] = useState<number | null>(
    null
  );

  // Dummy data API 가져오기(msw)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/pt-contracts');
        if (res.status === 200 && res.data) {
          const sortedData = res.data.sort(
            (a: TraineeDataType, b: TraineeDataType) =>
              a.traineeName.localeCompare(b.traineeName)
          );
          setTraineeData(sortedData);
        }
      } catch (error) {
        console.error('Failed to fetch trainee data', error);
      }
    };
    fetchData();
  }, []);

  // 필터 정렬 로직
  const handleSort = (option: string) => {
    const sortedData = [...traineeData];
    if (option === 'name') {
      sortedData.sort((a, b) => a.traineeName.localeCompare(b.traineeName));
    } else if (option === 'date') {
      sortedData.sort(
        (a, b) =>
          new Date(b.totalSessionUpdatedAt).getTime() -
          new Date(a.totalSessionUpdatedAt).getTime()
      );
    }
    setSortOption(option);
    setTraineeData(sortedData);
  };

  // 삭제 버튼 로직
  const handleDelete = (id: number) => {
    setTraineeData((prevData) =>
      prevData.filter((trainee) => trainee.ptContractId !== id)
    );
  };

  //추가 버튼 로직
  const handleOpenInputModal = () => {
    setInputModalOpen(true);
  };

  const handleCloseInputModal = () => {
    setInputModalOpen(false);
  };

  const handleOpenConfirmModal = (id: number) => {
    setSelectedTraineeId(id);
    setConfirmModalOpen(true);
  };

  const handleCloseConfirmModal = () => {
    setSelectedTraineeId(null);
    setConfirmModalOpen(false);
  };

  const handleSaveInput = (value?: string) => {
    console.log(`Saved value: ${value}`);
    setInputModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (selectedTraineeId !== null) {
      handleDelete(selectedTraineeId);
    }
    setConfirmModalOpen(false);
  };

  return (
    <React.Fragment>
      <HomeWrapper>
        <HomeLayout>
          {/* Dropdown for sorting options */}
          <DropDownWrapper>
            <select
              onChange={(e) => handleSort(e.target.value)}
              value={sortOption}
            >
              <option value="name">이름순</option>
              <option value="date">PT 등록 최신순</option>
            </select>
            <Arrow>
              <img src={dropDownArrow} alt="DropDown Arrow" />
            </Arrow>
          </DropDownWrapper>
          {/* Trainee list */}
          <TraineeList>
            {traineeData.length > 0 ? (
              traineeData.map((trainee) => (
                <TraineeItem key={trainee.ptContractId}>
                  <Avatar>
                    <img src={avatar} alt="user avatar" />
                  </Avatar>
                  <TraineeInfo>
                    <p>{trainee.traineeName}</p>
                    <span>
                      등록일 : {formatDate(trainee.totalSessionUpdatedAt)}
                    </span>
                  </TraineeInfo>
                  <DeleteButton
                    onClick={() => handleOpenConfirmModal(trainee.ptContractId)}
                  >
                    삭제
                  </DeleteButton>
                </TraineeItem>
              ))
            ) : (
              <li>트레이니 데이터가 없습니다.</li>
            )}
          </TraineeList>
          {/* Add button 추가 */}
          <AddButton onClick={handleOpenInputModal}>
            <img src={addBtn} alt="add button" />
          </AddButton>
        </HomeLayout>
        <Modal
          title="트레이니 추가"
          type="input"
          isOpen={isInputModalOpen}
          onClose={handleCloseInputModal}
          onSave={handleSaveInput}
        >
          E-mail을 입력해주세요.
        </Modal>
        <Modal
          title="트레이니 삭제"
          type="confirm"
          isOpen={isConfirmModalOpen}
          onClose={handleCloseConfirmModal}
          onSave={handleDeleteConfirm}
          btnConfirm="삭제"
        >
          트레이니를 삭제하겠습니까?
        </Modal>
      </HomeWrapper>
    </React.Fragment>
  );
};

export default TraineeManagement;
