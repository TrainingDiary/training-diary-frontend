import React from 'react';
import styled from 'styled-components';

import { generateTimes } from 'src/utils/generateTimes';
import { hexToRgba } from 'src/utils/hexToRgba';

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

const Time = styled.div<{ $isSelected: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 10px;
  font-family: 'NanumSquareBold';
  font-size: 1.4rem;
  color: ${({ theme, $isSelected }) =>
    $isSelected ? theme.colors.white : theme.colors.gray600};
  background-color: ${({ theme, $isSelected }) =>
    $isSelected ? theme.colors.main500 : theme.colors.gray100};
  border: 1px solid
    ${({ theme, $isSelected }) => ($isSelected ? 'none' : theme.colors.gray200)};
  border-radius: 5px;
  box-shadow: ${({ theme, $isSelected }) =>
    $isSelected
      ? `0 3px 2px ${hexToRgba(theme.colors.gray600, 0.25)}`
      : 'none'};

  .full-time {
    display: inline;
  }

  .short-time {
    display: none;
  }

  @media ${({ theme }) => theme.media.tablet},
    ${({ theme }) => theme.media.mobile} {
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
  $isSelected: boolean;
  onClick: () => void;
}

const TimeComponent: React.FC<TimeProps> = ({
  fullTime,
  shortTime,
  $isSelected,
  onClick,
}) => (
  <Time $isSelected={$isSelected} onClick={onClick}>
    <span className="full-time">{fullTime}</span>
    <span className="short-time">{shortTime}</span>
  </Time>
);

interface TimeTableContainerProps {
  selectedTimes: string[];
  onTimeClick: (time: string) => void;
}

const TimeTableContainer: React.FC<TimeTableContainerProps> = ({
  selectedTimes,
  onTimeClick,
}) => {
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
            $isSelected={selectedTimes.includes(time.shortTime)}
            onClick={() => onTimeClick(time.shortTime)}
          />
        ))}
      </TimeTable>
    </Wrapper>
  );
};

export default TimeTableContainer;
