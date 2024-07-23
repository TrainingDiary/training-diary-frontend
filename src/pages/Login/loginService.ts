import { getToken } from 'firebase/messaging';
import { toast } from 'react-toastify';

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
        toast.success('Notification permission granted. Token generated.');
      }
    } else if (permission === 'denied') {
      // Notifications are blocked
      toast.error('Notification permission denied.');
    }
  } catch (error) {
    console.error('Error getting permission or token: ', error);
    toast.error('Error getting permission or token.');
  }
};

export default requestPermission;
