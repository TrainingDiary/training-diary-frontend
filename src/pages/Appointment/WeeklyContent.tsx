import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { format, parse } from 'date-fns';

import WeeklyCalendar from '@components/Appointment/WeeklyCalendar';
import ScheduleDetail from '@components/Appointment/ScheduleDetail';
import { SectionWrapper } from '@components/Common/SectionWrapper';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const WeeklyContent: React.FC = () => {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const initialDate = date ? parse(date, 'yyyy-MM-dd', new Date()) : new Date();
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);

  const onDateChange = (date: Date) => {
    setSelectedDate(date);

    const formattedDate = format(date, 'yyyy-MM-dd');
    navigate(`/appointment/weekly/${formattedDate}`, { replace: true });
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
