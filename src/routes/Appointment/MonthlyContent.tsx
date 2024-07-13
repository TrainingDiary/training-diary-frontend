import React, { Fragment, useState } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';

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

const MonthlyContent: React.FC = () => {
  const { data, isLoading, error } = useSchedules();
  const [selectedButton, setSelectedButton] = useState<string | null>(null);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);

  const handleButtonClick = (buttonType: string) => {
    setSelectedDates([]);

    setSelectedButton((prevSelectedButton) =>
      prevSelectedButton === buttonType ? null : buttonType
    );
  };

  const handleDateClick = (date: Date) => {
    if (!selectedButton) return;
    const formattedDate = format(date, 'yyyy-MM-dd');

    setSelectedDates((prevDates) =>
      prevDates.includes(formattedDate)
        ? prevDates.filter((date) => date !== formattedDate)
        : [...prevDates, formattedDate]
    );
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Wrapper>
      <MonthlyCalendar
        data={data}
        selectedButton={selectedButton}
        selectedDates={selectedDates}
        onDateClick={handleDateClick}
      />
      <ButtonContainer
        onButtonClick={handleButtonClick}
        selectedButton={selectedButton}
      />

      {selectedButton && (
        <Fragment>
          <Divider />
          <TimeTableContainer />
          <CompleteButton>시간 선택 완료</CompleteButton>
        </Fragment>
      )}
    </Wrapper>
  );
};

export default MonthlyContent;
