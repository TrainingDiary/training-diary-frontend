import { getMessaging, getToken } from 'firebase/messaging';
import { NavigateFunction } from 'react-router-dom';

import CreateNotificationApi from 'src/api/notification';
import { app } from 'src/firebase/initFirebase';

const requestPermission = async (navigate: NavigateFunction) => {
  try {
    const notificationApi = CreateNotificationApi(navigate);

    const permission = await Notification.requestPermission();
    const messaging = getMessaging(app);

    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_APP_VAPID_KEY,
      });

      if (token) {
        await notificationApi.registerFCMToken(token);
      }
    }
  } catch (error) {
    console.error('FCM 토큰 등록 에러: ', error);
  }
};

export default requestPermission;
