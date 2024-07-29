import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';

import Modal from '@components/Common/Modal/Modal';
import Alert from '@components/Common/Alert/Alert';
import { DatePickerWrapper } from './Calendar';
import CreateTraineeApi from 'src/api/trainee';
import CreateTrainerApi from 'src/api/trainer';
import useUserStore from 'src/stores/userStore';

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: stretch;
  position: relative;

  .react-datepicker
    .react-datepicker__month-container
    .react-datepicker__header {
    background-color: ${({ theme }) => theme.colors.main600};
  }

  .dateWrap {
    max-width: 100%;
  }

  .fbVqIG .react-datepicker-popper {
    top: 110% !important;
  }

  .react-datepicker__navigation {
    top: 15px;

    .react-datepicker__navigation-icon::before {
      border-color: ${({ theme }) => theme.colors.white};
    }
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
    color: ${({ theme }) => theme.colors.white};
    padding: 10px;
  }

  .react-datepicker__day-name {
    color: ${({ theme }) => theme.colors.white};
    font-family: 'NanumSquareBold';
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

const SelectWrap = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: row;
  align-items: center;
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

export interface WorkoutsType {
  workoutTypeId: number;
  weight: string;
  speed: string;
  time: string;
  sets: string;
  rep: string;
}

export interface SessionDataType {
  traineeId: string | undefined;
  sessionDate: string | null;
  sessionNumber: number;
  specialNote: string;
  workouts: WorkoutsType[];
}

interface AddSessionModalProps {
  traineeId: string | undefined;
  isOpen: boolean;
  onClose: () => void;
  onSave: (session: SessionDataType) => void;
  formState: SessionDataType;
  setFormState: React.Dispatch<React.SetStateAction<SessionDataType>>;
  sessionAutoNumber: number;
}

const AddSessionModal: React.FC<AddSessionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  formState,
  setFormState,
  traineeId,
  sessionAutoNumber,
}) => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const traineeApi = CreateTraineeApi(navigate);
  const trainerApi = CreateTrainerApi(navigate);
  const [workoutTypes, setWorkoutTypes] = useState<
    {
      id: number;
      name: string;
      targetMuscle: string;
      remarks: string;
      weightInputRequired: boolean;
      repInputRequired: boolean;
      setInputRequired: boolean;
      timeInputRequired: boolean;
      speedInputRequired: boolean;
    }[]
  >([]);
  const initialFormState: SessionDataType = {
    traineeId: traineeId,
    sessionDate: format(new Date(), 'yyyy-MM-dd'),
    sessionNumber: sessionAutoNumber,
    specialNote: '',
    workouts: [
      {
        workoutTypeId: 0,
        weight: '',
        speed: '',
        time: '',
        sets: '',
        rep: '',
      },
    ],
  };

  useEffect(() => {
    const fetchWorkoutTypes = async () => {
      if (user?.role === 'TRAINER') {
        try {
          const response = await trainerApi.getWorkouts();
          setWorkoutTypes(response.data.content);
        } catch (error) {
          console.error('운동 종류 불러오기 실패:', error);
        }
      }
    };
    fetchWorkoutTypes();
  }, []);

  const handleInputChange = (field: keyof SessionDataType, value: string) => {
    setFormState(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDateChange = (date: Date | null) => {
    setFormState(prev => ({
      ...prev,
      sessionDate: date ? format(date, 'yyyy-MM-dd') : null,
    }));
  };

  const handleExerciseChange = (
    index: number,
    field: keyof WorkoutsType,
    value: string
  ) => {
    const newWorkouts = [...formState.workouts];
    newWorkouts[index] = {
      ...newWorkouts[index],
      [field]: value,
    };
    setFormState(prev => ({
      ...prev,
      workouts: newWorkouts,
    }));
  };

  const handleWorkoutTypeChange = (index: number, workoutTypeId: string) => {
    const selectedWorkout = workoutTypes.find(
      workout => workout.id === parseInt(workoutTypeId)
    );
    if (selectedWorkout) {
      const newWorkouts = [...formState.workouts];
      newWorkouts[index] = {
        ...newWorkouts[index],
        workoutTypeId: selectedWorkout.id,
        weight: '',
        speed: '',
        time: '',
        sets: '',
        rep: '',
      };
      setFormState(prev => ({
        ...prev,
        workouts: newWorkouts,
      }));
    }
  };

  const addExercise = () => {
    setFormState(prev => ({
      ...prev,
      workouts: [
        ...prev.workouts,
        {
          workoutTypeId: 0,
          weight: '',
          speed: '',
          time: '',
          sets: '',
          rep: '',
        },
      ],
    }));
  };

  const [errorAlert, setErrorAlert] = useState<string>('');

  const handleSave = async () => {
    if (formState.sessionDate === null)
      return setErrorAlert('날짜를 입력해주세요.');

    if (formState.sessionNumber === null || formState.sessionNumber === 0)
      return setErrorAlert('회차를 입력해주세요.');

    if (formState.specialNote.trim() === '')
      return setErrorAlert('특이사항을 입력해주세요.');

    if (formState.workouts.length === 0) {
      return setErrorAlert('운동 종류를 하나 이상 선택해주세요.');
    }

    // 운동 종류 기록 유효성 검사 로직
    for (let i = 0; i < formState.workouts.length; i++) {
      const workout = formState.workouts[i];
      const selectedWorkout = workoutTypes.find(
        type => type.id === workout.workoutTypeId
      );
      if (!selectedWorkout) {
        return setErrorAlert(`${i + 1}번째 운동 종류를 선택해주세요.`);
      }
      if (selectedWorkout.weightInputRequired && workout.weight.trim() === '') {
        return setErrorAlert(`무게를 입력해주세요.`);
      }
      if (selectedWorkout.setInputRequired && workout.sets.trim() === '') {
        return setErrorAlert(`세트를 입력해주세요.`);
      }
      if (selectedWorkout.repInputRequired && workout.rep.trim() === '') {
        return setErrorAlert(`횟수를 입력해주세요.`);
      }
      if (selectedWorkout.timeInputRequired && workout.time.trim() === '') {
        return setErrorAlert(`시간을 입력해주세요.`);
      }
      if (selectedWorkout.speedInputRequired && workout.speed.trim() === '') {
        return setErrorAlert(`속도를 입력해주세요.`);
      }
    }

    // 운동 기록 생성 API 호출
    try {
      const formData = {
        ...formState,
        sessionDate: formState.sessionDate
          ? format(formState.sessionDate, 'yyyy-MM-dd')
          : null,
      };
      const response = await traineeApi.addSession(formData);
      console.log('운동 기록 생성 성공:', response.data);
      onSave(formData);
      setFormState(initialFormState);
      onClose();
    } catch (error: any) {
      if (error.response.status === 409) {
        setErrorAlert('이미 존재하는 회차입니다.');
      } else {
        setErrorAlert('운동 기록 생성에 실패했습니다.');
      }
      console.error('운동 기록 생성 실패:', error);
    }
  };

  const handleClose = () => {
    setFormState(initialFormState);
    onClose();
  };

  const removeExercise = (index: number) => {
    const newWorkouts = formState.workouts.filter((_, i) => i !== index);
    setFormState(prev => ({
      ...prev,
      workouts: newWorkouts,
    }));
  };

  const onCloseErrorAlert = () => setErrorAlert('');

  return (
    <Modal
      title="운동 기록 추가"
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
            selected={
              formState.sessionDate ? new Date(formState.sessionDate) : null
            }
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
          value={formState.sessionNumber}
          onChange={e => handleInputChange('sessionNumber', e.target.value)}
        />
      </FormGroup>
      <FormGroup>
        <Label>특이사항:</Label>
        <TextArea
          value={formState.specialNote}
          onChange={e => handleInputChange('specialNote', e.target.value)}
        ></TextArea>
      </FormGroup>
      <FormGroup>
        <WorkoutSection>
          <Label>운동 종류 기록:</Label>
          {formState.workouts.map((exercise, index) => {
            const selectedWorkout = workoutTypes.find(
              workout => workout.id === exercise.workoutTypeId
            );
            return (
              <ExerciseGroup key={index}>
                <ExerciseRow>
                  <SelectWrap>
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
                    <RemoveExerciseButton onClick={() => removeExercise(index)}>
                      삭제
                    </RemoveExerciseButton>
                  </SelectWrap>
                  {selectedWorkout && (
                    <AttributeGroup>
                      {selectedWorkout.weightInputRequired && (
                        <AttributeTabInput
                          type="number"
                          placeholder="무게(kg)"
                          value={exercise.weight}
                          onChange={e =>
                            handleExerciseChange(
                              index,
                              'weight',
                              e.target.value
                            )
                          }
                        />
                      )}
                      {selectedWorkout.speedInputRequired && (
                        <AttributeTabInput
                          type="number"
                          placeholder="속도(m/s)"
                          value={exercise.speed}
                          onChange={e =>
                            handleExerciseChange(index, 'speed', e.target.value)
                          }
                        />
                      )}
                      {selectedWorkout.timeInputRequired && (
                        <AttributeTabInput
                          type="number"
                          placeholder="시간(초)"
                          value={exercise.time}
                          onChange={e =>
                            handleExerciseChange(index, 'time', e.target.value)
                          }
                        />
                      )}
                      {selectedWorkout.setInputRequired && (
                        <AttributeTabInput
                          type="number"
                          placeholder="세트(세트)"
                          value={exercise.sets}
                          onChange={e =>
                            handleExerciseChange(index, 'sets', e.target.value)
                          }
                        />
                      )}
                      {selectedWorkout.repInputRequired && (
                        <AttributeTabInput
                          type="number"
                          placeholder="횟수(회)"
                          value={exercise.rep}
                          onChange={e =>
                            handleExerciseChange(index, 'rep', e.target.value)
                          }
                        />
                      )}
                    </AttributeGroup>
                  )}
                </ExerciseRow>
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

export default AddSessionModal;
