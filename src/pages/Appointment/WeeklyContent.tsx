import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { format, parse } from 'date-fns';

import WeeklyCalendar from '@components/Appointment/WeeklyCalendar';
import ScheduleDetail from '@components/Appointment/ScheduleDetail';
import { SectionWrapper } from '@components/Common/SectionWrapper';
import useCalendarStore from 'src/stores/calendarStore';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const WeeklyContent: React.FC = () => {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const { setSelectedDate } = useCalendarStore();
  const initialDate = date ? parse(date, 'yyyy-MM-dd', new Date()) : new Date();
  const [currentDate, setCurrentDate] = useState<Date>(initialDate);

  const onDateChange = (date: Date) => {
    setCurrentDate(date);

    const formattedDate = format(date, 'yyyy-MM-dd');
    navigate(`/appointment/weekly/${formattedDate}`, { replace: true });
  };

  useEffect(() => {
    if (!date) return;

    const parsedDate = parse(date, 'yyyy-MM-dd', new Date());
    setSelectedDate(parsedDate);
  }, []);

  return (
    <SectionWrapper>
      <Wrapper>
        <WeeklyCalendar
          selectedDate={currentDate}
          onDateChange={onDateChange}
        />
        <ScheduleDetail selectedDate={currentDate} />
      </Wrapper>
    </SectionWrapper>
  );
};

export default WeeklyContent;
