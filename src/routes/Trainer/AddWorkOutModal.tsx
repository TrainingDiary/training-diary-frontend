import React from 'react';
import styled from 'styled-components';

import Modal from '@components/Common/Modal/Modal';
import { WorkoutDataType } from './WorkOutManagement';

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
  font-family: 'NanumSquare', 'NotoSans KR', system-ui, -apple-system,
    BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
    'Open Sans', 'Helvetica Neue', sans-serif;
  resize: none;
  max-height: 90px;
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
  formState: {
    name: string;
    targetMuscle: string;
    remark: string;
    attributes: {
      weight: boolean;
      set: boolean;
      rep: boolean;
      time: boolean;
      speed: boolean;
    };
  };
  setFormState: React.Dispatch<
    React.SetStateAction<{
      name: string;
      targetMuscle: string;
      remark: string;
      attributes: {
        weight: boolean;
        set: boolean;
        rep: boolean;
        time: boolean;
        speed: boolean;
      };
    }>
  >;
}

const AddWorkOutModal: React.FC<AddWorkOutModalProps> = ({
  isOpen,
  onClose,
  onSave,
  formState,
  setFormState,
}) => {
  const handleInputChange = (field: string, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAttributeChange = (attr: keyof typeof formState.attributes) => {
    setFormState((prev) => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [attr]: !prev.attributes[attr],
      },
    }));
  };

  const handleSave = () => {
    const newWorkout: WorkoutDataType = {
      id: Date.now(), // 임시 ID 할당
      name: formState.name,
      target_muscle: formState.targetMuscle,
      remark: formState.remark,
      weight_input_required: formState.attributes.weight,
      set_input_required: formState.attributes.set,
      rep_input_required: formState.attributes.rep,
      time_input_required: formState.attributes.time,
      speed_input_required: formState.attributes.speed,
    };
    onSave(newWorkout);
    onClose();
  };

  return (
    <Modal
      title={formState.name ? '운동 종류 수정' : '운동 종류 추가'}
      type="custom"
      isOpen={isOpen}
      onClose={onClose}
      onSave={handleSave}
      btnConfirm={formState.name ? '수정' : '추가'}
    >
      <FormGroup>
        <Label>운동명:</Label>
        <Input
          type="text"
          value={formState.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
        />
      </FormGroup>
      <FormGroup>
        <Label>주요 자극 부위:</Label>
        <Input
          type="text"
          value={formState.targetMuscle}
          onChange={(e) => handleInputChange('targetMuscle', e.target.value)}
        />
      </FormGroup>
      <FormGroup>
        <Label>주의사항 노트:</Label>
        <TextArea
          value={formState.remark}
          onChange={(e) => handleInputChange('remark', e.target.value)}
        ></TextArea>
      </FormGroup>
      <FormGroup>
        <Label>속성 값:</Label>
        <CheckboxGroup>
          {Object.keys(formState.attributes).map((attr) => (
            <CheckboxLabel
              key={attr}
              className={
                formState.attributes[attr as keyof typeof formState.attributes]
                  ? 'selected'
                  : ''
              }
            >
              <input
                type="checkbox"
                checked={
                  formState.attributes[
                    attr as keyof typeof formState.attributes
                  ]
                }
                onChange={() =>
                  handleAttributeChange(
                    attr as keyof typeof formState.attributes
                  )
                }
              />
              {attr === 'weight' && '무게'}
              {attr === 'set' && '세트'}
              {attr === 'rep' && '횟수'}
              {attr === 'time' && '시간'}
              {attr === 'speed' && '속도'}
            </CheckboxLabel>
          ))}
        </CheckboxGroup>
      </FormGroup>
    </Modal>
  );
};

export default AddWorkOutModal;
