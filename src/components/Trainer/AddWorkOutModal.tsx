// AddWorkOutModal.tsx
import React from 'react';
import styled from 'styled-components';
import Modal from '@components/Common/Modal/Modal';
import { WorkoutDataType } from '@pages/Trainer/WorkOutManagement';

// 스타일 정의
const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
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

const CheckboxGroup = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 5px;
  color: ${({ theme }) => theme.colors.gray600};
  background-color: ${({ theme }) => theme.colors.gray100};
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;

  input {
    display: none;
  }

  &.selected {
    background-color: ${({ theme }) => theme.colors.main400};
    color: ${({ theme }) => theme.colors.white};
  }
`;

interface AddWorkOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (workout: WorkoutDataType) => void;
  onEdit: (workout: WorkoutDataType) => void;
  formState: WorkoutDataType;
  setFormState: React.Dispatch<React.SetStateAction<WorkoutDataType>>;
}

const AddWorkOutModal: React.FC<AddWorkOutModalProps> = ({
  isOpen,
  onClose,
  onSave,
  formState,
  setFormState,
}) => {
  const handleInputChange = (field: string, value: string) => {
    setFormState(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAttributeChange = (attr: keyof WorkoutDataType) => {
    setFormState(prev => ({
      ...prev,
      [attr]: !prev[attr],
    }));
  };

  const handleSave = () => {
    const newWorkout: WorkoutDataType = {
      ...formState,
      id: formState.id || Date.now(), // 새로 추가하는 경우에만 임시 ID 할당
    };
    onSave(newWorkout);
    onClose();
  };

  return (
    <Modal
      title={formState.id ? '운동 종류 수정' : '운동 종류 추가'}
      type="custom"
      isOpen={isOpen}
      onClose={onClose}
      onSave={handleSave}
      btnConfirm={formState.id ? '수정' : '추가'}
    >
      <FormGroup>
        <Label>운동명:</Label>
        <Input
          type="text"
          value={formState.name}
          onChange={e => handleInputChange('name', e.target.value)}
        />
      </FormGroup>
      <FormGroup>
        <Label>주요 자극 부위:</Label>
        <Input
          type="text"
          value={formState.targetMuscle}
          onChange={e => handleInputChange('targetMuscle', e.target.value)}
        />
      </FormGroup>
      <FormGroup>
        <Label>주의사항 노트:</Label>
        <TextArea
          value={formState.remarks}
          onChange={e => handleInputChange('remarks', e.target.value)}
        ></TextArea>
      </FormGroup>
      <FormGroup>
        <Label>속성 값:</Label>
        <CheckboxGroup>
          {[
            'weightInputRequired',
            'setInputRequired',
            'repInputRequired',
            'timeInputRequired',
            'speedInputRequired',
          ].map(attr => (
            <CheckboxLabel
              key={attr}
              className={
                formState[attr as keyof WorkoutDataType] ? 'selected' : ''
              }
            >
              <input
                type="checkbox"
                checked={formState[attr as keyof WorkoutDataType]}
                onChange={() =>
                  handleAttributeChange(attr as keyof WorkoutDataType)
                }
              />
              {attr === 'weightInputRequired' && '무게'}
              {attr === 'setInputRequired' && '세트'}
              {attr === 'repInputRequired' && '횟수'}
              {attr === 'timeInputRequired' && '시간'}
              {attr === 'speedInputRequired' && '속도'}
            </CheckboxLabel>
          ))}
        </CheckboxGroup>
      </FormGroup>
    </Modal>
  );
};

export default AddWorkOutModal;
