import React from 'react';
import styled from 'styled-components';
import { format, isBefore, parse } from 'date-fns';

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

const Time = styled.div<{ $isSelected: boolean; disabled: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 10px;
  font-family: 'NanumSquareBold';
  font-size: 1.4rem;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  color: ${({ theme, $isSelected, disabled }) =>
    disabled
      ? theme.colors.gray500
      : $isSelected
        ? theme.colors.white
        : theme.colors.gray600};
  background-color: ${({ theme, $isSelected, disabled }) =>
    disabled
      ? theme.colors.gray300
      : $isSelected
        ? theme.colors.main500
        : theme.colors.gray100};
  border: 1px solid
    ${({ theme, $isSelected, disabled }) =>
      $isSelected || disabled ? 'none' : theme.colors.gray200};
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
  $disabled: boolean;
  onClick: () => void;
}

const TimeComponent: React.FC<TimeProps> = ({
  fullTime,
  shortTime,
  $isSelected,
  $disabled,
  onClick,
}) => (
  <Time
    $isSelected={$isSelected}
    disabled={$disabled}
    onClick={!$disabled ? onClick : undefined}
  >
    <span className="full-time">{fullTime}</span>
    <span className="short-time">{shortTime}</span>
  </Time>
);

interface TimeTableContainerProps {
  reservedAndAppliedDates: { startDate: string; notAllowedTimes: string[] }[];
  selectedButton: string | null;
  selectedDates: string[];
  selectedTimes: string[];
  onTimeClick: (time: string) => void;
}

const TimeTableContainer: React.FC<TimeTableContainerProps> = ({
  reservedAndAppliedDates,
  selectedButton,
  selectedDates,
  selectedTimes,
  onTimeClick,
}) => {
  const times = generateTimes();
  const today = format(new Date(), 'yyyy-MM-dd');

  const isTimeDisabled = (
    selectedButton: string | null,
    selectedDates: string[],
    reservedAndAppliedDates: { startDate: string; notAllowedTimes: string[] }[],
    time: string,
    today: string
  ) => {
    return (
      selectedButton === 'register' &&
      selectedDates.some(selectedDate => {
        const reserved = reservedAndAppliedDates.find(
          date => date.startDate === selectedDate
        );
        return (
          reserved?.notAllowedTimes.includes(time) ||
          (selectedDate === today &&
            isBefore(parse(time, 'HH:mm', new Date()), new Date()))
        );
      })
    );
  };

  return (
    <Wrapper>
      <Text>선택 가능 시간</Text>
      <TimeTable>
        {times.map((time, index) => {
          const isDisabled = isTimeDisabled(
            selectedButton,
            selectedDates,
            reservedAndAppliedDates,
            time.shortTime,
            today
          );

          const isSelected = selectedTimes.includes(time.shortTime);

          return (
            <TimeComponent
              key={index}
              fullTime={time.fullTime}
              shortTime={time.shortTime}
              $isSelected={isSelected}
              $disabled={isDisabled}
              onClick={() => onTimeClick(time.shortTime)}
            />
          );
        })}
      </TimeTable>
    </Wrapper>
  );
};

export default TimeTableContainer;
