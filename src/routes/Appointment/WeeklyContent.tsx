import React, { useState } from 'react';
import styled from 'styled-components';

import WeeklyCalendar from '@components/Appointment/WeeklyCalendar';
import ScheduleDetail from '@components/Appointment/ScheduleDetail';
import { SectionWrapper } from '@components/Common/SectionWrapper';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

interface WeeklyContentProps {
  date?: Date | null;
}

const WeeklyContent: React.FC<WeeklyContentProps> = ({ date }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(date || new Date());

  const onDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <SectionWrapper>
      <Wrapper>
        <WeeklyCalendar
          selectedDate={selectedDate}
          onDateChange={onDateChange}
        />
        <ScheduleDetail selectedDate={selectedDate} />
      </Wrapper>
    </SectionWrapper>
  );
};

export default WeeklyContent;
