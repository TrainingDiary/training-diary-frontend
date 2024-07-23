import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

import addBtn from '@icons/home/addbtn.svg';
import Modal from '@components/Common/Modal/Modal';
import { AddButton } from '@components/Common/AddButton';
import { SectionWrapper } from '@components/Common/SectionWrapper';
import Card from '@components/Trainer/Card';
import AddWorkOutModal from '@components/Trainer/AddWorkOutModal';
import useModals from 'src/hooks/useModals';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 20px;
`;

// msw data type 정의
export interface WorkoutDataType {
  id: number;
  name: string;
  target_muscle: string;
  remark: string;
  weightInputRequired: boolean;
  setInputRequired: boolean;
  repInputRequired: boolean;
  timeInputRequired: boolean;
  speedInputRequired: boolean;
}

const WorkOutManagement: React.FC = () => {
  const { openModal, closeModal, isOpen } = useModals();
  const [workouts, setWorkouts] = useState<WorkoutDataType[]>([]);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<number | null>(
    null
  );
  const [formState, setFormState] = useState({
    name: '',
    targetMuscle: '',
    remark: '',
    attributes: {
      weight: false,
      set: false,
      rep: false,
      time: false,
      speed: false,
    },
  });

  const initialAttributesState = {
    weight: false,
    set: false,
    rep: false,
    time: false,
    speed: false,
  };

  const initialFormState = {
    name: '',
    targetMuscle: '',
    remark: '',
    attributes: initialAttributesState,
  };

  const initializeFormState = (data: WorkoutDataType | null) => {
    if (data) {
      setFormState({
        name: data.name,
        targetMuscle: data.target_muscle,
        remark: data.remark,
        attributes: {
          weight: data.weightInputRequired,
          set: data.setInputRequired,
          rep: data.repInputRequired,
          time: data.timeInputRequired,
          speed: data.speedInputRequired,
        },
      });
    } else {
      setFormState(initialFormState);
    }
  };

  // msw 데이터 불러오기
  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await axios.get('/api/workout-types');
        setWorkouts(response.data);
      } catch (error) {
        console.error('Failed to fetch workouts', error);
      }
    };

    fetchWorkouts();
  }, []);

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
    setSelectedWorkoutId(null);
    closeModal('deleteModal');
  };

  // TODO : 추가 적용
  const handleSaveInput = (workout: WorkoutDataType) => {
    console.log(`Saved workout: ${workout}`);
    closeModal('addModal');
  };

  // TODO : delete api 추후 적용
  const handleDeleteConfirm = () => {
    if (selectedWorkoutId !== null) {
      setWorkouts(prevWorkouts =>
        prevWorkouts.filter(workout => workout.id !== selectedWorkoutId)
      );
    }
    closeModal('deleteModal');
  };

  const getWorkoutName = (id: number | null) => {
    if (id === null) return '';
    const workout = workouts.find(workout => workout.id === id);
    return workout ? workout.name : '';
  };

  return (
    <SectionWrapper>
      <Wrapper>
        {workouts.map(workout => (
          <Card
            key={workout.id}
            workout={workout}
            onDelete={handleOpenDeleteModal}
            onEdit={() => handleOpenEditModal(workout)}
          />
        ))}
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
          formState={formState}
          setFormState={setFormState}
        />
      </Wrapper>
    </SectionWrapper>
  );
};

export default WorkOutManagement;
