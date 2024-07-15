import React from 'react';
import styled from 'styled-components';

import avatar from '@icons/avatar.svg';

const TraineeListWrapper = styled.ul`
  width: 100%;
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 15px;
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
  font-size: 1.6rem;
  color: ${({ theme }) => theme.colors.gray900};
`;

interface TraineeDataType {
  ptContractId: number;
  totalSessionUpdatedAt: string;
  totalSession: number;
  trainerId: number;
  traineeId: number;
  traineeName: string;
}

interface TraineeListProps {
  items: TraineeDataType[];
  selectedTraineeId: number | null;
  onClick: (id: number) => void;
}

const TraineeList: React.FC<TraineeListProps> = ({
  items,
  selectedTraineeId,
  onClick,
}) => {
  return (
    <TraineeListWrapper>
      {items.map((trainee) => (
        <TraineeItem
          key={trainee.traineeId}
          $isSelected={trainee.traineeId === selectedTraineeId}
          onClick={() => onClick(trainee.traineeId)}
        >
          <Avatar>
            <img src={avatar} alt="user avatar" />
          </Avatar>
          <TraineeInfo>
            <span>{trainee.traineeName}</span>
            <span>잔여 횟수 : {trainee.totalSession}</span>
          </TraineeInfo>
        </TraineeItem>
      ))}
    </TraineeListWrapper>
  );
};

export default TraineeList;
