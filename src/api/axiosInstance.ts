import axios, { AxiosError, AxiosResponse } from 'axios';
import { NavigateFunction } from 'react-router-dom';

const axiosInstance = axios.create({
  baseURL: 'https://api.training-diary.co.kr/api',
  withCredentials: true, //필요한 경우 사용 (클라이언트 로컬에서는 주석처리해야 쿠키 받아옴)
});

const createInterceptor = (navigate: NavigateFunction): void => {
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        navigate('/login');
      } else if (error.response?.status === 404) {
        navigate('/not-found');
      }
      return Promise.reject(error);
    }
  );
};

export { axiosInstance, createInterceptor };
