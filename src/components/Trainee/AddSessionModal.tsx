import React from 'react';
import styled from 'styled-components';
import Modal from '@components/Common/Modal/Modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { DatePickerWrapper } from './Calendar';

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
  position: relative;

  .dateWrap {
    max-width: 100%;
  }

  .fbVqIG .react-datepicker-popper {
    top: 110% !important;
  }

  .react-datepicker-popper[data-placement^='bottom']
    .react-datepicker__triangle {
    left: 10% !important;
  }

  h2.react-datepicker__current-month {
    font-size: 1.5rem;
  }
`;

const Label = styled.label`
  font-size: 1.4rem;
  color: ${({ theme }) => theme.colors.gray900};
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: 5px;
  outline: none;
  width: 100%;
`;

const TextArea = styled.textarea`
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: 5px;
  outline: none;
  width: 100%;
  font-family:
    'NanumSquare',
    'NotoSans KR',
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    Oxygen,
    Ubuntu,
    Cantarell,
    'Open Sans',
    'Helvetica Neue',
    sans-serif;
  resize: none;
`;

const ExerciseGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ExerciseRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const Select = styled.select``;

const AttributeGroup = styled.div`
  display: flex;
  gap: 15px;
`;

const AttributeTab = styled.div`
  display: flex;
  padding: 5px 10px;
  background-color: ${({ theme }) => theme.colors.gray300};
  line-height: 1;
  border-radius: 3px;
`;

const AddExerciseButton = styled.button`
  padding: 5px 10px;
  background-color: ${({ theme }) => theme.colors.main400};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

export interface ExerciseType {
  type: string;
  weight: string;
  speed: string;
  time: string;
  set: string;
  count: string;
}

export interface SessionDataType {
  date: Date | null;
  count: string;
  remark: string;
  exercises: ExerciseType[];
}

interface AddSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (session: SessionDataType) => void;
  formState: SessionDataType;
  setFormState: React.Dispatch<React.SetStateAction<SessionDataType>>;
  workoutTypes: {
    id: number;
    name: string;
    weightInputRequired: boolean;
    setInputRequired: boolean;
    repInputRequired: boolean;
    timeInputRequired: boolean;
    speedInputRequired: boolean;
  }[];
}

const AddSessionModal: React.FC<AddSessionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  formState,
  setFormState,
  workoutTypes,
}) => {
  const handleInputChange = (field: keyof SessionDataType, value: string) => {
    setFormState(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDateChange = (date: Date | null) => {
    setFormState(prev => ({
      ...prev,
      date: date,
    }));
  };

  const handleWorkoutTypeChange = (index: number, workoutTypeId: string) => {
    const selectedWorkout = workoutTypes.find(
      workout => workout.id === parseInt(workoutTypeId)
    );
    if (selectedWorkout) {
      const newExercises = [...formState.exercises];
      newExercises[index] = {
        ...newExercises[index],
        type: selectedWorkout.name,
        weight: '',
        speed: '',
        time: '',
        set: '',
        count: '',
      };
      setFormState(prev => ({
        ...prev,
        exercises: newExercises,
      }));
    }
  };

  const addExercise = () => {
    setFormState(prev => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        { type: '', weight: '', speed: '', time: '', set: '', count: '' },
      ],
    }));
  };

  const handleSave = () => {
    onSave(formState);
    onClose();
  };

  return (
    <Modal
      title="운동 기록 추가"
      type="custom"
      isOpen={isOpen}
      onClose={onClose}
      onSave={handleSave}
      btnConfirm="추가"
    >
      <FormGroup>
        <Label>날짜:</Label>
        <DatePickerWrapper className="dateWrap">
          <DatePicker
            selected={formState.date}
            onChange={handleDateChange}
            dateFormat="yyyy. MM. dd"
            customInput={<Input />}
          />
        </DatePickerWrapper>
      </FormGroup>
      <FormGroup>
        <Label>회차:</Label>
        <Input
          type="number"
          value={formState.count}
          onChange={e => handleInputChange('count', e.target.value)}
        />
      </FormGroup>
      <FormGroup>
        <Label>특이사항:</Label>
        <TextArea
          value={formState.remark}
          onChange={e => handleInputChange('remark', e.target.value)}
        ></TextArea>
      </FormGroup>
      <FormGroup>
        <Label>운동 종류 기록:</Label>
        {formState.exercises.map((exercise, index) => {
          const selectedWorkout = workoutTypes.find(
            workout => workout.name === exercise.type
          );
          return (
            <ExerciseGroup key={index}>
              <ExerciseRow>
                <Select
                  value={selectedWorkout ? selectedWorkout.id : ''}
                  onChange={e => handleWorkoutTypeChange(index, e.target.value)}
                >
                  <option value="">운동 종류</option>
                  {workoutTypes.map(workout => (
                    <option key={workout.id} value={workout.id}>
                      {workout.name}
                    </option>
                  ))}
                </Select>
                {selectedWorkout && (
                  <AttributeGroup>
                    {selectedWorkout.weightInputRequired && (
                      <AttributeTab>무게</AttributeTab>
                    )}
                    {selectedWorkout.setInputRequired && (
                      <AttributeTab>세트</AttributeTab>
                    )}
                    {selectedWorkout.repInputRequired && (
                      <AttributeTab>횟수</AttributeTab>
                    )}
                    {selectedWorkout.timeInputRequired && (
                      <AttributeTab>시간</AttributeTab>
                    )}
                    {selectedWorkout.speedInputRequired && (
                      <AttributeTab>속도</AttributeTab>
                    )}
                  </AttributeGroup>
                )}
              </ExerciseRow>
            </ExerciseGroup>
          );
        })}
        <AddExerciseButton onClick={addExercise}>운동 추가</AddExerciseButton>
      </FormGroup>
    </Modal>
  );
};

export default AddSessionModal;
