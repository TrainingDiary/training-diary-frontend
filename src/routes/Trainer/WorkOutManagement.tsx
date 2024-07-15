import React from 'react';
import styled from 'styled-components';

import { hexToRgba } from 'src/utils/hexToRgba';
import addBtn from '@icons/home/addbtn.svg';
import { AddButton } from './TraineeManagement';
import Button from '@components/Common/Button/Button';

// Styled components
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 20px;
`;

const Card = styled.div`
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

const WorkOutManagement: React.FC = () => {
  return (
    <Wrapper>
      <Card>
        <CardHeader>
          <TitleGroup>
            <CardTitle>운동명</CardTitle>
            <CardSubtitle>주요자극부위</CardSubtitle>
          </TitleGroup>
          <ButtonGroup>
            <Button $size="small">삭제</Button>
            <Button $size="small">수정</Button>
          </ButtonGroup>
        </CardHeader>
        <Divider />
        <CardBody>
          주의 사항을 입력해주는 곳인데 무엇을 적어야 할까요? 길어진면 언제까지
          보여져야 할까요? 지금 더 길어지면 어떻게 보여지는지 테스트 합니다.
        </CardBody>
        <Tags>
          <Tag>#무게</Tag>
          <Tag>#속도</Tag>
          <Tag>#시간</Tag>
          <Tag>#세트횟수</Tag>
        </Tags>
      </Card>
      {/* Add button 추가 */}
      <AddButton>
        <img src={addBtn} alt="add button" />
      </AddButton>
    </Wrapper>
  );
};

export default WorkOutManagement;
