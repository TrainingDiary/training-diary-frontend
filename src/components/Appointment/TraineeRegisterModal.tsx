import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import avatar from '@icons/home/avatar.svg';
import Alert from '@components/Common/Alert/Alert';
import CreateTrainerApi from 'src/api/trainer';

const TraineeListWrapper = styled.ul`
  width: 100%;
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 240px;
  overflow-y: auto;
`;

const TraineeItem = styled.li<{ $isSelected: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 10px;
  background-color: ${({ theme, $isSelected }) =>
    $isSelected ? theme.colors.main200 : theme.colors.white};
  width: 100%;
  text-decoration: none;
  flex: 1;
  cursor: pointer;
`;

const Avatar = styled.span`
  display: flex;
  background-color: ${({ theme }) => theme.colors.main400};
  padding: 11px;
  border-radius: 50%;
  border: none;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
`;

const TraineeInfo = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
  font-size: 1.6rem;
  color: ${({ theme }) => theme.colors.gray900};

  span:last-child {
    width: 104px;
    text-align: left;
    font-size: 1.4rem;
    color: ${({ theme }) => theme.colors.gray600};
  }
`;

interface TraineeDataType {
  ptContractId: number;
  totalSessionUpdatedAt: string;
  remainingSession: number;
  trainerId: number;
  traineeId: number;
  traineeName: string;
}

interface TraineeRegisterModalProps {
  isOpen: boolean;
  selectedTraineeId: number | null;
  onClick: (id: number) => void;
}

const TraineeRegisterModal: React.FC<TraineeRegisterModalProps> = ({
  isOpen,
  selectedTraineeId,
  onClick,
}) => {
  const navigate = useNavigate();
  const TrainerApi = CreateTrainerApi(navigate);
  const [items, setItems] = useState<TraineeDataType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorAlert, setErrorAlert] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      const fetchTrainees = async () => {
        try {
          setIsLoading(true);

          const response = await TrainerApi.getTrainees('NAME', 0, 30);

          setItems(response.data.content);
        } catch (error) {
          console.error('트레이니 조회 에러: ', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchTrainees();
    }
  }, [isOpen]);

  const onClickTrainee = (trainee: TraineeDataType) => {
    if (trainee.remainingSession === 0) {
      setErrorAlert('잔여 횟수가 없습니다.');
      return;
    }

    onClick(trainee.traineeId);
  };

  const onCloseErrorAlert = () => setErrorAlert('');

  if (isLoading) return <div>Loading...</div>;
  if (items.length === 0) return <div>등록된 트레이니가 없습니다.</div>;

  return (
    <TraineeListWrapper>
      {items.map(trainee => (
        <TraineeItem
          key={trainee.traineeId}
          $isSelected={trainee.traineeId === selectedTraineeId}
          onClick={() => onClickTrainee(trainee)}
        >
          <Avatar>
            <img src={avatar} alt="user avatar" />
          </Avatar>
          <TraineeInfo>
            <span>{trainee.traineeName}</span>
            <span>잔여 횟수 : {trainee.remainingSession}</span>
          </TraineeInfo>
        </TraineeItem>
      ))}
      {errorAlert && (
        <Alert $type="error" text={errorAlert} onClose={onCloseErrorAlert} />
      )}
    </TraineeListWrapper>
  );
};

export default TraineeRegisterModal;
