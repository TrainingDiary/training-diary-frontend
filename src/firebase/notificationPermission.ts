import { getMessaging, getToken } from 'firebase/messaging';
import { app } from 'src/firebase/initFirebase';

const requestPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    const messaging = getMessaging(app);

    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_APP_VAPID_KEY,
      });

      if (token) {
        // We can send token to server
        console.log('Token generated : ', token);
      }
    }
  } catch (error) {
    console.error('Error getting permission or token: ', error);
  }
};

export default requestPermission;
