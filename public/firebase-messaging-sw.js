// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts(
  'https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js'
);

const firebaseConfig = {
  apiKey: 'AIzaSyAxLUWYFvRn67L9yLk2TnMDO6VUkXKXSKk',
  authDomain: 'training-diary-e5a05.firebaseapp.com',
  projectId: 'training-diary-e5a05',
  storageBucket: 'training-diary-e5a05.appspot.com',
  messagingSenderId: '628687093769',
  appId: '1:628687093769:web:bb43a2c93262e6a0c278d8',
  measurementId: 'G-6ED7JVWWP4',
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  console.log('백그라운드 동작');
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    image: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
