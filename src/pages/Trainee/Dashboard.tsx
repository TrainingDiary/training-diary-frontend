import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

const RadioGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 1.4rem;
  color: ${({ theme }) => theme.colors.gray900};
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

export interface AddInbodyData {
  traineeId: string | undefined;
  weight: number;
  bodyFatPercentage: number;
  skeletalMuscleMass: number;
  addedDate: string | Date;
}

export interface TraineeInfoData {
  traineeId: string | undefined;
  name: string;
  age: number;
  gender: string; // gender는 MALE 또는 FEMALE만 허용
  height: number;
  birthDate: string;
  remainingSession: number;
  weightHistory: WeightHistory[];
  bodyFatHistory: BodyFatHistory[];
  muscleMassHistory: MuscleMassHistory[];
  targetType:
    | 'TARGET_WEIGHT'
    | 'TARGET_BODY_FAT_PERCENTAGE'
    | 'TARGET_SKELETAL_MUSCLE_MASS'; // targetType은 정의된 타입만 허용
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
  const [inbodyData, setInbodyData] = useState<AddInbodyData>({
    traineeId: traineeId,
    addedDate: format(new Date(), 'yyyy-MM-dd'),
    weight: 0,
    bodyFatPercentage: 0,
    skeletalMuscleMass: 0,
  });
  const [traineeInfo, setTraineeInfo] = useState<TraineeInfoData | null>(null);

  // 트레이니 정보 조회 api 연동
  const fetchTraineeInfo = async () => {
    if (traineeId) {
      try {
        const res = await traineeApi.getTraineeInfo(traineeId);
        setTraineeInfo(res.data);
      } catch (error) {
        console.error('트레이니 정보 조회 에러:', error);
      }
    }
  };

  useEffect(() => {
    fetchTraineeInfo();
  }, [traineeId]);

  const [chartData, setChartData] = useState({
    labels: [format(new Date(), 'MM.dd.')],
    datasets: [
      {
        label: '몸무게',
        data: [0],
        borderColor: '#FF3B3B',
        pointBackgroundColor: '#FF3B3B',
        fill: false,
      },
      {
        label: '체지방률',
        data: [0],
        borderColor: '#3B98FF',
        pointBackgroundColor: '#3B98FF',
        fill: false,
      },
      {
        label: '근골격량',
        data: [0],
        borderColor: '#ADB5BD',
        pointBackgroundColor: '#ADB5BD',
        fill: false,
      },
      {
        label: '목표수치',
        data: [0],
        borderColor: '#89DAC1',
        pointBackgroundColor: '#89DAC1',
        fill: false,
      },
    ],
  });

  useEffect(() => {
    if (traineeInfo) {
      const targetTypeLabel =
        traineeInfo.targetType === 'TARGET_WEIGHT'
          ? '몸무게'
          : traineeInfo.targetType === 'TARGET_BODY_FAT_PERCENTAGE'
            ? '체지방률'
            : '근골격량';

      setChartData({
        labels: traineeInfo.weightHistory.map(
          (w: { addedDate: string | number | Date }) =>
            format(new Date(w.addedDate), 'MM.dd.')
        ),
        datasets: [
          {
            label: '몸무게',
            data: traineeInfo.weightHistory.map(
              (w: { weight: number }) => w.weight
            ),
            borderColor: '#FF3B3B',
            pointBackgroundColor: '#FF3B3B',
            fill: false,
          },
          {
            label: '체지방률',
            data: traineeInfo.bodyFatHistory.map(
              (b: { bodyFatPercentage: number }) => b.bodyFatPercentage
            ),
            borderColor: '#3B98FF',
            pointBackgroundColor: '#3B98FF',
            fill: false,
          },
          {
            label: '근골격량',
            data: traineeInfo.muscleMassHistory.map(
              (m: { muscleMass: number }) => m.muscleMass
            ),
            borderColor: '#ADB5BD',
            pointBackgroundColor: '#ADB5BD',
            fill: false,
          },
          {
            label: `목표수치(${targetTypeLabel})`,
            data: Array(traineeInfo.weightHistory.length).fill(
              traineeInfo.targetValue
            ),
            borderColor: '#89DAC1',
            pointBackgroundColor: '#89DAC1',
            fill: false,
          },
        ],
      });
    }
  }, [traineeInfo]);

  // 데이터 변경
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTraineeInfo(prevInfo =>
      prevInfo ? { ...prevInfo, [name]: value } : null
    );
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTraineeInfo(prevInfo =>
      prevInfo ? { ...prevInfo, [name]: value } : null
    );
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTraineeInfo(prevInfo =>
      prevInfo ? { ...prevInfo, [name]: value } : null
    );
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setTraineeInfo(prevInfo =>
      prevInfo ? { ...prevInfo, gender: value } : null
    );
  };

  const handleInbodyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInbodyData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  // datepicker 날짜 선택 및 나이 변경
  const handleDateChange = (date: Date | null) => {
    if (date && traineeInfo) {
      const calculatedAge = differenceInYears(new Date(), date);
      setTraineeInfo(prevInfo =>
        prevInfo
          ? {
              ...prevInfo,
              age: calculatedAge,
              birthDate: format(date, 'yyyy-MM-dd'),
            }
          : null
      );
      setSelectedDate(date);
    }
  };

  // 트레이니 정보 수정 저장 api
  const saveTraineeInfo = async () => {
    if (traineeInfo?.remainingSession === null) {
      setErrorAlert('잔여 횟수를 입력해주세요');
      return;
    } else if (traineeInfo?.birthDate === '') {
      setErrorAlert('생년월일을 입력해주세요');
      return;
    } else if (traineeInfo?.gender === '') {
      setErrorAlert('성별을 입력해주세요');
      return;
    } else if (traineeInfo?.height === null) {
      setErrorAlert('키를 입력해주세요');
      return;
    } else if (traineeInfo?.targetType === null) {
      setErrorAlert('목표 타입을 선택해주세요');
      return;
    } else if (traineeInfo?.targetValue === null) {
      setErrorAlert('목표 수치를 입력해주세요');
      return;
    } else if (traineeInfo?.targetReward === '') {
      setErrorAlert('목표 보상을 입력해주세요');
      return;
    }
    if (traineeInfo) {
      try {
        await traineeApi.updateTraineeInfo(traineeInfo);
        setEditInfo(true);
      } catch (error) {
        console.error('트레이니 정보 수정 에러:', error);
      }
    }
  };

  // inbody 정보 저장 api
  const saveInbodyInfo = async () => {
    try {
      await traineeApi.addInbodyInfo({ ...inbodyData, traineeId: traineeId });
      setTraineeInfo(prevInfo =>
        prevInfo
          ? {
              ...prevInfo,
              weightHistory: [
                ...prevInfo.weightHistory,
                {
                  addedDate: format(new Date(), 'yyyy-MM-dd'),
                  weight: inbodyData.weight,
                },
              ],
              bodyFatHistory: [
                ...prevInfo.bodyFatHistory,
                {
                  addedDate: format(new Date(), 'yyyy-MM-dd'),
                  bodyFatPercentage: inbodyData.bodyFatPercentage,
                },
              ],
              muscleMassHistory: [
                ...prevInfo.muscleMassHistory,
                {
                  addedDate: format(new Date(), 'yyyy-MM-dd'),
                  muscleMass: inbodyData.skeletalMuscleMass,
                },
              ],
            }
          : null
      );
      closeModal('inbodyModal');
    } catch (error) {
      console.error('트레이니 인바디정보 추가 에러:', error);
    }
  };

  // inbody 정보 모달 저장 로직
  const handleSaveModal = async () => {
    const { weight, bodyFatPercentage, skeletalMuscleMass } = inbodyData;
    if (weight === 0) {
      return setErrorAlert('몸무게를 입력해주세요');
    } else if (bodyFatPercentage === 0) {
      return setErrorAlert('체지방을 입력해주세요');
    } else if (skeletalMuscleMass === 0) {
      return setErrorAlert('근골격량을 입력해주세요');
    }

    const formattedDate = format(new Date(), 'MM.dd');
    setChartData(prevData => ({
      ...prevData,
      labels: [...prevData.labels, formattedDate],
      datasets: prevData.datasets.map(dataset => {
        if (dataset.label === '몸무게') {
          return {
            ...dataset,
            data: [...dataset.data, weight],
          };
        }
        if (dataset.label === '체지방률') {
          return {
            ...dataset,
            data: [...dataset.data, bodyFatPercentage],
          };
        }
        if (dataset.label === '근골격량') {
          return {
            ...dataset,
            data: [...dataset.data, skeletalMuscleMass],
          };
        }
        if (dataset.label.startsWith('목표수치')) {
          return {
            ...dataset,
            data: [...dataset.data, traineeInfo!.targetValue],
          };
        }
        return dataset;
      }),
    }));

    await saveInbodyInfo();
  };

  const handleAddInbody = () => {
    setInbodyData({
      addedDate: format(new Date(), 'yyyy-MM-dd'),
      weight: 0,
      bodyFatPercentage: 0,
      skeletalMuscleMass: 0,
      traineeId: traineeId,
    });
    openModal('inbodyModal');
  };

  const onCloseErrorAlert = () => setErrorAlert('');

  const getUnit = (targetType: string) => {
    switch (targetType) {
      case 'TARGET_BODY_FAT_PERCENTAGE':
        return '%';
      case 'TARGET_WEIGHT':
      case 'TARGET_SKELETAL_MUSCLE_MASS':
        return 'kg';
      default:
        return '';
    }
  };

  if (!traineeInfo) {
    return <div>Loading...</div>;
  }

  return (
    <SectionWrapper>
      <Wrapper>
        <Section>
          <SectionHeader>
            <SectionTitle>{traineeInfo.name}</SectionTitle>
            {user?.role === 'TRAINER' &&
              (editInfo ? (
                <EditButton
                  $editMode={editInfo}
                  onClick={() => setEditInfo(false)}
                >
                  정보 수정
                </EditButton>
              ) : (
                <EditButton $editMode={editInfo} onClick={saveTraineeInfo}>
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
                value={traineeInfo.remainingSession || 0}
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
                  value={`${traineeInfo.age} 세`}
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
              {editInfo ? (
                <Input
                  type="text"
                  name="gender"
                  value={traineeInfo.gender === 'MALE' ? '남' : '여'}
                  readOnly={editInfo}
                  onChange={handleInputChange}
                  $editMode={!editInfo}
                />
              ) : (
                <RadioGroup>
                  <RadioLabel>
                    <input
                      type="radio"
                      name="gender"
                      value="MALE"
                      checked={traineeInfo.gender === 'MALE'}
                      onChange={handleRadioChange}
                    />
                    남
                  </RadioLabel>
                  <RadioLabel>
                    <input
                      type="radio"
                      name="gender"
                      value="FEMALE"
                      checked={traineeInfo.gender === 'FEMALE'}
                      onChange={handleRadioChange}
                    />
                    여
                  </RadioLabel>
                </RadioGroup>
              )}
            </InfoItem>
            <InfoItem>
              <Label>키</Label>
              <Input
                type={editInfo ? 'text' : 'number'}
                name="height"
                value={
                  editInfo
                    ? `${traineeInfo.height} cm`
                    : traineeInfo.height || 0
                }
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
                    traineeInfo.targetType === 'TARGET_WEIGHT'
                      ? '몸무게'
                      : traineeInfo.targetType === 'TARGET_BODY_FAT_PERCENTAGE'
                        ? '체지방률'
                        : '근골격량'
                  }
                  readOnly
                  $editMode={!editInfo}
                />
              ) : (
                <Select
                  name="targetType"
                  value={traineeInfo.targetType}
                  onChange={handleSelectChange}
                  $editMode={!editInfo}
                >
                  <option value="TARGET_WEIGHT">몸무게</option>
                  <option value="TARGET_BODY_FAT_PERCENTAGE">체지방률</option>
                  <option value="TARGET_SKELETAL_MUSCLE_MASS">근골격량</option>
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
                    ? `${traineeInfo.targetValue} ${getUnit(traineeInfo.targetType || '')}`
                    : `${traineeInfo.targetValue}`
                }
                readOnly={editInfo}
                onChange={handleInputChange}
                $unit={getUnit(traineeInfo.targetType || '')}
                $editMode={!editInfo}
              />
            </InfoItem>
            <InfoItem>
              <Label>목표 보상</Label>
              <TextArea
                name="targetReward"
                value={traineeInfo.targetReward}
                readOnly={editInfo}
                onChange={handleTextAreaChange}
                $editMode={!editInfo}
                placeholder="목표 보상을 적어주세요."
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
                value={`${traineeInfo.weightHistory[traineeInfo.weightHistory.length - 1]?.weight || 0} kg`}
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
                value={`${traineeInfo.bodyFatHistory[traineeInfo.bodyFatHistory.length - 1]?.bodyFatPercentage || 0} %`}
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
                value={`${traineeInfo.muscleMassHistory[traineeInfo.muscleMassHistory.length - 1]?.muscleMass || 0} kg`}
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
