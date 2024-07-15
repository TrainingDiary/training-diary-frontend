import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

import addBtn from '@icons/home/addbtn.svg';
import { AddButton } from './TraineeManagement';
import Modal from '@components/Common/Modal/Modal';
import Card from './Card';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 20px;
`;

// msw data type 정의
interface WorkoutDataType {
  id: number;
  name: string;
  target_muscle: string;
  remark: string;
  weight_input_required: boolean;
  set_input_required: boolean;
  rep_input_required: boolean;
  time_input_required: boolean;
  speed_input_required: boolean;
}

const WorkOutManagement: React.FC = () => {
  const [workouts, setWorkouts] = useState<WorkoutDataType[]>([]);
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<number | null>(
    null
  );

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

  const handleOpenConfirmModal = (id: number) => {
    setSelectedWorkoutId(id);
    setConfirmModalOpen(true);
  };

  const handleCloseConfirmModal = () => {
    setSelectedWorkoutId(null);
    setConfirmModalOpen(false);
  };

  // TODO : delete api 추후 적용
  const handleDeleteConfirm = () => {
    if (selectedWorkoutId !== null) {
      setWorkouts((prevWorkouts) =>
        prevWorkouts.filter((workout) => workout.id !== selectedWorkoutId)
      );
    }
    setConfirmModalOpen(false);
  };

  const getWorkoutName = (id: number | null) => {
    if (id === null) return '';
    const workout = workouts.find((workout) => workout.id === id);
    return workout ? workout.name : '';
  };

  return (
    <Wrapper>
      {workouts.map((workout) => (
        <Card
          key={workout.id}
          workout={workout}
          onDelete={handleOpenConfirmModal}
          onEdit={() => console.log('Edit workout', workout.id)}
        />
      ))}
      {/* Add button 추가 */}
      <AddButton>
        <img src={addBtn} alt="add button" />
      </AddButton>
      <Modal
        title="운동 종류 삭제"
        type="confirm"
        isOpen={isConfirmModalOpen}
        onClose={handleCloseConfirmModal}
        onSave={handleDeleteConfirm}
        btnConfirm="삭제"
      >
        {selectedWorkoutId &&
          `'${getWorkoutName(selectedWorkoutId)}' 를(을) 삭제하겠습니까?`}
      </Modal>
    </Wrapper>
  );
};

export default WorkOutManagement;
