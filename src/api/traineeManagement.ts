import { NavigateFunction } from 'react-router-dom';

import { axiosInstance, createInterceptor } from './axiosInstance';

let isInterceptorCreated = false;

const CreateTraineeApi = (navigate: NavigateFunction) => {
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
  };
};

export default CreateTraineeApi;
