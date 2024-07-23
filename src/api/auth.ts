import { NavigateFunction } from 'react-router-dom';

import { axiosInstance, createInterceptor } from './axiosInstance';
import useUserStore, { User } from 'src/stores/userStore';

const AuthApi = (navigate: NavigateFunction) => {
  createInterceptor(navigate);

  const { setUser } = useUserStore.getState();

  return {
    login: (email: string, password: string) =>
      axiosInstance.post('/users/sign-in', { email, password }),

    getUser: async () => {
      try {
        const response = await axiosInstance.get('/users/info');
        const userData = response.data;
        const user: User = {
          id: userData.id,
          role: userData.role,
          unreadNotification: userData.unreadNotification,
        };

        setUser(user);
        return user;
      } catch (error) {
        console.error('유저 정보 조회 실패: ', error);
        throw error;
      }
    },
  };
};

export default AuthApi;
