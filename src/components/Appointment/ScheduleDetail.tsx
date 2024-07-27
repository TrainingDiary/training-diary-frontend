import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { format } from 'date-fns';
import { useQuery } from 'react-query';

import Modal from '@components/Common/Modal/Modal';
import Alert from '@components/Common/Alert/Alert';
import { generateTimes } from 'src/utils/generateTimes';
import useModals from 'src/hooks/useModals';
import CreateAppointmentApi from 'src/api/appointment';
import useUserStore from 'src/stores/userStore';

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
  align-items: center;
`;

const Time = styled.span`
  color: ${({ theme }) => theme.colors.main900};
  font-size: 1.2rem;
  font-family: 'NanumSquareBold';
`;

const Dot = styled.span`
  width: 4px;
  height: 4px;
  background-color: ${({ theme }) => theme.colors.main600};
  border-radius: 50%;
  z-index: 1;
`;

const InfoBox = styled.div<{
  $status: ScheduleStatus;
}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  height: 50px;
  padding: 0 10px;
  border-radius: 5px;
  border: 1px solid
    ${({ theme, $status }) => {
      switch ($status) {
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
  background-color: ${({ theme, $status }) => {
    switch ($status) {
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
  $status: ScheduleStatus;
}>`
  font-size: 1.4rem;
  font-family: 'NanumSquareBold';
  color: ${({ theme, $status }) => {
    switch ($status) {
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

const ButtonBox = styled.div<{ role?: string }>`
  display: flex;
  justify-content: right;
  gap: 10px;
  width: 170px;

  ${({ role }) =>
    role === 'TRAINER' &&
    `
    @media (max-width: 410px) {
      width: auto;
    }
  `}
`;

const StatusButton = styled.button<{ $status: ScheduleStatus; role?: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 0.5rem;
  font-size: 1.4rem;
  cursor: pointer;
  width: 100%;
  max-width: 80px;
  white-space: nowrap;
  background-color: ${({ theme, $status, role }) => {
    if (role === 'TRAINER') {
      switch ($status) {
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
    } else if (role === 'TRAINEE') {
      switch ($status) {
        case 'PAST':
        case 'EMPTY':
          return;
        case 'OPEN':
          return theme.colors.main500;
        case 'RESERVE_APPLIED':
          return theme.colors.gray100;
        case 'RESERVED':
          return theme.colors.red400;
      }
    }
  }};
  color: ${({ theme, $status, role }) => {
    if (role === 'TRAINER') {
      switch ($status) {
        case 'PAST':
          return;
        case 'EMPTY':
        case 'OPEN':
        case 'RESERVE_APPLIED':
          return theme.colors.white;
        case 'RESERVED':
          return theme.colors.gray600;
      }
    } else if (role === 'TRAINEE') {
      switch ($status) {
        case 'PAST':
        case 'EMPTY':
          return;
        case 'OPEN':
          return theme.colors.white;
        case 'RESERVE_APPLIED':
          return theme.colors.gray600;
        case 'RESERVED':
          return theme.colors.white;
      }
    }
  }};
  border: ${({ theme, $status, role }) => {
    if (role === 'TRAINER') {
      switch ($status) {
        case 'PAST':
          return;
        case 'EMPTY':
        case 'OPEN':
        case 'RESERVE_APPLIED':
          return 'none';
        case 'RESERVED':
          return `1px solid ${theme.colors.gray300}`;
      }
    } else if (role === 'TRAINEE') {
      switch ($status) {
        case 'PAST':
        case 'EMPTY':
          return;
        case 'OPEN':
          return 'none';
        case 'RESERVE_APPLIED':
          return `1px solid ${theme.colors.gray300}`;
        case 'RESERVED':
          return 'none';
      }
    }
  }};

  &:active {
    background-color: ${({ theme, $status, role }) => {
      if (role === 'TRAINER') {
        switch ($status) {
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
      } else if (role === 'TRAINEE') {
        switch ($status) {
          case 'PAST':
          case 'EMPTY':
            return;
          case 'OPEN':
            return theme.colors.main700;
          case 'RESERVE_APPLIED':
            return theme.colors.gray300;
          case 'RESERVED':
            return theme.colors.red600;
        }
      }
    }};
    color: ${({ theme }) => theme.colors.white};
  }
`;

const RejectButton = styled(StatusButton)`
  background-color: ${({ theme }) => theme.colors.red400};
  border: none;
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

export type ScheduleStatus =
  | 'PAST'
  | 'EMPTY'
  | 'OPEN'
  | 'RESERVE_APPLIED'
  | 'RESERVED';

export interface ScheduleDetailType {
  scheduleId: number;
  startTime: string;
  trainerId: number;
  trainerName: string;
  traineeId: number | null;
  traineeName: string | null;
  scheduleStatus: ScheduleStatus;
}

export interface ScheduleType {
  startDate: string;
  existReserved: boolean;
  details: ScheduleDetailType[];
}

interface ScheduleDetailProps {
  selectedDate: Date;
}

const ScheduleDetail: React.FC<ScheduleDetailProps> = ({ selectedDate }) => {
  const { user } = useUserStore();
  const navigate = useNavigate();
  const AppointmentApi = CreateAppointmentApi(navigate);
  const { openModal, closeModal, isOpen } = useModals();
  const [schedules, setSchedules] = useState<ScheduleType[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [errorAlert, setErrorAlert] = useState<string>('');

  const fetchSchedules = async () => {
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    const response = await AppointmentApi.getSchedules(
      formattedDate,
      formattedDate
    );
    return response?.data;
  };

  const { data, error, isLoading, refetch } = useQuery(
    ['schedules', selectedDate],
    fetchSchedules,
    {
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    refetch();
  }, [selectedDate, refetch]);

  useEffect(() => {
    if (data) {
      setSchedules(data);
    }
  }, [data]);

  const times = generateTimes();
  const now = new Date();

  const getScheduleDetail = (
    time: string
  ): { $status: ScheduleStatus; detailText: string; scheduleId?: number } => {
    let $status: ScheduleStatus = 'EMPTY';
    let detailText: string = '';
    let scheduleId: number | undefined;

    const schedule = schedules[0]?.details.find(
      detail => detail.startTime === time
    );

    const timeDate = new Date(
      `${format(selectedDate, 'yyyy-MM-dd')}T${time}:00`
    );

    if (schedule) {
      $status = schedule.scheduleStatus;
      scheduleId = schedule.scheduleId;
      detailText =
        schedule.scheduleStatus === 'OPEN'
          ? '-'
          : `${schedule.trainerName} - ${schedule.traineeName}`;
    }

    if (timeDate <= now) {
      $status = 'PAST';
      detailText =
        schedule?.scheduleStatus === 'RESERVED'
          ? `${schedule.trainerName} - ${schedule.traineeName}`
          : '';
    }

    return {
      $status,
      detailText,
      scheduleId,
    };
  };

  const getButtonText = ($status: ScheduleStatus) => {
    if (user?.role === 'TRAINER') {
      switch ($status) {
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
    } else if (user?.role === 'TRAINEE') {
      switch ($status) {
        case 'PAST':
        case 'EMPTY':
          return;
        case 'OPEN':
          return '신청';
        case 'RESERVE_APPLIED':
          return '신청취소';
        case 'RESERVED':
          return '취소';
      }
    }
  };

  const handleModal = async (
    $status: ScheduleStatus,
    action: 'open' | 'close' | 'save',
    id?: number,
    time?: string
  ) => {
    const modalTypeMap: Record<ScheduleStatus, string> = {
      PAST: '',
      EMPTY: 'openModal',
      OPEN: 'closeModal',
      RESERVE_APPLIED: 'confirmModal',
      RESERVED: 'cancelModal',
    };

    const modalType = modalTypeMap[$status];

    if (!modalType) return;

    switch (action) {
      case 'open':
        setSelectedId(id || null);
        setSelectedTime(time || null);
        openModal(modalType);
        break;
      case 'close':
        closeModal(modalType);
        break;
      case 'save':
        try {
          if (user?.role === 'TRAINER') {
            await handleTrainerActions($status);
          } else if (user?.role === 'TRAINEE') {
            await handleTraineeActions($status);
          }
          refetch();
        } catch (error: any) {
          handleError(error, $status);
        } finally {
          closeModal(modalType);
        }
        break;
    }
  };

  const handleTrainerActions = async ($status: ScheduleStatus) => {
    if ($status === 'EMPTY' && selectedTime) {
      const startDate = format(selectedDate, 'yyyy-MM-dd');
      const startTimes = [selectedTime];
      await AppointmentApi.openSchedules([{ startDate, startTimes }]);
    } else if ($status === 'OPEN' && selectedId) {
      await AppointmentApi.closeSchedules([selectedId]);
    } else if ($status === 'RESERVE_APPLIED' && selectedId) {
      await AppointmentApi.acceptSchedule(selectedId);
    } else if ($status === 'RESERVED' && selectedId) {
      await AppointmentApi.cancelSchedule(selectedId);
    }
  };

  const handleTraineeActions = async ($status: ScheduleStatus) => {
    if ($status === 'OPEN' && selectedId) {
      await AppointmentApi.applySchedule(selectedId);
    } else if ($status === 'RESERVE_APPLIED' && selectedId) {
      await AppointmentApi.cancelSchedule(selectedId);
    } else if ($status === 'RESERVED' && selectedId) {
      await AppointmentApi.cancelSchedule(selectedId);
    }
  };

  const handleError = (error: any, $status: ScheduleStatus) => {
    if ($status === 'OPEN' && user?.role === 'TRAINEE') {
      if (error.response?.status === 400) {
        setErrorAlert('1시간 내 시작하는 수업은 신청할 수 없습니다.');
      } else if (error.response?.status === 406) {
        setErrorAlert('남은 PT 횟수가 부족합니다.');
      }
    } else if ($status === 'RESERVED' && user?.role === 'TRAINEE') {
      if (error.response?.status === 400) {
        setErrorAlert('24시간 내 시작하는 수업은 취소할 수 없습니다.');
      }
    } else {
      console.error('일정 관련 버튼 에러: ', error);
    }
  };

  const handleRejectModal = async (
    action: 'open' | 'close' | 'save',
    id?: number
  ) => {
    switch (action) {
      case 'open':
        setSelectedId(id || null);
        openModal('rejectModal');
        break;
      case 'close':
        closeModal('rejectModal');
        break;
      case 'save':
        try {
          if (selectedId) {
            await AppointmentApi.rejectSchedule(selectedId);
            refetch();
          }
        } catch (error: any) {
          console.error('일정 관련 버튼 에러: ', error);
        } finally {
          closeModal('rejectModal');
        }
        break;
    }
  };

  const onCloseErrorAlert = () => setErrorAlert('');

  return (
    <Wrapper>
      {isLoading && <div>Loading...</div>}
      {!isLoading &&
        !error &&
        times.map((time, idx) => {
          const { $status, detailText, scheduleId } = getScheduleDetail(
            time.shortTime
          );
          return (
            <ScheduleTable key={idx}>
              <TimeBox>
                <Time>{time.fullTime}</Time>
                <Dot />
              </TimeBox>
              <InfoBox $status={$status}>
                <Detail $status={$status}>{detailText}</Detail>
                {$status !== 'PAST' &&
                  !(user?.role === 'TRAINEE' && $status === 'EMPTY') && (
                    <ButtonBox role={user?.role}>
                      <StatusButton
                        $status={$status}
                        role={user?.role}
                        onClick={() =>
                          handleModal(
                            $status,
                            'open',
                            scheduleId,
                            time.shortTime
                          )
                        }
                      >
                        {getButtonText($status)}
                      </StatusButton>
                      {$status === 'RESERVE_APPLIED' &&
                        user?.role === 'TRAINER' && (
                          <RejectButton
                            $status={$status}
                            onClick={() =>
                              handleRejectModal('open', scheduleId)
                            }
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
      {errorAlert && (
        <Alert $type="error" text={errorAlert} onClose={onCloseErrorAlert} />
      )}
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
        onClose={() => handleRejectModal('close')}
        onSave={() => handleRejectModal('save')}
        btnConfirm="저장"
      >
        선택한 시간에 수업을 거절할까요?
      </Modal>
    </Wrapper>
  );
};

export default ScheduleDetail;
