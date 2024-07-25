import { NavigateFunction } from 'react-router-dom';

import { axiosInstance, createInterceptor } from './axiosInstance';
import { WorkoutDataType } from '@pages/Trainer/WorkOutManagement';

let isInterceptorCreated = false;

const CreateTrainerApi = (navigate: NavigateFunction) => {
  if (!isInterceptorCreated) {
    createInterceptor(navigate);
    isInterceptorCreated = true;
  }

  return {
    getTrainees: (sortBy: string, page: number, size: number) =>
      axiosInstance.get('/pt-contracts', {
        params: {
          sortBy,
          page,
          size,
        },
      }),

    addTrainee: (traineeEmail: string) =>
      axiosInstance.post('/pt-contracts', { traineeEmail }),

    deleteTrainee: (ptContractId: number) =>
      axiosInstance.post('/pt-contracts/terminate', { ptContractId }),

    getWorkouts: (page: number, size: number) =>
      axiosInstance.get('/workout-types', {
        params: {
          page,
          size,
        },
      }),

    addWorkouts: (workoutData: WorkoutDataType) =>
      axiosInstance.post('/workout-types', workoutData),

    editWorkouts: (workoutData: WorkoutDataType) =>
      axiosInstance.put('/workout-types', workoutData),

    deleteWorkouts: (id: number) =>
      axiosInstance.delete(`/workout-types/${id}`),
  };
};

export default CreateTrainerApi;
