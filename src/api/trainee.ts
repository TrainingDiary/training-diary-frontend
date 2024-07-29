import { NavigateFunction } from 'react-router-dom';

import { axiosInstance, createInterceptor } from './axiosInstance';
import { AddInbodyData, TraineeInfoData } from '@pages/Trainee/Dashboard';

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
  };
};

export default CreateTraineeApi;
