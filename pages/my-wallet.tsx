import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Button, Col } from 'antd';
import { isAndroid, isIOS, isDesktop } from 'react-device-detect';

import { Images } from '../theme';
import { openApp } from '../utils/func';
import { RouterKeys } from '../constants/Keys';
import { AppLandingPage } from '../constants/General';
import PageHearderComponent from '../components/pageHearder';
import { MyWalletContainer } from '../styles/my-wallet.style';
import PageHearderResponsive from '../components/pageHearderResponsive';
import PageBottomComponent from '../components/pageBottomComponent';

const MyWallet = () => {
  const openAppInIos = useRef<any>(null);
  const router = useRouter();

  const [menuState, setMenuState] = useState<boolean>(false);

  const handleOpenApp = () => {
    if (isDesktop) {
      router.push(RouterKeys.landingPage);
    } else {
      if (isIOS) {
        openAppInIos.current.click();
      } else if (isAndroid) {
        openApp();
      }
    }
  };

  return (
    <MyWalletContainer>
      <Col md={24} xs={0}>
        <PageHearderResponsive />
      </Col>
      <Col md={0} xs={24}>
        <PageHearderComponent setMenuState={setMenuState} />
      </Col>
      <div className="container">
        <div className="page-main">
          <Image src={Images.MyWalletIcon} alt="" />
          <p className="title">
            Open the app to access the full functionality.
          </p>
          <p className="info">
            With our app, you can view your account balance, track your
            transaction history.
          </p>
          <div className="page-bottom">
            <Button onClick={handleOpenApp}>OPEN NOW</Button>
          </div>
        </div>
      </div>
      <a ref={openAppInIos} href={AppLandingPage} style={{ display: 'none' }} />
      {!menuState && <PageBottomComponent />}
    </MyWalletContainer>
  );
};

export default MyWallet;
