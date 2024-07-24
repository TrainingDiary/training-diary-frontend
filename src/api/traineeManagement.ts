import { NavigateFunction } from 'react-router-dom';

import { axiosInstance, createInterceptor } from './axiosInstance';

const CreateTraineeApi = (navigate: NavigateFunction) => {
  createInterceptor(navigate);

  return {
    getTrainees: () => axiosInstance.get('/pt-contracts'),

    addTrainee: (traineeEmail: string) =>
      axiosInstance.post('/pt-contracts', { traineeEmail }),
  };
};

export default CreateTraineeApi;
