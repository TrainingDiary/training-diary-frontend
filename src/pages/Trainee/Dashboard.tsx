// Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
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

import weight from '@icons/dashboard/weight.svg';
import bodyFat from '@icons/dashboard/bodyFat.svg';
import muscleMass from '@icons/dashboard/muscleMass.svg';
import { SectionWrapper } from '@components/Common/SectionWrapper';
import Alert from '@components/Common/Alert/Alert';
import InbodyModal from '@components/Trainee/InbodyModal';
import Calendar from '@components/Trainee/Calendar';
import { hexToRgba } from 'src/utils/hexToRgba';
import useModals from 'src/hooks/useModals';
import useUserStore from 'src/stores/userStore';
import CreateTraineeApi from 'src/api/trainee';
import useFetchUser from 'src/hooks/useFetchUser';

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

export interface WeightHistory {
  addedDate: string;
  weight: number;
}

export interface BodyFatHistory {
  addedDate: string;
  bodyFatPercentage: number;
}

export interface MuscleMassHistory {
  addedDate: string;
  muscleMass: number;
}

export interface TraineeInfoData {
  traineeId: number;
  name: string;
  age: number;
  gender: 'MALE' | 'FEMALE'; // gender는 MALE 또는 FEMALE만 허용
  height: number;
  birthDate: string;
  remainingSession: number;
  weightHistory: WeightHistory[];
  bodyFatHistory: BodyFatHistory[];
  muscleMassHistory: MuscleMassHistory[];
  targetType: 'TARGET_WEIGHT' | 'TARGET_BODY_FAT' | 'TARGET_MUSCLE_MASS'; // targetType은 정의된 타입만 허용
  targetValue: number;
  targetReward: string;
}

const Dashboard: React.FC = () => {
  useFetchUser();
  const navigate = useNavigate();
  const traineeApi = CreateTraineeApi(navigate);
  const { traineeId } = useParams<{ traineeId: string }>();
  const user = useUserStore(state => state.user);
  const { openModal, closeModal, isOpen } = useModals();
  const [editInfo, setEditInfo] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [errorAlert, setErrorAlert] = useState<string>('');
  const [inbodyData, setInbodyData] = useState<
    WeightHistory | BodyFatHistory | MuscleMassHistory
  >({
    addedDate: format(new Date(), 'yyyy-MM-dd'),
    weight: 0,
    bodyFatPercentage: 0,
    muscleMass: 0,
  });
  const [info, setInfo] = useState<TraineeInfoData | null>(null);

  const { data, isLoading, refetch } = useQuery(
    ['traineeInfo', traineeId],
    () => traineeApi.getTraineeInfo(traineeId),
    {
      keepPreviousData: true,
      onSuccess: data => {
        const traineeInfo = data.data;
        setInfo({
          ...traineeInfo,
          age: differenceInYears(new Date(), new Date(traineeInfo.birthDate)),
        });
        const chartLabels = traineeInfo.weightHistory.map(item =>
          format(new Date(item.addedDate), 'MM.dd.')
        );
        setChartData({
          labels: chartLabels,
          datasets: [
            {
              label: '몸무게',
              data: traineeInfo.weightHistory.map(item => item.weight),
              borderColor: '#FF3B3B',
              pointBackgroundColor: '#FF3B3B',
              fill: false,
            },
            {
              label: '체지방률',
              data: traineeInfo.bodyFatHistory.map(
                item => item.bodyFatPercentage
              ),
              borderColor: '#3B98FF',
              pointBackgroundColor: '#3B98FF',
              fill: false,
            },
            {
              label: '근골격량',
              data: traineeInfo.muscleMassHistory.map(item => item.muscleMass),
              borderColor: '#ADB5BD',
              pointBackgroundColor: '#ADB5BD',
              fill: false,
            },
            {
              label: `목표수치(${traineeInfo.targetType})`,
              data: Array(chartLabels.length).fill(traineeInfo.targetValue),
              borderColor: '#89DAC1',
              pointBackgroundColor: '#89DAC1',
              fill: false,
            },
          ],
        });
      },
    }
  );

  const [chartData, setChartData] = useState({
    labels: [format(new Date(), 'MM.dd.')],
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
        label: `목표수치(${info?.targetType || '몸무게'})`,
        data: [70],
        borderColor: '#89DAC1',
        pointBackgroundColor: '#89DAC1',
        fill: false,
      },
    ],
  });

  useEffect(() => {
    if (info) {
      setChartData(prevData => ({
        ...prevData,
        datasets: prevData.datasets.map(dataset => {
          if (dataset.label.startsWith('목표수치')) {
            return {
              ...dataset,
              label: `목표수치(${info.targetType})`,
              data: Array(prevData.labels.length).fill(info.targetValue),
            };
          }
          return dataset;
        }),
      }));
    }
  }, [info]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInfo(
      prevInfo =>
        ({
          ...prevInfo,
          [name]: value,
        }) as TraineeInfoData
    );
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInfo(
      prevInfo =>
        ({
          ...prevInfo,
          [name]: value,
        }) as TraineeInfoData
    );
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInfo(
      prevInfo =>
        ({
          ...prevInfo,
          [name]: value,
        }) as TraineeInfoData
    );
  };

  const handleInbodyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInbodyData(
      prevData =>
        ({
          ...prevData,
          [name]: value,
        }) as WeightHistory | BodyFatHistory | MuscleMassHistory
    );
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const calculatedAge = differenceInYears(new Date(), date);
      setInfo(
        prevInfo =>
          ({
            ...prevInfo,
            age: calculatedAge,
            birthDate: format(date, 'yyyy-MM-dd'),
          }) as TraineeInfoData
      );
      setSelectedDate(date);
    }
  };

  const handleSaveModal = () => {
    const requiredFields = ['weight', 'bodyFatPercentage', 'muscleMass'];
    for (const field of requiredFields) {
      if (
        !inbodyData[
          field as
            | keyof WeightHistory
            | keyof BodyFatHistory
            | keyof MuscleMassHistory
        ]
      ) {
        switch (field) {
          case 'weight':
            return setErrorAlert('몸무게를 입력해주세요');
          case 'bodyFatPercentage':
            return setErrorAlert('체지방을 입력해주세요');
          case 'muscleMass':
            return setErrorAlert('근골격량을 입력해주세요');
          default:
            return;
        }
      }
    }

    const formattedDate = format(new Date(), 'MM.dd');
    setChartData(prevData => ({
      ...prevData,
      labels: [...prevData.labels, formattedDate],
      datasets: prevData.datasets.map(dataset => {
        if (dataset.label === '몸무게') {
          return {
            ...dataset,
            data: [...dataset.data, (inbodyData as WeightHistory).weight],
          };
        }
        if (dataset.label === '체지방률') {
          return {
            ...dataset,
            data: [
              ...dataset.data,
              (inbodyData as BodyFatHistory).bodyFatPercentage,
            ],
          };
        }
        if (dataset.label === '근골격량') {
          return {
            ...dataset,
            data: [
              ...dataset.data,
              (inbodyData as MuscleMassHistory).muscleMass,
            ],
          };
        }
        if (dataset.label.startsWith('목표수치')) {
          return {
            ...dataset,
            data: [...dataset.data, info!.targetValue],
          };
        }
        return dataset;
      }),
    }));

    setInfo(
      prevInfo =>
        ({
          ...prevInfo,
          weightHistory: [
            ...prevInfo!.weightHistory,
            {
              addedDate: format(new Date(), 'yyyy-MM-dd'),
              weight: (inbodyData as WeightHistory).weight,
            },
          ],
          bodyFatHistory: [
            ...prevInfo!.bodyFatHistory,
            {
              addedDate: format(new Date(), 'yyyy-MM-dd'),
              bodyFatPercentage: (inbodyData as BodyFatHistory)
                .bodyFatPercentage,
            },
          ],
          muscleMassHistory: [
            ...prevInfo!.muscleMassHistory,
            {
              addedDate: format(new Date(), 'yyyy-MM-dd'),
              muscleMass: (inbodyData as MuscleMassHistory).muscleMass,
            },
          ],
        }) as TraineeInfoData
    );

    closeModal('inbodyModal');
  };

  const handleSaveInfo = () => {
    const requiredFields = [
      'remainingSession',
      'birthDate',
      'gender',
      'height',
      'targetValue',
      'targetReward',
    ];
    for (const field of requiredFields) {
      if (!info![field as keyof TraineeInfoData]) {
        switch (field) {
          case 'remainingSession':
            return setErrorAlert('잔여 횟수를 입력해주세요');
          case 'birthDate':
            return setErrorAlert('생년월일을 입력해주세요');
          case 'gender':
            return setErrorAlert('성별을 입력해주세요');
          case 'height':
            return setErrorAlert('키를 입력해주세요');
          case 'targetValue':
            return setErrorAlert('목표 수치를 입력해주세요');
          case 'targetReward':
            return setErrorAlert('목표 보상을 입력해주세요');
          default:
            return;
        }
      }
    }

    const genderForServer = info!.gender === '남' ? 'MALE' : 'FEMALE';

    console.log({
      ...info,
      gender: genderForServer,
    });
    setEditInfo(true);
  };

  const handleAddInbody = () => {
    setInbodyData({
      addedDate: format(new Date(), 'yyyy-MM-dd'),
      weight: 0,
      bodyFatPercentage: 0,
      muscleMass: 0,
    });
    openModal('inbodyModal');
  };

  const onCloseErrorAlert = () => setErrorAlert('');

  const getUnit = (targetType: string) => {
    switch (targetType) {
      case 'TARGET_BODY_FAT':
        return '%';
      case 'TARGET_WEIGHT':
      case 'TARGET_MUSCLE_MASS':
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
            <SectionTitle>{info?.name}</SectionTitle>
            {user?.role === 'TRAINER' &&
              (editInfo ? (
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
              ))}
          </SectionHeader>
          <InfoGroup>
            <InfoItem>
              <Label>잔여 횟수</Label>
              <Input
                type="number"
                name="remainingSession"
                value={info?.remainingSession || 0}
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
                  value={`${info?.age} 세`}
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
                value={info?.gender === 'MALE' ? '남' : '여'}
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
                value={editInfo ? `${info?.height} cm` : info?.height || 0}
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
                  value={
                    info?.targetType === 'TARGET_WEIGHT'
                      ? '몸무게'
                      : info?.targetType === 'TARGET_BODY_FAT'
                        ? '체지방률'
                        : '근골격량'
                  }
                  readOnly
                  $editMode={!editInfo}
                />
              ) : (
                <Select
                  name="targetType"
                  value={info?.targetType}
                  onChange={handleSelectChange}
                  $editMode={!editInfo}
                >
                  <option value="TARGET_WEIGHT">몸무게</option>
                  <option value="TARGET_BODY_FAT">체지방률</option>
                  <option value="TARGET_MUSCLE_MASS">근골격량</option>
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
                    ? `${info?.targetValue} ${getUnit(info?.targetType || '')}`
                    : `${info?.targetValue}`
                }
                readOnly={editInfo}
                onChange={handleInputChange}
                $unit={getUnit(info?.targetType || '')}
                $editMode={!editInfo}
              />
            </InfoItem>
            <InfoItem>
              <Label>목표 보상</Label>
              <TextArea
                name="targetReward"
                value={info?.targetReward}
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
            {user?.role === 'TRAINER' ? (
              <EditButton onClick={handleAddInbody}>인바디 추가</EditButton>
            ) : null}
          </SectionHeader>
          <InfoGroup>
            <InfoItem>
              <Label>
                <span>
                  <img src={weight} alt="weight icon" />
                </span>
                몸무게
              </Label>
              <Input
                type="text"
                value={`${info?.weightHistory[info.weightHistory.length - 1]?.weight || 0} kg`}
                readOnly
              />
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
                value={`${info?.bodyFatHistory[info.bodyFatHistory.length - 1]?.bodyFatPercentage || 0} %`}
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
              <Input
                type="text"
                value={`${info?.muscleMassHistory[info.muscleMassHistory.length - 1]?.muscleMass || 0} kg`}
                readOnly
              />
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
              addedDate: format(date || new Date(), 'yyyy-MM-dd'),
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
