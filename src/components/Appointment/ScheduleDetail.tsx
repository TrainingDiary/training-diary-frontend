import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';

import {
  ScheduleStatus,
  ScheduleType,
  scheduleList,
} from 'src/mocks/data/scheduleList';
import { generateTimes } from 'src/utils/generateTimes';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  position: relative;
`;

const ScheduleTable = styled.div`
  display: flex;
  gap: 10px;
`;

const TimeBox = styled.div`
  display: flex;
  gap: 12px;
`;

const Time = styled.span`
  color: ${({ theme }) => theme.colors.main900};
  font-size: 1.2rem;
  font-family: 'NanumSquareBold';
`;

const Dot = styled.span`
  margin-top: 8px;
  width: 4px;
  height: 4px;
  background-color: ${({ theme }) => theme.colors.main600};
  border-radius: 50%;
  z-index: 1;
`;

const InfoBox = styled.div<{
  status: ScheduleStatus;
}>`
  display: flex;
  align-items: center;
  flex: 1;
  height: 60px;
  padding: 0 10px;
  border-radius: 5px;
  border: 1px solid
    ${({ theme, status }) => {
      switch (status) {
        case 'PAST':
          return theme.colors.gray400;
        case 'EMPTY':
          return theme.colors.gray300;
        case 'OPEN':
        case 'RESERVE_APPLIED':
        case 'RESERVED':
          return theme.colors.gray200;
      }
    }};
  background-color: ${({ theme, status }) => {
    switch (status) {
      case 'PAST':
        return theme.colors.gray300;
      case 'EMPTY':
        return theme.colors.gray100;
      case 'OPEN':
      case 'RESERVE_APPLIED':
      case 'RESERVED':
        return theme.colors.white;
    }
  }};
`;

const Detail = styled.span<{
  status: ScheduleStatus;
}>`
  font-size: 1.4rem;
  font-family: 'NanumSquareBold';
  color: ${({ theme, status }) => {
    switch (status) {
      case 'PAST':
        return theme.colors.gray600;
      case 'EMPTY':
      case 'OPEN':
      case 'RESERVE_APPLIED':
      case 'RESERVED':
        return theme.colors.gray900;
    }
  }};
`;

const Divider = styled.div`
  width: 1px;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.gray400};
  position: absolute;
  left: 68px;
  z-index: 0;
`;

interface ScheduleDetailProps {
  selectedDate: Date;
}

const ScheduleDetail: React.FC<ScheduleDetailProps> = ({ selectedDate }) => {
  const [schedules, setSchedules] = useState<ScheduleType[]>([]);

  useEffect(() => {
    // selectedDate로 스케줄 상세 조회 API 요청 단계 추가

    setSchedules([scheduleList[2]]);
  }, [selectedDate]);

  const times = generateTimes();
  const now = new Date('2024-07-05T11:00:00'); // 추후 현재시간으로 수정

  const getScheduleDetail = (
    time: string
  ): { status: ScheduleStatus; detailText: string } => {
    let status: ScheduleStatus = 'EMPTY';
    let detailText: string = '';

    const schedule = schedules[0]?.details.find(
      (detail) => detail.startTime === time
    );

    const timeDate = new Date(
      `${format('2024-07-05', 'yyyy-MM-dd')}T${time}:00`
    );

    if (schedule) {
      status = schedule.status;
      detailText =
        schedule.status === 'OPEN'
          ? '-'
          : `${schedule.trainerName} - ${schedule.traineeName}`;
    }

    if (timeDate <= now) status = 'PAST';

    return {
      status,
      detailText,
    };
  };

  return (
    <Wrapper>
      {times.map((time, idx) => {
        const { status, detailText } = getScheduleDetail(time.shortTime);
        return (
          <ScheduleTable key={idx}>
            <TimeBox>
              <Time>{time.fullTime}</Time>
              <Dot />
            </TimeBox>
            <InfoBox status={status}>
              <Detail status={status}>{detailText}</Detail>
            </InfoBox>
          </ScheduleTable>
        );
      })}
      <Divider />
    </Wrapper>
  );
};
export default ScheduleDetail;
