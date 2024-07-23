import { useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { onMessage } from 'firebase/messaging';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { messaging } from './firebase/firebaseConfig';
import AppRoutes from './routes';
import GlobalStyles from './styles/globalStyles';
import theme from './styles/theme';
import PushMessage from '@components/Common/PushMessage';

function App() {
  useEffect(() => {
    onMessage(messaging, payload => {
      console.log('Message received. ', payload);
      if (payload.notification) {
        toast(<PushMessage notification={payload.notification} />);
      }
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <AppRoutes />
      <ToastContainer />
    </ThemeProvider>
  );
}

export default App;
