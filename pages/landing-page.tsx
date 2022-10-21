import type { NextPage } from 'next';
import React from 'react';
import Image from 'next/image';
import { Images } from '../theme';
import { LandingPageContainer } from '../styles/landingPage.style';

const LandingPage: NextPage = () => {
  return (
    <LandingPageContainer>
      <div className="page-hearder">
        <Image className="logo" src={Images.Logo} alt="" />
      </div>
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
    </LandingPageContainer>
  );
};

export default LandingPage;
