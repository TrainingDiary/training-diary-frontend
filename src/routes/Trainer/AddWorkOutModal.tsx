import React, { useState, useEffect } from 'react';
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
  initialData?: WorkoutDataType | null; // 기존 데이터를 받을 수 있도록 수정
}

const AddWorkOutModal: React.FC<AddWorkOutModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData = null, // 기본값을 null로 설정
}) => {
  const [name, setName] = useState('');
  const [targetMuscle, setTargetMuscle] = useState('');
  const [remark, setRemark] = useState('');
  const [attributes, setAttributes] = useState({
    weight: false,
    set: false,
    rep: false,
    time: false,
    speed: false,
  });

  // 모달이 열릴 때 초기 데이터를 설정
  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setTargetMuscle(initialData.target_muscle);
      setRemark(initialData.remark);
      setAttributes({
        weight: initialData.weight_input_required,
        set: initialData.set_input_required,
        rep: initialData.rep_input_required,
        time: initialData.time_input_required,
        speed: initialData.speed_input_required,
      });
    } else {
      // 초기화
      setName('');
      setTargetMuscle('');
      setRemark('');
      setAttributes({
        weight: false,
        set: false,
        rep: false,
        time: false,
        speed: false,
      });
    }
  }, [initialData]);

  const handleAttributeChange = (attr: keyof typeof attributes) => {
    setAttributes((prev) => ({ ...prev, [attr]: !prev[attr] }));
  };

  const handleSave = () => {
    const newWorkout: WorkoutDataType = {
      id: initialData?.id || Date.now(), // 임시 ID 또는 기존 ID 사용
      name,
      target_muscle: targetMuscle,
      remark,
      weight_input_required: attributes.weight,
      set_input_required: attributes.set,
      rep_input_required: attributes.rep,
      time_input_required: attributes.time,
      speed_input_required: attributes.speed,
    };
    onSave(newWorkout);
    onClose();
  };

  return (
    <Modal
      title={initialData ? '운동 종류 수정' : '운동 종류 추가'}
      type="custom"
      isOpen={isOpen}
      onClose={onClose}
      onSave={handleSave}
      btnConfirm={initialData ? '수정' : '추가'}
    >
      <FormGroup>
        <Label>운동명:</Label>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </FormGroup>
      <FormGroup>
        <Label>주요 자극 부위:</Label>
        <Input
          type="text"
          value={targetMuscle}
          onChange={(e) => setTargetMuscle(e.target.value)}
        />
      </FormGroup>
      <FormGroup>
        <Label>주의사항 노트:</Label>
        <TextArea
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
        ></TextArea>
      </FormGroup>
      <FormGroup>
        <Label>속성 값:</Label>
        <CheckboxGroup>
          {Object.keys(attributes).map((attr) => (
            <CheckboxLabel
              key={attr}
              className={
                attributes[attr as keyof typeof attributes] ? 'selected' : ''
              }
            >
              <input
                type="checkbox"
                checked={attributes[attr as keyof typeof attributes]}
                onChange={() =>
                  handleAttributeChange(attr as keyof typeof attributes)
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
