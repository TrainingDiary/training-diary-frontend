import React from 'react';
import styled from 'styled-components';

import { generateTimes } from 'src/utils/generateTimes';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Text = styled.span`
  font-family: 'NanumSquareBold';
  font-size: 1.4rem;
  color: ${({ theme }) => theme.colors.gray900};
`;

const TimeTable = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(5, 1fr);
  gap: 10px;
`;

const Time = styled.div`
  display: flex;
  justify-content: center;
  padding: 5px 10px;
  font-family: 'NanumSquareBold';
  font-size: 1.4rem;
  color: ${({ theme }) => theme.colors.gray600};
  background-color: ${({ theme }) => theme.colors.gray100};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: 5px;

  .full-time {
    display: inline;
  }

  .short-time {
    display: none;
  }

  @media (max-width: 450px) {
    .full-time {
      display: none;
    }

    .short-time {
      display: inline;
    }
  }
`;

interface TimeProps {
  fullTime: string;
  shortTime: string;
}

const TimeComponent: React.FC<TimeProps> = ({ fullTime, shortTime }) => (
  <Time>
    <span className="full-time">{fullTime}</span>
    <span className="short-time">{shortTime}</span>
  </Time>
);

const TimeTableContainer: React.FC = () => {
  const times = generateTimes();

  return (
    <Wrapper>
      <Text>선택 가능 시간</Text>
      <TimeTable>
        {times.map((time, index) => (
          <TimeComponent
            key={index}
            fullTime={time.fullTime}
            shortTime={time.shortTime}
          />
        ))}
      </TimeTable>
    </Wrapper>
  );
};

export default TimeTableContainer;
