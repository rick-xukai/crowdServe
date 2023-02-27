import type { AppProps } from 'next/app';
import { ConfigProvider } from 'antd';
import Head from 'next/head';
import { Provider } from 'react-redux';

import { wrapper } from '../app/store';
import '../styles/globals.css';

function MyApp({ Component, ...rest }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(rest);
  const { pageProps } = props;

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
      <ConfigProvider theme={{ hashed: false, token: { fontFamily: 'Heebo' } }}>
        <Component {...pageProps} />
      </ConfigProvider>
    </Provider>
  );
}

export default MyApp;
