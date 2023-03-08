import React, { useRef } from 'react';
import Image from 'next/image';
import { Button } from 'antd';
import { isAndroid, isIOS } from 'react-device-detect';

import { Images } from '../theme';
import { openApp } from '../utils/func';
import { AppLandingPage } from '../constants/General';
import PageHearderComponent from '../components/pageHearder';
import { MyWalletContainer } from '../styles/my-wallet.style';

const MyWallet = () => {
  const openAppInIos = useRef<any>(null);

  const handleOpenApp = () => {
    if (isIOS) {
      openAppInIos.current.click();
    } else if (isAndroid) {
      openApp();
    }
  };

  return (
    <MyWalletContainer>
      <PageHearderComponent />
      <div className="page-main">
        <Image src={Images.MyWalletIcon} alt="" />
        <p className="title">
          Open the app to access the full functionality.
        </p>
        <p className="info">
          With our app, you can view your account balance, track your transaction history.
        </p>
      </div>
      <div className="page-bottom">
        <Button onClick={handleOpenApp}>
          OPEN NOW
        </Button>
      </div>
      <a ref={openAppInIos} href={AppLandingPage} style={{ display: 'none' }} />
    </MyWalletContainer>
  );
};

export default MyWallet;
