import { NavigateFunction } from 'react-router-dom';

import { axiosInstance, createInterceptor } from './axiosInstance';

let isInterceptorCreated = false;

const CreateAppointmentApi = (navigate: NavigateFunction) => {
  if (!isInterceptorCreated) {
    createInterceptor(navigate);
    isInterceptorCreated = true;
  }

  return {
    getTrainerSchedules: (startDate: string, endDate: string) =>
      axiosInstance.get('/schedules/trainers', {
        params: {
          startDate,
          endDate,
        },
      }),
  };
};

export default CreateAppointmentApi;
