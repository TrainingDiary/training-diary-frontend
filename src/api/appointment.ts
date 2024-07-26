import { NavigateFunction } from 'react-router-dom';

import { axiosInstance, createInterceptor } from './axiosInstance';
import useUserStore from 'src/stores/userStore';

let isInterceptorCreated = false;

const CreateAppointmentApi = (navigate: NavigateFunction) => {
  if (!isInterceptorCreated) {
    createInterceptor(navigate);
    isInterceptorCreated = true;
  }

  const { user } = useUserStore.getState();
  if (!user) return;

  return {
    getSchedules: (startDate: string, endDate: string) => {
      if (user.role === 'TRAINER') {
        return axiosInstance.get('/schedules/trainers', {
          params: { startDate, endDate },
        });
      } else if (user.role === 'TRAINEE') {
        return axiosInstance.get('/schedules/trainees', {
          params: { startDate, endDate },
        });
      }
    },
  };
};

export default CreateAppointmentApi;
