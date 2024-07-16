import React from 'react';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import Modal from '@components/Common/Modal/Modal';
import { InbodyData } from './Dashboard';

interface InbodyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  inbodyData: InbodyData;
  handleDateChange: (date: Date | null) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InfoGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Label = styled.label`
  font-size: 1.4rem;
  color: ${({ theme }) => theme.colors.gray900};
  width: 200px;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const Input = styled.input<{ $unit?: string }>`
  border: 1px solid ${({ theme }) => theme.colors.main500};
  border-radius: 5px;
  padding: 5px 10px;
  font-size: 1.4rem;
  color: ${({ theme }) => theme.colors.gray900};
  width: 100%;
  max-width: 220px;
  text-align: right;
  outline: none;
  ${({ $unit }) =>
    $unit &&
    `
    &::after {
      content: '${$unit}';
      margin-left: 5px;
    }
  `}
`;

const DatePickerWrapper = styled.div`
  width: 100%;

  .react-datepicker__calendar-icon {
    fill: ${({ theme }) => theme.colors.main600};
  }

  .react-datepicker-wrapper {
    width: 100%;
  }

  .react-datepicker__input-container {
    display: flex;
    align-items: center;
  }

  input {
    width: 100%;
    padding: 5px 10px 5px 25px;
    border-radius: 5px;
    border: 1px solid ${({ theme }) => theme.colors.main500};
    font-size: 1.4rem;
    color: ${({ theme }) => theme.colors.gray900};
    outline: none;
  }
`;

const InbodyModal: React.FC<InbodyModalProps> = ({
  isOpen,
  onClose,
  onSave,
  inbodyData,
  handleDateChange,
  handleInputChange,
}) => (
  <Modal
    title="인바디 추가"
    type="custom"
    isOpen={isOpen}
    onClose={onClose}
    onSave={onSave}
    btnConfirm="추가"
  >
    <InfoGroup>
      <InfoItem>
        <Label>측정 날짜</Label>
        <DatePickerWrapper>
          <DatePicker
            showIcon
            selected={inbodyData.date}
            onChange={handleDateChange}
            dateFormat="yyyy. MM. dd."
          />
        </DatePickerWrapper>
      </InfoItem>
      <InfoItem>
        <Label>몸무게(kg)</Label>
        <Input
          type="text"
          name="weight"
          value={inbodyData.weight}
          onChange={handleInputChange}
        />
      </InfoItem>
      <InfoItem>
        <Label>체지방률(%)</Label>
        <Input
          type="text"
          name="bodyFatPercentage"
          value={inbodyData.bodyFatPercentage}
          onChange={handleInputChange}
        />
      </InfoItem>
      <InfoItem>
        <Label>근골격량(kg)</Label>
        <Input
          type="text"
          name="muscleMass"
          value={inbodyData.muscleMass}
          onChange={handleInputChange}
        />
      </InfoItem>
    </InfoGroup>
  </Modal>
);

export default InbodyModal;
