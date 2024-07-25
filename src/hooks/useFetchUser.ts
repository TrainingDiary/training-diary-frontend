import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import useUserStore, { User } from 'src/stores/userStore';
import CreateAuthApi from 'src/api/auth';

const useFetchUser = () => {
  const navigate = useNavigate();
  const AuthApi = CreateAuthApi(navigate);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await AuthApi.getUser();
        const userData = response.data;
        const user: User = {
          id: userData.id,
          role: userData.role,
          unreadNotification: userData.unreadNotification,
        };

        useUserStore.getState().setUser(user);
      } catch (error) {
        useUserStore.getState().clearUser();
        console.error('유저 정보 조회 에러: ', error);
      }
    };

    fetchUser();
  }, []);
};

export default useFetchUser;
