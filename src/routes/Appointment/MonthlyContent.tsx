import React, { Fragment, useEffect, useState } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';

import Alert from '@components/Common/Alert/Alert';
import MonthlyCalendar from '@components/Appointment/Calendar/MonthlyCalendar';
import ButtonContainer from '@components/Appointment/ButtonContainer';
import TimeTableContainer from '@components/Appointment/TimeTableContainer';
import useSchedules from 'src/hooks/useSchedules';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const Divider = styled.div`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.gray300};
  width: 100%;
`;

const CompleteButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 0.5rem;
  font-size: 1.6rem;
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  width: 100%;
  white-space: nowrap;
  background-color: ${({ theme }) => theme.colors.gray700};
  border: none;

  &:active {
    background-color: ${({ theme }) => theme.colors.gray900};
  }
`;

interface MonthlyContentProps {
  onDateSelect: (date: Date) => void;
  initialDate: Date | null;
}

const MonthlyContent: React.FC<MonthlyContentProps> = ({
  onDateSelect,
  initialDate,
}) => {
  const { data, isLoading, error } = useSchedules();
  const [selectedButton, setSelectedButton] = useState<string | null>(null);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [errorAlert, setErrorAlert] = useState<string>('');

  useEffect(() => {
    if (selectedDates.length === 0) {
      setSelectedTimes([]);
    }
  }, [selectedDates]);

  const onButtonClick = (buttonType: string) => {
    setSelectedDates([]);

    setSelectedButton((prevSelectedButton) =>
      prevSelectedButton === buttonType ? null : buttonType
    );
  };

  const onDateClick = (date: Date) => {
    if (!selectedButton) {
      onDateSelect(date);
      return;
    }

    const formattedDate = format(date, 'yyyy-MM-dd');

    setSelectedDates((prevDates) =>
      prevDates.includes(formattedDate)
        ? prevDates.filter((date) => date !== formattedDate)
        : [...prevDates, formattedDate]
    );
  };

  const onTimeClick = (time: string) => {
    if (selectedButton && selectedDates.length === 0) {
      setErrorAlert('먼저 날짜를 선택해주세요.');
      return;
    }

    setSelectedTimes((prevTimes) =>
      prevTimes.includes(time)
        ? prevTimes.filter((t) => t !== time)
        : [...prevTimes, time]
    );
  };

  const onCloseErrorAlert = () => setErrorAlert('');

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Wrapper>
      <MonthlyCalendar
        data={data}
        selectedButton={selectedButton}
        selectedDates={selectedDates}
        initialDate={initialDate}
        onDateClick={onDateClick}
      />
      <ButtonContainer
        onButtonClick={onButtonClick}
        selectedButton={selectedButton}
      />

      {selectedButton && (
        <Fragment>
          <Divider />
          <TimeTableContainer
            selectedTimes={selectedTimes}
            onTimeClick={onTimeClick}
          />
          <CompleteButton>시간 선택 완료</CompleteButton>
        </Fragment>
      )}
      {errorAlert && (
        <Alert $type="error" text={errorAlert} onClose={onCloseErrorAlert} />
      )}
    </Wrapper>
  );
};

export default MonthlyContent;
