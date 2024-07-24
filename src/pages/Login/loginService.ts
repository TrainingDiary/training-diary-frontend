import { getToken } from 'firebase/messaging';

import { messaging } from 'src/firebase/firebaseConfig';

const requestPermission = async () => {
  try {
    const { VITE_APP_VAPID_KEY } = import.meta.env;

    // Requesting permission using Notification API
    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: VITE_APP_VAPID_KEY,
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
