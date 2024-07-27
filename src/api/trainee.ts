import { NavigateFunction } from 'react-router-dom';

import { axiosInstance, createInterceptor } from './axiosInstance';
import { AddInbodyData, TraineeInfoData } from '@pages/Trainee/Dashboard';
import { SessionDataType } from '@components/Trainee/AddSessionModal';

let isInterceptorCreated = false;

const CreateTraineeApi = (navigate: NavigateFunction) => {
  if (!isInterceptorCreated) {
    createInterceptor(navigate);
    isInterceptorCreated = true;
  }

  return {
    // dashboard
    getTraineeInfo: (id: string | undefined) =>
      axiosInstance.get(`trainers/trainees/${id}`),

    updateTraineeInfo: (traineeData: TraineeInfoData) =>
      axiosInstance.put('trainers/trainees', traineeData),

    addInbodyInfo: (inbodyData: AddInbodyData) =>
      axiosInstance.post('trainers/trainees', inbodyData),

    //session
    getSessionsList: (id: string | undefined, page: number, size: number) =>
      axiosInstance.get(`workout-sessions/trainees/${id}`, {
        params: {
          page,
          size,
        },
      }),

    addSession: (sessionData: SessionDataType) =>
      axiosInstance.post('workout-sessions', sessionData),
  };
};

export default CreateTraineeApi;
