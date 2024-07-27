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

  return {
    registerSchedules: ({
      traineeId,
      dateTimes,
    }: {
      traineeId: number;
      dateTimes: { startDate: string; startTimes: string[] }[];
    }) =>
      axiosInstance.post('/schedules/trainers/register', {
        traineeId,
        dateTimes,
      }),

    openSchedules: (dateTimes: { startDate: string; startTimes: string[] }[]) =>
      axiosInstance.post('/schedules/trainers/open', {
        dateTimes,
      }),

    closeSchedules: (scheduleIds: number[]) =>
      axiosInstance.post('/schedules/trainers/close', { scheduleIds }),

    applySchedule: (scheduleId: number) =>
      axiosInstance.post('/schedules/trainees/apply', { scheduleId }),

    cancelSchedule: (scheduleId: number) => {
      if (user?.role === 'TRAINER') {
        return axiosInstance.post('/schedules/trainers/cancel', { scheduleId });
      } else if (user?.role === 'TRAINEE') {
        return axiosInstance.post('/schedules/trainees/cancel', { scheduleId });
      }
    },

    getSchedules: (startDate: string, endDate: string) => {
      if (user?.role === 'TRAINER') {
        return axiosInstance.get('/schedules/trainers', {
          params: { startDate, endDate },
        });
      } else if (user?.role === 'TRAINEE') {
        return axiosInstance.get('/schedules/trainees', {
          params: { startDate, endDate },
        });
      }
    },
  };
};

export default CreateAppointmentApi;
