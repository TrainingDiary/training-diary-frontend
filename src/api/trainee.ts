import { NavigateFunction } from 'react-router-dom';

import { axiosInstance, createInterceptor } from './axiosInstance';
import { AddInbodyData, TraineeInfoData } from '@pages/Trainee/Dashboard';
import { SessionDetailType } from '@pages/Trainee/SessionDetail';
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
    getSessionsList: (id: string | undefined, page?: number, size?: number) =>
      axiosInstance.get(`workout-sessions/trainees/${id}`, {
        params: {
          page,
          size,
        },
      }),

    addSession: (sessionData: SessionDataType) =>
      axiosInstance.post('workout-sessions', sessionData),

    getSessionDetail: (id: number) =>
      axiosInstance.get(`workout-sessions/${id}`),

    updateSession: (sessionData: SessionDetailType) =>
      axiosInstance.put('workout-sessions', sessionData),

    deleteSession: (id: string | undefined) =>
      axiosInstance.delete(`workout-sessions/${id}`),

    sessionPhotoUpload: (sessionId: string | undefined, images: string[]) =>
      axiosInstance.put('workout-sessions/photos', {
        sessionId,
        images,
      }),

    sessionVideoUpload: (sessionId: string | undefined, video: string) =>
      axiosInstance.put('workout-sessions/videos', {
        sessionId,
        video,
      }),
  };
};

export default CreateTraineeApi;
