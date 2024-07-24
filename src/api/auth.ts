import { NavigateFunction } from 'react-router-dom';

import { axiosInstance, createInterceptor } from './axiosInstance';

let isInterceptorCreated = false;

const CreateAuthApi = (navigate: NavigateFunction) => {
  if (!isInterceptorCreated) {
    createInterceptor(navigate);
    isInterceptorCreated = true;
  }

  return {
    login: (email: string, password: string) =>
      axiosInstance.post('/users/sign-in', { email, password }),

    logout: () => axiosInstance.post('/users/sign-out'),

    checkEmail: (email: string) =>
      axiosInstance.post('/users/check-duplicate-and-send-verification', {
        email,
      }),

    getUser: () => axiosInstance.get('/users/info'),
  };
};

export default CreateAuthApi;
