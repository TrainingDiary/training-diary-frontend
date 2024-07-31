importScripts(
  'https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js'
);

self.addEventListener('install', e => {
  self.skipWaiting();
});

const firebaseConfig = {
  apiKey: 'AIzaSyAxLUWYFvRn67L9yLk2TnMDO6VUkXKXSKk',
  authDomain: 'training-diary-e5a05.firebaseapp.com',
  projectId: 'training-diary-e5a05',
  storageBucket: 'training-diary-e5a05.appspot.com',
  messagingSenderId: '628687093769',
  appId: '1:628687093769:web:bb43a2c93262e6a0c278d8',
  measurementId: 'G-WDHWRZNXYC',
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
