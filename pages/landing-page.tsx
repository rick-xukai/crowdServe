import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import Image from 'next/image';
import { Images } from '../theme';
import { LandingPageContainer } from '../styles/landingPage.style';

const LandingPage: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    const CallApp = require('callapp-lib');
    const options = {
      scheme: {
        protocol: 'deeplinkcrowdserve',
      },
      intent: {
        package: 'com.crowdserve.mobile.dev',
        scheme: 'deeplinkcrowdserve',
      },
      appstore: '',
    };
    const callLib = new CallApp(options);
    callLib.open({
      path: 'email.activated.cn/account',
      param: {
        email: router.query.email,
        verificationcode: router.query.verificationcode,
      },
      callback: () => {},
    });
  }, []);

  return (
    <LandingPageContainer>
      <Head>
        <title>Download CrowdServe App</title>
      </Head>
      <div className="page-hearder">
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
                  href="https://www.apple.com/app-store"
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
                  href="https://play.google.com/store"
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
