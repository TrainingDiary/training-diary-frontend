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
    // Dashboard
    getTraineeInfo: (id: string | undefined) =>
      axiosInstance.get(`trainers/trainees/${id}`),

    updateTraineeInfo: (traineeData: TraineeInfoData) =>
      axiosInstance.put('trainers/trainees', traineeData),

    addInbodyInfo: (inbodyData: AddInbodyData) =>
      axiosInstance.post('trainers/trainees', inbodyData),

    // Session
    getSessionsList: (id: string | undefined, page?: number, size?: number) =>
      axiosInstance.get(`workout-sessions/trainees/${id}`, {
        params: {
          page,
          size,
        },
      }),

    addSession: (sessionData: SessionDataType) =>
      axiosInstance.post('workout-sessions', sessionData),

    // Diet
    addDiet: (image: File, content: string) => {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('content', JSON.stringify(content));

      return axiosInstance.post('/diets/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },

    deleteDiet: (id: number) => axiosInstance.delete(`/diets/${id}`),

    getDiets: (id: number, page: number, size: number) =>
      axiosInstance.get(`/diets/${id}`, {
        params: { page, size },
      }),

    getDietDetail: (id: number) => axiosInstance.get(`/diets/${id}/details`),

    addComment: (id: number, comment: string) =>
      axiosInstance.post('/comments/', { id, comment }),

    editComment: (id: number, comment: string) =>
      axiosInstance.put('/comments/', { id, comment }),

    deleteComment: (id: number) => axiosInstance.delete(`/comments/${id}`),
  };
};

export default CreateTraineeApi;
