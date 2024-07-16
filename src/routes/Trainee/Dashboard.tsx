import React, { useState } from 'react';
import styled from 'styled-components';
import { hexToRgba } from 'src/utils/hexToRgba';
import { useParams } from 'react-router-dom';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Section = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 10px;
  box-shadow: 0 4px 4px ${({ theme }) => hexToRgba(theme.colors.black, 0.25)};
  padding: 20px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 1.6rem;
  color: ${({ theme }) => theme.colors.gray900};
`;

const EditButton = styled.button`
  background: none;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.gray900};
`;

const InfoGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Label = styled.label`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.gray900};
  width: 150px;
`;

const Input = styled.input<{ unit?: string }>`
  border: 1px solid ${({ theme }) => theme.colors.main500};
  border-radius: 5px;
  padding: 5px 10px;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.gray900};
  width: 100%;
  max-width: 220px;
  text-align: right;
  outline: none;
  ${({ unit }) =>
    unit &&
    `
    &::after {
      content: '${unit}';
      margin-left: 5px;
    }
  `}
`;

const Select = styled.select`
  border: 1px solid ${({ theme }) => theme.colors.main500};
  border-radius: 5px;
  padding: 5px 10px;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.gray900};
  width: 100%;
  max-width: 220px;
  text-align: right;
  outline: none;
`;

const Graph = styled.div``;

const Dashboard: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [editInfo, setEditInfo] = useState(true);

  const [info, setInfo] = useState({
    count: '15',
    age: 22,
    gender: '남',
    height: 180,
    goal: '몸무게',
    goalValue: 70,
    goalReward: 'PT 횟수 1회 추가',
    weight: 78,
    bodyFatPercentage: 15,
    muscleMass: 30.6,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const getUnit = (goal: string) => {
    switch (goal) {
      case '체지방률':
        return '%';
      case '몸무게':
      case '근골격량':
        return 'kg';
      default:
        return '';
    }
  };

  return (
    <Wrapper>
      <Section>
        <SectionHeader>
          <SectionTitle>회원 이름</SectionTitle>
          {editInfo ? (
            <EditButton onClick={() => setEditInfo(false)}>
              정보 수정
            </EditButton>
          ) : (
            <EditButton onClick={() => setEditInfo(true)}>저장</EditButton>
          )}
        </SectionHeader>
        <InfoGroup>
          <InfoItem>
            <Label>잔여 횟수(count)</Label>
            <Input
              type="text"
              name="count"
              value={info.count}
              readOnly={editInfo}
              onChange={handleInputChange}
            />
          </InfoItem>
          <InfoItem>
            <Label>나이(age)</Label>
            <Input
              type="text"
              name="age"
              value={`${info.age}(세)`}
              readOnly={editInfo}
              onChange={handleInputChange}
            />
          </InfoItem>
          <InfoItem>
            <Label>성별(gender)</Label>
            <Input
              type="text"
              name="gender"
              value={info.gender}
              readOnly={editInfo}
              onChange={handleInputChange}
            />
          </InfoItem>
          <InfoItem>
            <Label>키(height)</Label>
            <Input
              type="text"
              name="height"
              value={`${info.height}(cm)`}
              readOnly={editInfo}
              onChange={handleInputChange}
            />
          </InfoItem>
          <InfoItem>
            <Label>목표 설정</Label>
            {editInfo ? (
              <Input type="text" value={info.goal} readOnly />
            ) : (
              <Select
                name="goal"
                value={info.goal}
                onChange={handleSelectChange}
              >
                <option value="몸무게">몸무게</option>
                <option value="체지방률">체지방률</option>
                <option value="근골격량">근골격량</option>
              </Select>
            )}
          </InfoItem>
          <InfoItem>
            <Label>목표 수치</Label>
            <Input
              type="text"
              name="goalValue"
              value={info.goalValue}
              readOnly={editInfo}
              onChange={handleInputChange}
              unit={getUnit(info.goal)}
            />
          </InfoItem>
          <InfoItem>
            <Label>목표 보상</Label>
            <Input
              type="text"
              name="goalReward"
              value={info.goalReward}
              readOnly={editInfo}
              onChange={handleInputChange}
            />
          </InfoItem>
        </InfoGroup>
      </Section>
      <Section>
        <SectionHeader>
          <SectionTitle>인바디 정보</SectionTitle>
          <EditButton>인바디 추가</EditButton>
        </SectionHeader>
        <InfoGroup>
          <InfoItem>
            <Label>몸무게</Label>
            <Input type="text" value={`${info.weight} kg`} readOnly />
          </InfoItem>
          <InfoItem>
            <Label>체지방률</Label>
            <Input type="text" value={`${info.bodyFatPercentage} %`} readOnly />
          </InfoItem>
          <InfoItem>
            <Label>근골격량</Label>
            <Input type="text" value={`${info.muscleMass} kg`} readOnly />
          </InfoItem>
        </InfoGroup>
      </Section>
      <Graph>{/* TODO : Graph 구현 */}</Graph>
    </Wrapper>
  );
};

export default Dashboard;
