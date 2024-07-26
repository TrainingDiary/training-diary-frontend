import { NavigateFunction } from 'react-router-dom';

import { axiosInstance, createInterceptor } from './axiosInstance';
import {
  BodyFatHistory,
  MuscleMassHistory,
  TraineeInfoData,
  WeightHistory,
} from '@pages/Trainee/Dashboard';

let isInterceptorCreated = false;

const CreateTraineeApi = (navigate: NavigateFunction) => {
  if (!isInterceptorCreated) {
    createInterceptor(navigate);
    isInterceptorCreated = true;
  }

  return {
    getTraineeInfo: (id: string | undefined) =>
      axiosInstance.get(`trainers/trainees/${id}`),

    updateTraineeInfo: (traineeData: TraineeInfoData) =>
      axiosInstance.put('trainers/trainees', traineeData),

    addInbodyInfo: (
      inbodyData: WeightHistory | BodyFatHistory | MuscleMassHistory
    ) => axiosInstance.post('trainers/trainees', inbodyData),
  };
};

export default CreateTraineeApi;
