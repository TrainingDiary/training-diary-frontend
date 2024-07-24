import React, { useState } from 'react';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import Modal from '@components/Common/Modal/Modal';
import Alert from '@components/Common/Alert/Alert';
import { DatePickerWrapper } from './Calendar';
import { SessionDetailType } from 'src/mocks/data/workoutSessionList';
import { WorkoutsType } from './AddSessionModal';

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: stretch;
  position: relative;

  .react-datepicker__month-container .react-datepicker__header {
    background-color: ${({ theme }) => theme.colors.main600};
  }

  .dateWrap {
    max-width: 100%;
  }

  .react-datepicker-popper[data-placement^='bottom']
    .react-datepicker__triangle {
    left: 10% !important;
    fill: ${({ theme }) => theme.colors.main600};
    stroke: ${({ theme }) => theme.colors.main600};
    color: ${({ theme }) => theme.colors.main600};
  }

  h2.react-datepicker__current-month {
    font-size: 1.5rem;
  }
`;

const Label = styled.label`
  font-size: 1.4rem;
  color: ${({ theme }) => theme.colors.gray900};
  font-weight: bold;
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
  align-items: flex-start;
  flex-direction: column;
`;

const WorkoutSection = styled.div`
  max-height: 30vh;
  overflow-y: scroll;
  display: flex;
  gap: 10px;
  flex-direction: column;
  align-items: flex-start;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
`;

const Select = styled.select`
  padding: 5px;
  border: solid 1px ${({ theme }) => theme.colors.gray500};
  border-radius: 5px;
  outline: none;
`;

const AttributeGroup = styled.div`
  display: flex;
  gap: 15px;
`;

const AttributeTabInput = styled.input`
  padding: 5px 10px;
  background-color: ${({ theme }) => theme.colors.white};
  border: solid 1px ${({ theme }) => theme.colors.gray500};
  line-height: 1;
  border-radius: 3px;
  width: 100%;
  outline: none;
`;

const AddExerciseButton = styled.button`
  padding: 5px 10px;
  background-color: ${({ theme }) => theme.colors.gray900};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const RemoveExerciseButton = styled.button`
  padding: 5px 10px;
  background-color: ${({ theme }) => theme.colors.red500};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

interface EditSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (session: SessionDetailType) => void;
  formState: SessionDetailType | null;
  setFormState: React.Dispatch<React.SetStateAction<SessionDetailType | null>>;
  workoutTypes: {
    id: number;
    name: string;
    targetMuscle: string;
    weightInputRequired: boolean;
    setInputRequired: boolean;
    repInputRequired: boolean;
    timeInputRequired: boolean;
    speedInputRequired: boolean;
  }[];
}

const EditSessionModal: React.FC<EditSessionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  formState,
  setFormState,
  workoutTypes,
}) => {
  const initialFormState: SessionDetailType = {
    sessionId: 0,
    sessionDate: new Date().toISOString().split('T')[0],
    sessionNumber: 0,
    specialNote: '',
    workouts: [
      {
        workoutId: 0,
        workoutTypeName: '',
        targetMuscle: '',
        remarks: '',
        weight: 0,
        rep: 0,
        sets: 0,
        time: 0,
        speed: 0,
      },
    ],
    photoUrls: [],
    videoUrls: [],
  };

  const handleInputChange = (
    field: keyof SessionDetailType,
    value: string | number | Date
  ) => {
    setFormState(prev => (prev ? { ...prev, [field]: value } : null));
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      handleInputChange('sessionDate', date.toISOString().split('T')[0]);
    } else {
      setErrorAlert('날짜를 입력해주세요.');
    }
  };

  const handleExerciseChange = (
    index: number,
    field: keyof WorkoutsType,
    value: string | number
  ) => {
    if (formState) {
      const newWorkouts = [...formState.workouts];
      newWorkouts[index] = { ...newWorkouts[index], [field]: value };
      setFormState(prev => (prev ? { ...prev, workouts: newWorkouts } : null));
    }
  };

  const handleWorkoutTypeChange = (index: number, workoutTypeId: string) => {
    const selectedWorkout = workoutTypes.find(
      workout => workout.id === parseInt(workoutTypeId)
    );
    if (selectedWorkout && formState) {
      const newWorkouts = [...formState.workouts];
      newWorkouts[index] = {
        ...newWorkouts[index],
        workoutTypeName: selectedWorkout.name,
        targetMuscle: selectedWorkout.targetMuscle,
        weight: 0,
        rep: 0,
        sets: 0,
        time: 0,
        speed: 0,
      };
      setFormState(prev => (prev ? { ...prev, workouts: newWorkouts } : null));
    }
  };

  const addExercise = () => {
    if (formState) {
      setFormState(prev =>
        prev
          ? {
              ...prev,
              workouts: [...prev.workouts, initialFormState.workouts[0]],
            }
          : null
      );
    }
  };

  const removeExercise = (index: number) => {
    if (formState) {
      const newWorkouts = formState.workouts.filter((_, i) => i !== index);
      setFormState(prev => (prev ? { ...prev, workouts: newWorkouts } : null));
    }
  };

  const [errorAlert, setErrorAlert] = useState<string>('');

  const handleSave = () => {
    if (formState) {
      if (!formState.sessionDate) return setErrorAlert('날짜를 입력해주세요.');
      if (formState.sessionNumber <= 0)
        return setErrorAlert('회차를 입력해주세요.');
      if (formState.specialNote.trim() === '')
        return setErrorAlert('특이사항을 입력해주세요.');

      // Validate workouts
      for (let i = 0; i < formState.workouts.length; i++) {
        const workout = formState.workouts[i];
        const selectedWorkout = workoutTypes.find(
          type => type.name === workout.workoutTypeName
        );
        if (!selectedWorkout) {
          continue; // 운동 종류를 선택하지 않은 경우 에러 검사를 하지 않음
        }
        if (selectedWorkout.weightInputRequired && workout.weight <= 0) {
          return setErrorAlert('무게를 입력해주세요.');
        }
        if (selectedWorkout.setInputRequired && workout.sets <= 0) {
          return setErrorAlert('세트를 입력해주세요.');
        }
        if (selectedWorkout.repInputRequired && workout.rep <= 0) {
          return setErrorAlert('횟수를 입력해주세요.');
        }
        if (selectedWorkout.timeInputRequired && workout.time <= 0) {
          return setErrorAlert('시간을 입력해주세요.');
        }
        if (selectedWorkout.speedInputRequired && workout.speed <= 0) {
          return setErrorAlert('속도를 입력해주세요.');
        }
      }

      onSave(formState);
      setFormState(initialFormState);
      onClose();
    }
  };

  const handleClose = () => {
    setFormState(initialFormState);
    onClose();
  };

  const onCloseErrorAlert = () => setErrorAlert('');

  return (
    <Modal
      title="운동 기록 수정"
      type="custom"
      isOpen={isOpen}
      onClose={handleClose}
      onSave={handleSave}
      btnConfirm="저장"
    >
      <FormGroup>
        <Label>날짜:</Label>
        <DatePickerWrapper className="dateWrap">
          <DatePicker
            selected={formState ? new Date(formState.sessionDate) : new Date()}
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
          value={formState ? formState.sessionNumber : 0}
          onChange={e =>
            handleInputChange('sessionNumber', parseInt(e.target.value))
          }
        />
      </FormGroup>
      <FormGroup>
        <Label>특이사항:</Label>
        <TextArea
          value={formState ? formState.specialNote : ''}
          onChange={e => handleInputChange('specialNote', e.target.value)}
        />
      </FormGroup>
      <FormGroup>
        <WorkoutSection>
          <Label>운동 종류 기록:</Label>
          {formState?.workouts.map((exercise, index) => {
            const selectedWorkout = workoutTypes.find(
              workout => workout.name === exercise.workoutTypeName
            );
            return (
              <ExerciseGroup key={index}>
                <ExerciseRow>
                  <Select
                    value={selectedWorkout ? selectedWorkout.id : ''}
                    onChange={e =>
                      handleWorkoutTypeChange(index, e.target.value)
                    }
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
                        <AttributeTabInput
                          type="number"
                          placeholder="무게"
                          value={exercise.weight || ''}
                          onChange={e =>
                            handleExerciseChange(
                              index,
                              'weight',
                              parseInt(e.target.value)
                            )
                          }
                        />
                      )}
                      {selectedWorkout.speedInputRequired && (
                        <AttributeTabInput
                          type="number"
                          placeholder="속도"
                          value={exercise.speed || ''}
                          onChange={e =>
                            handleExerciseChange(
                              index,
                              'speed',
                              parseInt(e.target.value)
                            )
                          }
                        />
                      )}
                      {selectedWorkout.timeInputRequired && (
                        <AttributeTabInput
                          type="number"
                          placeholder="시간"
                          value={exercise.time || ''}
                          onChange={e =>
                            handleExerciseChange(
                              index,
                              'time',
                              parseInt(e.target.value)
                            )
                          }
                        />
                      )}
                      {selectedWorkout.setInputRequired && (
                        <AttributeTabInput
                          type="number"
                          placeholder="세트"
                          value={exercise.sets || ''}
                          onChange={e =>
                            handleExerciseChange(
                              index,
                              'sets',
                              parseInt(e.target.value)
                            )
                          }
                        />
                      )}
                      {selectedWorkout.repInputRequired && (
                        <AttributeTabInput
                          type="number"
                          placeholder="횟수"
                          value={exercise.rep || ''}
                          onChange={e =>
                            handleExerciseChange(
                              index,
                              'rep',
                              parseInt(e.target.value)
                            )
                          }
                        />
                      )}
                    </AttributeGroup>
                  )}
                </ExerciseRow>
                <RemoveExerciseButton onClick={() => removeExercise(index)}>
                  삭제
                </RemoveExerciseButton>
              </ExerciseGroup>
            );
          })}
          <AddExerciseButton onClick={addExercise}>운동 추가</AddExerciseButton>
        </WorkoutSection>
      </FormGroup>
      {errorAlert && (
        <Alert $type="error" text={errorAlert} onClose={onCloseErrorAlert} />
      )}
    </Modal>
  );
};

export default EditSessionModal;
