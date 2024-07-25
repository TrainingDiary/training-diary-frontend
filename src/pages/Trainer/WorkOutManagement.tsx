import React, { useState } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';

import addBtn from '@icons/home/addbtn.svg';
import Modal from '@components/Common/Modal/Modal';
import { AddButton } from '@components/Common/AddButton';
import { SectionWrapper } from '@components/Common/SectionWrapper';
import Alert from '@components/Common/Alert/Alert';
import Card from '@components/Trainer/Card';
import AddWorkOutModal from '@components/Trainer/AddWorkOutModal';
import CreateTrainerApi from 'src/api/trainer';
import { useNavigate } from 'react-router-dom';
import useModals from 'src/hooks/useModals';
import useFetchUser from 'src/hooks/useFetchUser';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 20px;
`;

// data type 정의
export interface WorkoutDataType {
  workoutTypeId?: number;
  id: number;
  name: string;
  targetMuscle: string;
  remarks: string;
  weightInputRequired: boolean;
  setInputRequired: boolean;
  repInputRequired: boolean;
  timeInputRequired: boolean;
  speedInputRequired: boolean;
}

const WorkOutManagement: React.FC = () => {
  useFetchUser();
  const navigate = useNavigate();
  const trainerApi = CreateTrainerApi(navigate);
  const { openModal, closeModal, isOpen } = useModals();
  const [errorAlert, setErrorAlert] = useState<string>('');
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<number | null>(
    null
  );
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [formState, setFormState] = useState<WorkoutDataType>({
    id: 0,
    name: '',
    targetMuscle: '',
    remarks: '',
    weightInputRequired: false,
    setInputRequired: false,
    repInputRequired: false,
    timeInputRequired: false,
    speedInputRequired: false,
  });

  const { data, isLoading, refetch } = useQuery(
    ['workouts', page, size],
    () => trainerApi.getWorkouts(page, size),
    {
      keepPreviousData: true,
    }
  );

  const workouts: WorkoutDataType[] = data?.data.content || [];

  const initialFormState = {
    id: 0,
    name: '',
    targetMuscle: '',
    remarks: '',
    weightInputRequired: false,
    setInputRequired: false,
    repInputRequired: false,
    timeInputRequired: false,
    speedInputRequired: false,
  };

  const initializeFormState = (data: WorkoutDataType | null) => {
    if (data) {
      setFormState(data);
    } else {
      setFormState(initialFormState);
    }
  };

  // 추가 버튼
  const handleOpenAddModal = () => {
    initializeFormState(null);
    openModal('addModal');
  };

  const handleCloseAddModal = () => {
    setSelectedWorkoutId(null);
    closeModal('addModal');
  };

  // 수정 버튼
  const handleOpenEditModal = (workout: WorkoutDataType) => {
    initializeFormState(workout);
    openModal('addModal');
  };

  // 삭제 버튼
  const handleOpenDeleteModal = (id: number) => {
    setSelectedWorkoutId(id);
    openModal('deleteModal');
  };

  const handleCloseDeleteModal = () => {
    closeModal('deleteModal');
  };

  // 운동 종류 추가
  const handleSaveInput = async (workout: WorkoutDataType) => {
    try {
      await trainerApi.addWorkouts(workout);
      refetch();
      closeModal('addModal');
    } catch (error) {
      console.error('운동 종류 추가 에러: ', error);
    }
  };

  // 운동 종류 수정
  const handleEditInput = async (workout: WorkoutDataType) => {
    try {
      await trainerApi.editWorkouts({
        workoutTypeId: workout.id,
        name: workout.name,
        targetMuscle: workout.targetMuscle,
        remarks: workout.remarks,
        id: 0,
        weightInputRequired: false,
        setInputRequired: false,
        repInputRequired: false,
        timeInputRequired: false,
        speedInputRequired: false,
      });
      refetch();
      closeModal('addModal');
    } catch (error) {
      console.error('운동 종류 수정 에러: ', error);
    }
  };

  // 운동 종류 삭제
  const handleDeleteConfirm = async () => {
    if (selectedWorkoutId !== null) {
      try {
        await trainerApi.deleteWorkouts(selectedWorkoutId);
        refetch();
      } catch (error) {
        console.error('운동 종류 삭제 에러: ', error);
      }
    }
    closeModal('deleteModal');
  };

  const getWorkoutName = (id: number | null) => {
    if (id === null) return '';
    const workout = workouts.find(workout => workout.id === id);
    return workout ? workout.name : '';
  };

  const onCloseErrorAlert = () => setErrorAlert('');

  return (
    <SectionWrapper>
      <Wrapper>
        {isLoading ? (
          <div>운동 종류 목록 로딩중...</div>
        ) : (
          workouts.map(workout => (
            <Card
              key={workout.id}
              workout={workout}
              onDelete={() => handleOpenDeleteModal(workout.id)}
              onEdit={() => handleOpenEditModal(workout)}
            />
          ))
        )}
        {/* Add button 추가 */}
        <AddButton onClick={handleOpenAddModal}>
          <img src={addBtn} alt="add button" />
        </AddButton>
        <Modal
          title="운동 종류 삭제"
          type="confirm"
          isOpen={isOpen('deleteModal')}
          onClose={handleCloseDeleteModal}
          onSave={handleDeleteConfirm}
          btnConfirm="삭제"
        >
          {selectedWorkoutId &&
            `'${getWorkoutName(selectedWorkoutId)}' 를(을) 삭제하겠습니까?`}
        </Modal>
        <AddWorkOutModal
          isOpen={isOpen('addModal')}
          onClose={handleCloseAddModal}
          onSave={handleSaveInput}
          onEdit={handleEditInput}
          formState={formState}
          setFormState={setFormState}
        />
      </Wrapper>

      {errorAlert && (
        <Alert $type="error" text={errorAlert} onClose={onCloseErrorAlert} />
      )}
    </SectionWrapper>
  );
};

export default WorkOutManagement;
