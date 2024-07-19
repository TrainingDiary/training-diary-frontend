import React, { useState } from 'react';
import styled from 'styled-components';
import { differenceInYears, format } from 'date-fns';
import { Line } from 'react-chartjs-2';
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { hexToRgba } from 'src/utils/hexToRgba';
import useModals from 'src/hooks/useModals';
import weight from '@icons/dashboard/weight.svg';
import bodyFat from '@icons/dashboard/bodyFat.svg';
import muscleMass from '@icons/dashboard/muscleMass.svg';
import InbodyModal from './InbodyModal';
import Calendar from './Calendar';
import { SectionWrapper } from '@components/Common/SectionWrapper';
import Alert from '@components/Common/Alert/Alert';

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const Section = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 10px;
  box-shadow: 0 4px 4px ${({ theme }) => hexToRgba(theme.colors.black, 0.25)};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: solid 1px ${({ theme }) => theme.colors.gray200};
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SectionTitle = styled.h2`
  font-size: 1.6rem;
  color: ${({ theme }) => theme.colors.gray900};
  font-family: 'NanumSquareBold';
`;

const EditButton = styled.button<{ $editMode?: boolean }>`
  background: ${({ theme, $editMode }) =>
    $editMode ? theme.colors.gray100 : theme.colors.main500};
  border: 1px solid
    ${({ theme, $editMode }) =>
      $editMode ? theme.colors.gray300 : theme.colors.main500};
  border-radius: 5px;
  padding: 5px 13px;
  cursor: pointer;
  font-size: 1.2rem;
  color: ${({ theme, $editMode }) =>
    $editMode ? theme.colors.gray900 : theme.colors.white};
  transition: all 0.1s;
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
  position: relative;
`;

const Label = styled.label`
  font-size: 1.4rem;
  color: ${({ theme }) => theme.colors.gray900};
  width: 200px;
  display: flex;
  align-items: center;
  gap: 5px;

  span {
    min-width: 23px;
    min-height: 24px;
    display: flex;
    background-color: ${({ theme }) => theme.colors.main200};
    align-items: center;
    justify-content: center;
    border-radius: 5px;
  }
`;

const Input = styled.input<{ $unit?: string; $editMode?: boolean }>`
  border: 1px solid
    ${({ theme, $editMode }) =>
      $editMode ? theme.colors.main500 : theme.colors.gray300};
  background-color: ${({ theme, $editMode }) =>
    $editMode ? theme.colors.white : theme.colors.gray100};
  border-radius: 5px;
  padding: 5px 10px;
  font-size: 1.4rem;
  color: ${({ theme, $editMode }) =>
    $editMode ? theme.colors.gray900 : theme.colors.gray600};
  width: 100%;
  max-width: 220px;
  text-align: right;
  outline: none;
  transition: border-color 0.3s;
  cursor: ${({ $editMode }) => ($editMode ? 'auto' : 'not-allowed')};

  ${({ $unit }) =>
    $unit &&
    `
    &::after {
      content: '${$unit}';
      margin-left: 5px;
    }
  `}
`;

const TextArea = styled.textarea<{ $unit?: string; $editMode?: boolean }>`
  border: 1px solid
    ${({ theme, $editMode }) =>
      $editMode ? theme.colors.main500 : theme.colors.gray300};
  background-color: ${({ theme, $editMode }) =>
    $editMode ? theme.colors.white : theme.colors.gray100};
  border-radius: 5px;
  padding: 5px 10px;
  font-size: 1.4rem;
  color: ${({ theme, $editMode }) =>
    $editMode ? theme.colors.gray900 : theme.colors.gray600};
  width: 100%;
  max-width: 220px;
  text-align: right;
  outline: none;
  transition: border-color 0.3s;
  cursor: ${({ $editMode }) => ($editMode ? 'auto' : 'not-allowed')};
  resize: none;
  font-family: 'NanumSquare';
`;

const Select = styled.select<{ $editMode: boolean }>`
  border: 1px solid
    ${({ theme, $editMode }) =>
      $editMode ? theme.colors.main500 : theme.colors.gray300};
  background-color: ${({ theme, $editMode }) =>
    $editMode ? theme.colors.white : theme.colors.gray100};
  border-radius: 5px;
  padding: 5px 10px;
  font-size: 1.4rem;
  color: ${({ theme, $editMode }) =>
    $editMode ? theme.colors.gray900 : theme.colors.gray600};
  width: 100%;
  max-width: 220px;
  text-align: right;
  outline: none;
  transition: border-color 0.3s;
  cursor: ${({ $editMode }) => ($editMode ? 'auto' : 'not-allowed')};
  resize: none;
  font-family: 'NanumSquare';
`;

const Divider = styled.div`
  height: 2px;
  background-color: ${({ theme }) => theme.colors.main500};
  width: 100%;
`;

const Graph = styled.div`
  position: relative;
  width: 100%;
`;

export interface InbodyData {
  date: Date;
  weight: string;
  bodyFatPercentage: string;
  muscleMass: string;
}

export interface InfoData {
  remainingSessions: number;
  age: number;
  gender: string;
  height: number;
  targetType: string;
  targetValue: number;
  targetReward: string;
  weight: number;
  bodyFatPercentage: number;
  muscleMass: number;
}

const Dashboard: React.FC = () => {
  const [editInfo, setEditInfo] = useState(true);
  const { openModal, closeModal, isOpen } = useModals();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [inbodyData, setInbodyData] = useState<InbodyData>({
    date: new Date(),
    weight: '',
    bodyFatPercentage: '',
    muscleMass: '',
  });
  const [info, setInfo] = useState<InfoData>({
    remainingSessions: 15,
    age: 22,
    gender: '남',
    height: 180,
    targetType: '몸무게',
    targetValue: 70,
    targetReward: 'PT 횟수 1회 추가',
    weight: 78,
    bodyFatPercentage: 15,
    muscleMass: 30.6,
  });
  const [chartData, setChartData] = useState({
    labels: [format(new Date(), 'MM.dd')],
    datasets: [
      {
        label: '몸무게',
        data: [78],
        borderColor: '#FF3B3B',
        pointBackgroundColor: '#FF3B3B',
        fill: false,
      },
      {
        label: '체지방률',
        data: [15],
        borderColor: '#3B98FF',
        pointBackgroundColor: '#3B98FF',
        fill: false,
      },
      {
        label: '근골격량',
        data: [30.6],
        borderColor: '#ADB5BD',
        pointBackgroundColor: '#ADB5BD',
        fill: false,
      },
      {
        label: '목표수치',
        data: [70],
        borderColor: '#89DAC1',
        pointBackgroundColor: '#89DAC1',
        fill: false,
      },
    ],
  });
  const [errorAlert, setErrorAlert] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInfo(prevInfo => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInfo(prevInfo => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInfo(prevInfo => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleInbodyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInbodyData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const calculatedAge = differenceInYears(new Date(), date);
      setInfo(prevInfo => ({
        ...prevInfo,
        age: calculatedAge,
      }));
      setSelectedDate(date);
    }
  };

  const handleSaveModal = () => {
    // 필수 값 검증 로직 추가
    const requiredFields = ['weight', 'bodyFatPercentage', 'muscleMass'];
    for (const field of requiredFields) {
      if (!inbodyData[field as keyof InbodyData]) {
        switch (field) {
          case 'weight':
            return setErrorAlert(`몸무게를 입력해주세요`);
          case 'bodyFatPercentage':
            return setErrorAlert(`체지방을 입력해주세요`);
          case 'muscleMass':
            return setErrorAlert(`근골격량을 입력해주세요`);
          default:
            return '';
        }
      }
    }

    const formattedDate = format(inbodyData.date, 'MM.dd');
    setChartData(prevData => ({
      ...prevData,
      labels: [...prevData.labels, formattedDate],
      datasets: prevData.datasets.map(dataset => {
        if (dataset.label === '몸무게') {
          return {
            ...dataset,
            data: [...dataset.data, parseFloat(inbodyData.weight)],
          };
        }
        if (dataset.label === '체지방률') {
          return {
            ...dataset,
            data: [...dataset.data, parseFloat(inbodyData.bodyFatPercentage)],
          };
        }
        if (dataset.label === '근골격량') {
          return {
            ...dataset,
            data: [...dataset.data, parseFloat(inbodyData.muscleMass)],
          };
        }
        if (dataset.label === '목표수치') {
          return { ...dataset, data: [...dataset.data, info.targetValue] };
        }
        return dataset;
      }),
    }));

    setInfo(prevInfo => ({
      ...prevInfo,
      weight: parseFloat(inbodyData.weight),
      bodyFatPercentage: parseFloat(inbodyData.bodyFatPercentage),
      muscleMass: parseFloat(inbodyData.muscleMass),
    }));

    closeModal('inbodyModal');
  };

  const handleSaveInfo = () => {
    // 필수 값 검증 로직 추가
    const requiredFields = [
      'remainingSessions',
      'age',
      'gender',
      'height',
      'targetValue',
      'targetReward',
    ];
    for (const field of requiredFields) {
      if (!info[field as keyof InfoData]) {
        switch (field) {
          case 'remainingSessions':
            return setErrorAlert(`잔여 횟수를 입력해주세요`);
          case 'age':
            return setErrorAlert(`생년월일을 입력해주세요`);
          case 'gender':
            return setErrorAlert(`성별을 입력해주세요`);
          case 'height':
            return setErrorAlert(`키를 입력해주세요`);
          case 'targetType':
            return setErrorAlert(`목표 설정을 선택해주세요`);
          case 'targetValue':
            return setErrorAlert(`목표 수치를 입력해주세요`);
          case 'targetReward':
            return setErrorAlert(`목표 보상을 입력해주세요`);
          default:
            return '';
        }
      }
    }
    setEditInfo(true);
  };

  const onCloseErrorAlert = () => setErrorAlert('');

  const getUnit = (targetType: string) => {
    switch (targetType) {
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
    <SectionWrapper>
      <Wrapper>
        <Section>
          <SectionHeader>
            <SectionTitle>회원 이름</SectionTitle>
            {editInfo ? (
              <EditButton
                $editMode={editInfo}
                onClick={() => setEditInfo(false)}
              >
                정보 수정
              </EditButton>
            ) : (
              <EditButton $editMode={editInfo} onClick={handleSaveInfo}>
                정보 저장
              </EditButton>
            )}
          </SectionHeader>
          <InfoGroup>
            <InfoItem>
              <Label>잔여 횟수</Label>
              <Input
                type="number"
                name="remainingSessions"
                value={info.remainingSessions}
                readOnly={editInfo}
                onChange={handleInputChange}
                $editMode={!editInfo}
              />
            </InfoItem>
            <InfoItem>
              {editInfo ? <Label>나이</Label> : <Label>생년월일</Label>}

              {editInfo ? (
                <Input
                  type={editInfo ? 'text' : 'number'}
                  name="age"
                  value={`${info.age} 세`}
                  readOnly
                  $editMode={!editInfo}
                />
              ) : (
                <Calendar
                  selectedDate={selectedDate}
                  onDateChange={handleDateChange}
                />
              )}
            </InfoItem>
            <InfoItem>
              <Label>성별</Label>
              <Input
                type="text"
                name="gender"
                value={info.gender}
                readOnly={editInfo}
                onChange={handleInputChange}
                $editMode={!editInfo}
              />
            </InfoItem>
            <InfoItem>
              <Label>키</Label>
              <Input
                type={editInfo ? 'text' : 'number'}
                name="height"
                value={editInfo ? `${info.height} cm` : info.height}
                readOnly={editInfo}
                onChange={handleInputChange}
                $editMode={!editInfo}
              />
            </InfoItem>
            <InfoItem>
              <Label>목표 설정</Label>
              {editInfo ? (
                <Input
                  type="text"
                  value={info.targetType}
                  readOnly
                  $editMode={!editInfo}
                />
              ) : (
                <Select
                  name="targetType"
                  value={info.targetType}
                  onChange={handleSelectChange}
                  $editMode={!editInfo}
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
                type={editInfo ? 'text' : 'number'}
                name="targetValue"
                value={
                  editInfo
                    ? `${info.targetValue} ${getUnit(info.targetType)}`
                    : `${info.targetValue}`
                }
                readOnly={editInfo}
                onChange={handleInputChange}
                $unit={getUnit(info.targetType)}
                $editMode={!editInfo}
              />
            </InfoItem>
            <InfoItem>
              <Label>목표 보상</Label>
              <TextArea
                name="targetReward"
                value={info.targetReward}
                readOnly={editInfo}
                onChange={handleTextAreaChange}
                $editMode={!editInfo}
              ></TextArea>
            </InfoItem>
          </InfoGroup>
        </Section>
        <Divider />
        <Section>
          <SectionHeader>
            <SectionTitle>인바디 정보</SectionTitle>
            <EditButton onClick={() => openModal('inbodyModal')}>
              인바디 추가
            </EditButton>
          </SectionHeader>
          <InfoGroup>
            <InfoItem>
              <Label>
                <span>
                  <img src={weight} alt="weight icon" />
                </span>
                몸무게
              </Label>
              <Input type="text" value={`${info.weight} kg`} readOnly />
            </InfoItem>
            <InfoItem>
              <Label>
                <span>
                  <img src={bodyFat} alt="bodyFat icon" />
                </span>
                체지방률
              </Label>
              <Input
                type="text"
                value={`${info.bodyFatPercentage} %`}
                readOnly
              />
            </InfoItem>
            <InfoItem>
              <Label>
                <span>
                  <img src={muscleMass} alt="muscleMass icon" />
                </span>
                근골격량
              </Label>
              <Input type="text" value={`${info.muscleMass} kg`} readOnly />
            </InfoItem>
          </InfoGroup>
        </Section>
        <Graph>
          <Line
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'bottom',
                  align: 'start',
                  fullSize: true,
                  labels: {
                    boxWidth: 5,
                    boxHeight: 5,
                    usePointStyle: true,
                    pointStyle: 'dot',
                    font: {
                      size: 12,
                      family: 'NanumSquare',
                    },
                  },
                },
                title: {
                  display: true,
                  text: '인바디 차트',
                  align: 'start',
                },
              },
            }}
          />
        </Graph>
        <InbodyModal
          isOpen={isOpen('inbodyModal')}
          onClose={() => closeModal('inbodyModal')}
          onSave={handleSaveModal}
          inbodyData={inbodyData}
          handleDateChange={date =>
            setInbodyData(prevData => ({
              ...prevData,
              date: date || new Date(),
            }))
          }
          handleInputChange={handleInbodyInputChange}
        />
      </Wrapper>
      {errorAlert && (
        <Alert $type="error" text={errorAlert} onClose={onCloseErrorAlert} />
      )}
    </SectionWrapper>
  );
};

export default Dashboard;
