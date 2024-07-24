import axios, { AxiosError, AxiosResponse } from 'axios';
import { NavigateFunction } from 'react-router-dom';

import useUserStore from 'src/stores/userStore';

const axiosInstance = axios.create({
  baseURL: 'https://api.training-diary.co.kr/api',
  withCredentials: true,
});

const createInterceptor = (navigate: NavigateFunction): void => {
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        useUserStore.getState().clearUser();

        navigate('/login');
      } else if (error.response?.status === 404) {
        navigate('/not-found');
      }
      return Promise.reject(error);
    }
  );
};

export { axiosInstance, createInterceptor };
