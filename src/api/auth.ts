import { NavigateFunction } from 'react-router-dom';

import { axiosInstance, createInterceptor } from './axiosInstance';

const CreateAuthApi = (navigate: NavigateFunction) => {
  createInterceptor(navigate);

  return {
    login: (email: string, password: string) =>
      axiosInstance.post('/users/sign-in', { email, password }),

    getUser: () => axiosInstance.get('/users/info'),
  };
};

export default CreateAuthApi;
