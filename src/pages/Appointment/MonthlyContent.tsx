import React, { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { format } from 'date-fns';

import Alert from '@components/Common/Alert/Alert';
import Modal from '@components/Common/Modal/Modal';
import { SectionWrapper } from '@components/Common/SectionWrapper';
import MonthlyCalendar from '@components/Appointment/MonthlyCalendar';
import ButtonContainer from '@components/Appointment/ButtonContainer';
import TimeTableContainer from '@components/Appointment/TimeTableContainer';
import TraineeRegisterModal from '@components/Appointment/TraineeRegisterModal';
import useModals from 'src/hooks/useModals';
import useFetchSchedules from 'src/hooks/useFetchSchedules';
import useFetchUser from 'src/hooks/useFetchUser';
import useCalendarStore from 'src/stores/calendarStore';
import useUserStore from 'src/stores/userStore';
import CreateAppointmentApi from 'src/api/appointment';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const Divider = styled.div`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.gray300};
  width: 100%;
`;

const CompleteButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 0.5rem;
  font-size: 1.6rem;
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  width: 100%;
  white-space: nowrap;
  background-color: ${({ theme }) => theme.colors.gray700};
  border: none;

  &:active {
    background-color: ${({ theme }) => theme.colors.gray900};
  }
`;

const TraineeRegisterModalText = styled.span`
  color: ${({ theme }) => theme.colors.red300};
  text-align: right;
`;

const MonthlyContent: React.FC = () => {
  useFetchUser();
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { startDate, endDate } = useCalendarStore();
  const { data, isLoading, refetch } = useFetchSchedules(startDate, endDate);
  const { openModal, closeModal, isOpen } = useModals();
  const AppointmentApi = CreateAppointmentApi(navigate);
  const [selectedButton, setSelectedButton] = useState<string | null>(null);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [combinedReservedAndAppliedDates, setCombinedReservedAndAppliedDates] =
    useState(data.reservedAndAppliedDates);
  const [selectedTraineeId, setSelectedTraineeId] = useState<number | null>(
    null
  );
  const [errorAlert, setErrorAlert] = useState<string>('');

  useEffect(() => {
    setSelectedTimes([]);
  }, [selectedDates]);

  const onButtonClick = (buttonType: string) => {
    setSelectedDates([]);

    setSelectedButton(prevSelectedButton =>
      prevSelectedButton === buttonType ? null : buttonType
    );
  };

  const onDateClick = (date: Date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');

    if (!selectedButton) {
      navigate(`/appointment/weekly/${formattedDate}`);
      return;
    }

    setSelectedDates(prevDates =>
      prevDates.includes(formattedDate)
        ? prevDates.filter(date => date !== formattedDate)
        : [...prevDates, formattedDate]
    );
  };

  const onTimeClick = (time: string) => {
    if (selectedButton && selectedDates.length === 0) {
      setErrorAlert('날짜를 먼저 선택해주세요.');
      return;
    }

    setSelectedTimes(prevTimes =>
      prevTimes.includes(time)
        ? prevTimes.filter(t => t !== time)
        : [...prevTimes, time]
    );
  };

  const onCloseErrorAlert = () => setErrorAlert('');

  const onCompleteClick = () => {
    if (!selectedDates.length) return setErrorAlert('날짜를 선택해주세요.');
    if (!selectedTimes.length) return setErrorAlert('시간을 선택해주세요.');

    if (selectedButton === 'open') {
      openModal('openModal');
    } else if (selectedButton === 'register') {
      setSelectedTraineeId(null);
      openModal('registerModal');
    }
  };

  const onCloseModal = (modalName: string) => {
    closeModal(modalName);
  };

  const onSaveModal = async (modalName: string) => {
    if (modalName === 'openModal') {
      try {
        const dateTimes = selectedDates.reduce(
          (acc, date) => {
            acc.push({
              startDate: date,
              startTimes: selectedTimes,
            });
            return acc;
          },
          [] as { startDate: string; startTimes: string[] }[]
        );

        await AppointmentApi.openSchedules(dateTimes);
        refetch({ force: true });
      } catch (error) {
        console.error('수업 일괄 오픈 에러: ', error);
      }
    } else if (modalName === 'registerModal') {
      if (!selectedTraineeId) return setErrorAlert('트레이니를 선택해주세요.');

      try {
        const dateTimes = selectedDates.reduce(
          (acc, date) => {
            acc.push({
              startDate: date,
              startTimes: selectedTimes,
            });
            return acc;
          },
          [] as { startDate: string; startTimes: string[] }[]
        );

        await AppointmentApi.registerSchedules({
          traineeId: selectedTraineeId,
          dateTimes: dateTimes,
        });
        refetch({ force: true });
      } catch (error) {
        console.error('수업 일괄 등록 에러: ', error);
      }
    }

    closeModal(modalName);
    setSelectedDates([]);
    setSelectedButton(null);
  };

  const onClickTrainee = (id: number) => {
    setSelectedTraineeId(id);
  };

  useEffect(() => {
    if (selectedButton === 'register') {
      const mergeDates = (
        newDates: { startDate: string; notAllowedTimes: string[] }[]
      ) => {
        const merged = [...combinedReservedAndAppliedDates];
        newDates.forEach(newDate => {
          const index = merged.findIndex(
            existingDate => existingDate.startDate === newDate.startDate
          );
          if (index !== -1) {
            merged[index] = newDate;
          } else {
            merged.push(newDate);
          }
        });
        return merged;
      };

      setCombinedReservedAndAppliedDates(
        mergeDates(data.reservedAndAppliedDates)
      );
    }
  }, [data, selectedButton, selectedDates]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <SectionWrapper>
      <Wrapper>
        <MonthlyCalendar
          data={data}
          selectedButton={selectedButton}
          selectedDates={selectedDates}
          onDateClick={onDateClick}
        />
        {user?.role === 'TRAINER' && (
          <ButtonContainer
            onButtonClick={onButtonClick}
            selectedButton={selectedButton}
          />
        )}
        {selectedButton && (
          <Fragment>
            <Divider />
            <TimeTableContainer
              reservedAndAppliedDates={combinedReservedAndAppliedDates}
              selectedButton={selectedButton}
              selectedDates={selectedDates}
              selectedTimes={selectedTimes}
              onTimeClick={onTimeClick}
            />
            <CompleteButton onClick={onCompleteClick}>
              시간 선택 완료
            </CompleteButton>
          </Fragment>
        )}

        {errorAlert && (
          <Alert $type="error" text={errorAlert} onClose={onCloseErrorAlert} />
        )}
        <Modal
          title="수업 일괄 오픈"
          type="confirm"
          isOpen={isOpen('openModal')}
          onClose={() => onCloseModal('openModal')}
          onSave={() => onSaveModal('openModal')}
          btnConfirm="저장"
        >
          선택한 일자, 시간에 수업을 일괄 오픈할까요?
        </Modal>
        <Modal
          title="수업 일괄 등록"
          type="custom"
          isOpen={isOpen('registerModal')}
          onClose={() => onCloseModal('registerModal')}
          onSave={() => onSaveModal('registerModal')}
          btnConfirm="저장"
        >
          <TraineeRegisterModal
            isOpen={isOpen('registerModal')}
            selectedTraineeId={selectedTraineeId}
            onClick={onClickTrainee}
          />
          <TraineeRegisterModalText>
            저장 시 바로 적용됩니다.
          </TraineeRegisterModalText>
        </Modal>
      </Wrapper>
    </SectionWrapper>
  );
};

export default MonthlyContent;
