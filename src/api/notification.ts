import { NavigateFunction } from 'react-router-dom';

import { axiosInstance, createInterceptor } from './axiosInstance';

let isInterceptorCreated = false;

const CreateNotificationApi = (navigate: NavigateFunction) => {
  if (!isInterceptorCreated) {
    createInterceptor(navigate);
    isInterceptorCreated = true;
  }
  return {
    registerFCMToken: (token: string) =>
      axiosInstance.put('/notifications/fcm-token', { token }),
  };
};

export default CreateNotificationApi;
