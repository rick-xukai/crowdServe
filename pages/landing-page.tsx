import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { isAndroid, isIOS } from 'react-device-detect';

import { AppleStoreLink, GooglePlayLink, AppHost } from '../constants/General';
import { Images } from '../theme';
import { LandingPageContainer } from '../styles/landingPage.style';

const LandingPage: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    let packageName = '';
    if (isIOS) {
      window.location.href = AppleStoreLink;
    }
    if (isAndroid) {
      const CallApp = require('callapp-lib');
      packageName =  process.env.NEXT_PUBLIC_APP_PACKAGE_NAME_ANDROID as string;
      const options = {
        scheme: {
          protocol: process.env.NEXT_PUBLIC_APP_DEEP_LINK_PROTOCOL,
          host: AppHost,
        },
        intent: {
          package: packageName,
          scheme: process.env.NEXT_PUBLIC_APP_DEEP_LINK_PROTOCOL,
        },
        fallback: GooglePlayLink,
      };
      const callLib = new CallApp(options);
      const code = router.asPath.split('?')[1] || '';
      callLib.open({
        path: `user.activated.cn/account?${code}`,
        callback: () => {},
      });
    }
  }, []);

  return (
    <LandingPageContainer>
      <Head>
        <title>Download CrowdServe App</title>
      </Head>
      <div className="page-header">
        <Image className="logo" src={Images.Logo} alt="" />
      </div>
      <div className="page-center">
        <div className="page-content">
          <div className="content-download">
            <div className="download-left">
              <p className="download-title">
                DOWNLOAD <br />CROWDSERVE APP
              </p>
              <div className="red-line" />
              <p className="download-description">
                Serving the Crowd, empowering fans and artists <br /> through blockchain
              </p>
              <div className="download-link">
                <a
                  href={AppleStoreLink}
                  target="_blank"
                  title="App Store"
                >
                  <Image
                    className="app-store"
                    src={Images.AppStore}
                    alt=""
                  />
                </a>
                <a
                  href={GooglePlayLink}
                  target="_blank"
                  title="Google Play"
                  className="google-play-link"
                >
                  <Image
                    className="google-play"
                    src={Images.GooglePlay}
                    alt=""
                  />
                </a>
              </div>
            </div>
          </div>
          <div className="content-detail">
            <Image
              className="phone-detail"
              src={Images.PhoneDetail}
              alt=""
            />
          </div>
        </div>
      </div>
    </LandingPageContainer>
  );
};

export default LandingPage;
