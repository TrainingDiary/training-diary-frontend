import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';

import {
  ScheduleStatus,
  ScheduleType,
  scheduleList,
} from 'src/mocks/data/scheduleList';
import { generateTimes } from 'src/utils/generateTimes';
import useModals from 'src/hooks/useModals';
import Modal from '@components/Common/Modal/Modal';

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
  gap: 12.5px;
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
  justify-content: space-between;
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

const ButtonBox = styled.div`
  display: flex;
  justify-content: right;
  gap: 10px;
  width: 170px;

  @media (max-width: 410px) {
    width: auto;
  }
`;

const StatusButton = styled.button<{ status: ScheduleStatus }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 0.5rem;
  font-size: 1.6rem;
  cursor: pointer;
  width: 100%;
  max-width: 80px;
  white-space: nowrap;
  background-color: ${({ theme, status }) => {
    switch (status) {
      case 'PAST':
        return;
      case 'EMPTY':
        return theme.colors.main500;
      case 'OPEN':
        return theme.colors.gray700;
      case 'RESERVE_APPLIED':
        return theme.colors.main500;
      case 'RESERVED':
        return theme.colors.gray100;
    }
  }};
  color: ${({ theme, status }) => {
    switch (status) {
      case 'PAST':
        return;
      case 'EMPTY':
      case 'OPEN':
      case 'RESERVE_APPLIED':
        return theme.colors.white;
      case 'RESERVED':
        return theme.colors.gray600;
    }
  }};
  border: ${({ theme, status }) => {
    switch (status) {
      case 'PAST':
        return;
      case 'EMPTY':
      case 'OPEN':
      case 'RESERVE_APPLIED':
        return 'none';
      case 'RESERVED':
        return `1px solid ${theme.colors.gray300}`;
    }
  }};

  &:active {
    background-color: ${({ theme, status }) => {
      switch (status) {
        case 'PAST':
          return;
        case 'EMPTY':
          return theme.colors.main700;
        case 'OPEN':
          return theme.colors.gray900;
        case 'RESERVE_APPLIED':
          return theme.colors.main700;
        case 'RESERVED':
          return theme.colors.gray300;
      }
    }};
    color: ${({ theme }) => theme.colors.white};
  }
`;

const RejectButton = styled(StatusButton)`
  background-color: ${({ theme }) => theme.colors.red400};
  color: ${({ theme }) => theme.colors.white};

  &:active {
    background-color: ${({ theme }) => theme.colors.red600};
  }
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
  const { openModal, closeModal, isOpen } = useModals();
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

  const getButtonText = (status: ScheduleStatus) => {
    switch (status) {
      case 'PAST':
        return;
      case 'EMPTY':
        return '오픈';
      case 'OPEN':
        return '닫기';
      case 'RESERVE_APPLIED':
        return '확정';
      case 'RESERVED':
        return '취소';
    }
  };

  const handleModal = (
    status: ScheduleStatus,
    action: 'open' | 'close' | 'save'
  ) => {
    const modalTypeMap: Record<ScheduleStatus, string> = {
      PAST: '',
      EMPTY: 'openModal',
      OPEN: 'closeModal',
      RESERVE_APPLIED: 'confirmModal',
      RESERVED: 'cancelModal',
    };

    const modalType = modalTypeMap[status];

    if (modalType) {
      switch (action) {
        case 'open':
          openModal(modalType);
          break;
        case 'close':
          closeModal(modalType);
          break;
        case 'save':
          // 각 버튼에 맞는 API 요청 단계 추가
          closeModal(modalType);
          break;
      }
    }
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
              {status !== 'PAST' && (
                <ButtonBox>
                  <StatusButton
                    status={status}
                    onClick={() => handleModal(status, 'open')}
                  >
                    {getButtonText(status)}
                  </StatusButton>
                  {status === 'RESERVE_APPLIED' && (
                    <RejectButton
                      status={status}
                      onClick={() => openModal('rejectModal')}
                    >
                      거절
                    </RejectButton>
                  )}
                </ButtonBox>
              )}
            </InfoBox>
          </ScheduleTable>
        );
      })}
      <Divider />
      <Modal
        title="수업일 오픈"
        type="confirm"
        isOpen={isOpen('openModal')}
        onClose={() => handleModal('EMPTY', 'close')}
        onSave={() => handleModal('EMPTY', 'save')}
        btnConfirm="저장"
      >
        선택한 시간에 수업을 오픈할까요?
      </Modal>
      <Modal
        title="수업일 닫기"
        type="confirm"
        isOpen={isOpen('closeModal')}
        onClose={() => handleModal('OPEN', 'close')}
        onSave={() => handleModal('OPEN', 'save')}
        btnConfirm="저장"
      >
        선택한 시간에 수업을 닫을까요?
      </Modal>
      <Modal
        title="수업 취소"
        type="confirm"
        isOpen={isOpen('cancelModal')}
        onClose={() => handleModal('RESERVED', 'close')}
        onSave={() => handleModal('RESERVED', 'save')}
        btnConfirm="저장"
      >
        선택한 시간에 수업을 취소할까요?
      </Modal>
      <Modal
        title="수업 확정"
        type="confirm"
        isOpen={isOpen('confirmModal')}
        onClose={() => handleModal('RESERVE_APPLIED', 'close')}
        onSave={() => handleModal('RESERVE_APPLIED', 'save')}
        btnConfirm="저장"
      >
        선택한 시간에 수업을 확정할까요?
      </Modal>
      <Modal
        title="수업 거절"
        type="confirm"
        isOpen={isOpen('rejectModal')}
        onClose={() => closeModal('rejectModal')}
        onSave={() => closeModal('rejectModal')}
        btnConfirm="저장"
      >
        선택한 시간에 수업을 거절할까요?
      </Modal>
    </Wrapper>
  );
};
export default ScheduleDetail;
