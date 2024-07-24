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
import { traineeList } from 'src/mocks/data/traineeList';
import { getMonthRange } from 'src/utils/getMonthRange';

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
  const [currentDate] = useState(new Date());
  const { startDate, endDate } = getMonthRange(currentDate);
  const { data, isLoading, error } = useFetchSchedules(startDate, endDate);
  const { openModal, closeModal, isOpen } = useModals();
  const [selectedButton, setSelectedButton] = useState<string | null>(null);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [selectedTraineeId, setSelectedTraineeId] = useState<number | null>(
    null
  );
  const [errorAlert, setErrorAlert] = useState<string>('');

  useEffect(() => {
    if (selectedDates.length === 0) {
      setSelectedTimes([]);
    }
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
      openModal('registerModal');
    }
  };

  const onCloseModal = (modalName: string) => {
    closeModal(modalName);
  };

  const onSaveModal = (modalName: string) => {
    if (modalName === 'openModal') {
      // 수업 일괄 오픈 API 요청 단계 추가 (추후 react-query 이용한 refetch)
    } else if (modalName === 'registerModal') {
      if (!selectedTraineeId) return setErrorAlert('트레이니를 선택해주세요.');

      // 수업 일괄 등록 API 요청 단계 추가 (추후 react-query 이용한 refetch)
    }

    closeModal(modalName);
    setSelectedDates([]); // 리렌더링 흉내내기 (삭제예정)
    setSelectedButton(null); // 리렌더링 흉내내기 (삭제예정)
  };

  const onClickTrainee = (id: number) => {
    setSelectedTraineeId(id);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error || !data)
    return (
      <div>Error: {error?.message || '데이터를 불러오지 못했습니다.'}</div>
    );

  return (
    <SectionWrapper>
      <Wrapper>
        <MonthlyCalendar
          data={data}
          selectedButton={selectedButton}
          selectedDates={selectedDates}
          onDateClick={onDateClick}
        />
        <ButtonContainer
          onButtonClick={onButtonClick}
          selectedButton={selectedButton}
        />

        {selectedButton && (
          <Fragment>
            <Divider />
            <TimeTableContainer
              reservedAndAppliedDates={data.reservedAndAppliedDates}
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
            items={traineeList}
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
