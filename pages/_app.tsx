import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import { ConfigProvider } from 'antd';
import Head from 'next/head';
import { Provider } from 'react-redux';
import { getAnalytics, logEvent } from 'firebase/analytics';
// import { GoogleOAuthProvider } from '@react-oauth/google';

import firebaseApp from '../firebase';
import { wrapper } from '../app/store';
import '../styles/globals.css';

function MyApp({ Component, ...rest }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(rest);
  const { pageProps } = props;

  useEffect(() => {
    const analytics = getAnalytics(firebaseApp);
    logEvent(analytics, 'screen_view');
  }, []);

  return (
    <Provider store={store}>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <meta name="referrer" content="no-referrer" />
        <title>CrowdServe</title>
      </Head>
      {/* <GoogleOAuthProvider clientId='crowdserve_test'>
        <ConfigProvider theme={{ hashed: false, token: { fontFamily: 'Heebo' } }}>
          <Component {...pageProps} />
        </ConfigProvider>
      </GoogleOAuthProvider> */}
      <ConfigProvider theme={{ hashed: false, token: { fontFamily: 'Heebo' } }}>
        <Component {...pageProps} />
      </ConfigProvider>
    </Provider>
  );
}

export default MyApp;
