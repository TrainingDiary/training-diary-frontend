import React from 'react';
import styled from 'styled-components';

import WeeklyCalendar from '@components/Appointment/Calendar/WeeklyCalendar';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

interface WeeklyContentProps {
  date?: Date | null;
}

const WeeklyContent: React.FC<WeeklyContentProps> = ({ date }) => {
  return (
    <Wrapper>
      <WeeklyCalendar date={date} />
    </Wrapper>
  );
};

export default WeeklyContent;
