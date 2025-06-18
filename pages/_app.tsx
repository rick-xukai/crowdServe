import { useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import { ConfigProvider } from 'antd';
import { Provider } from 'react-redux';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { GoogleOAuthProvider } from '@react-oauth/google';

import firebaseApp from '../firebase';
import { wrapper } from '../app/store';
import '../styles/globals.css';
import UserService from '../services/API/User/User.service';
import Maintenance from '../pages/maintenance';
import { GOOLE_CLIENT_ID } from '@/constants/predicates';
import RootLayout from '@/components/RootLayout';

// 初始化MSW
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  import('../mocks/browser').then(async ({ worker }) => {
    await worker.start({
      onUnhandledRequest: 'bypass',
    });
    console.log('🔶 Mock Service Worker started');
  });
}

function MyApp({ Component, ...rest }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(rest);
  const { pageProps } = props;

  const [maintenanceApi, setMaintenanceApi] = useState<boolean>(false);

  const requestMaintenance = async () => {
    try {
      const isApiMaintenance = await UserService.checkApiMaintenance();
      if (isApiMaintenance === 1) {
        setMaintenanceApi(true);
      }
    } catch (error) {
      setMaintenanceApi(false);
      return {};
    }
  };

  useEffect(() => {
    requestMaintenance();
    const analytics = getAnalytics(firebaseApp);
    logEvent(analytics, 'screen_view');
  }, []);

  return (
    <Provider store={store}>
      <GoogleOAuthProvider clientId={GOOLE_CLIENT_ID}>
        <ConfigProvider
          theme={{ hashed: false, token: { fontFamily: 'Heebo' } }}
        >
          <RootLayout>
            {(maintenanceApi && <Maintenance />) || (
              <Component {...pageProps} />
            )}
          </RootLayout>
        </ConfigProvider>
      </GoogleOAuthProvider>
    </Provider>
  );
}

export default MyApp;
