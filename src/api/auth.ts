import { NavigateFunction } from 'react-router-dom';

import { axiosInstance, createInterceptor } from './axiosInstance';

let isInterceptorCreated = false;

const CreateAuthApi = (navigate: NavigateFunction) => {
  if (!isInterceptorCreated) {
    createInterceptor(navigate);
    isInterceptorCreated = true;
  }

  return {
    signup: (
      email: string,
      password: string,
      confirmPassword: string,
      name: string,
      role: 'TRAINEE' | 'TRAINER'
    ) =>
      axiosInstance.post('/users/sign-up', {
        email,
        password,
        confirmPassword,
        name,
        role,
      }),

    login: (email: string, password: string) =>
      axiosInstance.post('/users/sign-in', { email, password }),

    logout: () => axiosInstance.post('/users/sign-out'),

    checkEmail: (email: string) =>
      axiosInstance.post('/users/check-duplicate-and-send-verification', {
        email,
      }),

    checkCode: (email: string, verificationCode: string) =>
      axiosInstance.post('/users/check-verification-code', {
        email,
        verificationCode,
      }),

    getUser: () => axiosInstance.get('/users/info'),
  };
};

export default CreateAuthApi;
