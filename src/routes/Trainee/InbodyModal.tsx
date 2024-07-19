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
  position: relative;
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
  max-width: 220px;

  .react-datepicker-wrapper {
    width: 100%;
  }

  .datePicker {
    border: 1px solid ${({ theme }) => theme.colors.main500};
    background-color: ${({ theme }) => theme.colors.white};
    border-radius: 5px;
    padding: 5px 10px;
    font-size: 1.4rem;
    color: ${({ theme }) => theme.colors.gray900};
    width: 100%;
    text-align: right;
    outline: none;
    transition: border-color 0.3s;
  }

  .react-datepicker-popper[data-placement^='bottom']
    .react-datepicker__triangle {
    fill: #d2f1e7;
    color: #d2f1e7;
    left: 80% !important;
  }

  .react-datepicker-popper {
    width: 100%;
    transform: none !important;
    top: calc(100% + 15px) !important;
  }

  .react-datepicker {
    font-family: 'NanumSquare';
    width: 100%;
    border-radius: 5px;
    border: solid 1px ${({ theme }) => theme.colors.gray400};

    .react-datepicker__month-container {
      width: 100%;

      .react-datepicker__header {
        background-color: ${({ theme }) => theme.colors.main300};
        padding: 8px;

        .react-datepicker__day-names {
          margin: 8px 0 0;
          display: flex;
          justify-content: space-between;
          font-size: 1.2rem;
        }
      }

      .react-datepicker__month {
        margin: 10px 8px;
        display: flex;
        flex-direction: column;
        gap: 10px;

        .react-datepicker__day--outside-month {
          color: ${({ theme }) => theme.colors.gray500};
        }

        .react-datepicker__week {
          display: flex;
          justify-content: space-between;

          .react-datepicker__day--today {
            color: ${({ theme }) => theme.colors.main900};
          }

          .react-datepicker__day {
            font-size: 1.2rem;
            padding: 3px;
            line-height: 1;
            display: flex;
            justify-content: center;
          }

          .react-datepicker__day--selected {
            color: ${({ theme }) => theme.colors.white} !important;
          }
        }
      }
    }
  }

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
          type="number"
          name="weight"
          value={inbodyData.weight}
          onChange={handleInputChange}
        />
      </InfoItem>
      <InfoItem>
        <Label>체지방률(%)</Label>
        <Input
          type="number"
          name="bodyFatPercentage"
          value={inbodyData.bodyFatPercentage}
          onChange={handleInputChange}
        />
      </InfoItem>
      <InfoItem>
        <Label>근골격량(kg)</Label>
        <Input
          type="number"
          name="muscleMass"
          value={inbodyData.muscleMass}
          onChange={handleInputChange}
        />
      </InfoItem>
    </InfoGroup>
  </Modal>
);

export default InbodyModal;
