import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';

import App from './App.tsx';
import registerServiceWorker from './firebase/registerServiceWorker.ts';

const queryClient = new QueryClient();

// enableMocking 함수 정의
async function enableMocking() {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  const { worker } = await import('./mocks/browser');

  // `worker.start()`는 Service Worker가 요청을 가로채기 위해 준비될 때까지 대기합니다.
  return worker.start();
}

registerServiceWorker();
enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </React.StrictMode>
  );
});
