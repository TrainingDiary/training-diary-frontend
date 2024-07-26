const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js', {
          scope: '/firebase-cloud-messaging-push-scope',
        })
        .catch(function (err) {
          console.log('Service Worker 등록 실패:', err);
        });
    });
  }
};

export default registerServiceWorker;
