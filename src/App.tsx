import { useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { getMessaging, onMessage } from 'firebase/messaging';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AppRoutes from './routes';
import GlobalStyles from './styles/globalStyles';
import theme from './styles/theme';
import PushMessage from '@components/Common/PushMessage';
import InstallBanner from '@components/Common/InstallBanner';
import { app } from './firebase/initFirebase';

function App() {
  useEffect(() => {
    const messaging = getMessaging(app);

    onMessage(messaging, payload => {
      if (payload.notification) {
        toast(<PushMessage notification={payload.notification} />);
      }
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <InstallBanner />
      <AppRoutes />
      <ToastContainer />
    </ThemeProvider>
  );
}

export default App;
