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

    getSessionDetail: (id: number) =>
      axiosInstance.get(`workout-sessions/${id}`),

    updateSession: (sessionData: SessionDetailType) =>
      axiosInstance.put('workout-sessions', sessionData),

    deleteSession: (id: string | undefined) =>
      axiosInstance.delete(`workout-sessions/${id}`),

    sessionPhotoUpload: (sessionId: string | undefined, images: File[]) => {
      const formData = new FormData();
      formData.append('sessionId', sessionId as string);
      Array.from(images).forEach(image => {
        formData.append('images', image);
      });
      return axiosInstance.put('workout-sessions/photos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },

    sessionVideoUpload: (sessionId: string | undefined, video: File) => {
      const formData = new FormData();
      formData.append('sessionId', sessionId as string);
      formData.append('video', video);
      return axiosInstance.put('workout-sessions/videos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },

    // Diet
    addDiet: (image: File, content: string) => {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('content', JSON.stringify(content));

      return axiosInstance.post('/diets', formData, {
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
      axiosInstance.post('/comments', { id, comment }),

    editComment: (id: number, comment: string) =>
      axiosInstance.put('/comments', { id, comment }),

    deleteComment: (id: number) => axiosInstance.delete(`/comments/${id}`),
  };
};

export default CreateTraineeApi;
