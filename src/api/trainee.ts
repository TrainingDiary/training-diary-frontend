import { NavigateFunction } from 'react-router-dom';

import { axiosInstance, createInterceptor } from './axiosInstance';

let isInterceptorCreated = false;

const CreateTraineeApi = (navigate: NavigateFunction) => {
  if (!isInterceptorCreated) {
    createInterceptor(navigate);
    isInterceptorCreated = true;
  }

  return {
    getTraineeInfo: (id: string | undefined) =>
      axiosInstance.get(`trainers/trainees/${id}`),

    addInbodyInfo: () => axiosInstance.post('trainers/trainees/'),
  };
};

export default CreateTraineeApi;
