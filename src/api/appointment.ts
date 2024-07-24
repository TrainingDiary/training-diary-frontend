import { NavigateFunction } from 'react-router-dom';

import { axiosInstance, createInterceptor } from './axiosInstance';

const CreateAppointmentApi = (navigate: NavigateFunction) => {
  createInterceptor(navigate);

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
