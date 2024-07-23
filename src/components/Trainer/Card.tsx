import React from 'react';
import styled from 'styled-components';

import Button from '@components/Common/Button/Button';
import { hexToRgba } from 'src/utils/hexToRgba';

const CardWrapper = styled.div`
  width: 100%;
  max-width: 400px;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 10px;
  box-shadow: 0 4px 6px ${({ theme }) => hexToRgba(theme.colors.gray900, 0.2)};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TitleGroup = styled.div`
  width: 100%;
  display: flex;
  flex-grow: 1;
  align-items: center;
  gap: 4px;
  color: ${({ theme }) => theme.colors.gray900};
`;

const CardTitle = styled.p`
  font-weight: bold;
  font-size: 1.6rem;
  font-family: 'NanumSquareExtraBold';
`;

const CardSubtitle = styled.span`
  font-size: 1.2rem;
  line-height: 1;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  width: 100%;

  & > button {
    line-height: 1;
    font-size: 1.2rem;
    max-width: 60px;
  }
`;

const Divider = styled.div`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.main500};
  width: 100%;
`;

const CardBody = styled.div`
  color: ${({ theme }) => theme.colors.gray700};
  font-size: 1.3rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
`;

const Tag = styled.span`
  background-color: ${({ theme }) => theme.colors.gray200};
  color: ${({ theme }) => theme.colors.main700};
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 1.1rem;
`;

interface CardProps {
  workout: {
    id: number;
    name: string;
    targetMuscle: string;
    remark: string;
    weightInputRequired: boolean;
    setInputRequired: boolean;
    repInputRequired: boolean;
    timeInputRequired: boolean;
    speedInputRequired: boolean;
  };
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}

const Card: React.FC<CardProps> = ({ workout, onDelete, onEdit }) => {
  return (
    <CardWrapper>
      <CardHeader>
        <TitleGroup>
          <CardTitle>{workout.name}</CardTitle>
          <CardSubtitle>{workout.targetMuscle}</CardSubtitle>
        </TitleGroup>
        <ButtonGroup>
          <Button $size="small" onClick={() => onDelete(workout.id)}>
            삭제
          </Button>
          <Button $size="small" onClick={() => onEdit(workout.id)}>
            수정
          </Button>
        </ButtonGroup>
      </CardHeader>
      <Divider />
      <CardBody>{workout.remark}</CardBody>
      <Tags>
        {workout.weightInputRequired && <Tag>#무게</Tag>}
        {workout.setInputRequired && <Tag>#세트횟수</Tag>}
        {workout.repInputRequired && <Tag>#반복횟수</Tag>}
        {workout.timeInputRequired && <Tag>#시간</Tag>}
        {workout.speedInputRequired && <Tag>#속도</Tag>}
      </Tags>
    </CardWrapper>
  );
};

export default Card;
