import React, { useRef } from 'react';
import { Modal, Button } from 'antd';
import Image from 'next/image';
import { isDesktop, isIOS, isAndroid } from 'react-device-detect';
import { useRouter } from 'next/router';

import { Images } from '@/theme';
import { RouterKeys } from '@/constants/Keys';
import { openApp } from '@/utils/func';
import { AppLandingPage } from '@/constants/General';

const ShowOpenAppModalComponent = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (status: boolean) => void;
}) => {
  const router = useRouter();
  const openAppInIos = useRef<any>(null);

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
    <Modal
      title=""
      centered
      closable={false}
      footer={null}
      open={open}
      className="eventMarketModal"
      onCancel={() => setOpen(false)}
    >
      <div className="container">
        <div className="market-modal-main">
          <Image src={Images.MyWalletIcon} alt="" />
          <p className="title">
            Open the app to access the full functionality.
          </p>
          <p className="info">
            With our app, you can view your account balance, track your
            transaction history.
          </p>
          <div className="market-modal-bottom">
            <Button onClick={handleOpenApp}>OPEN NOW</Button>
          </div>
        </div>
      </div>
      <div className="close-modal">
        <Image src={Images.CloseIcon} alt="" onClick={() => setOpen(false)} />
      </div>
      <a ref={openAppInIos} href={AppLandingPage} style={{ display: 'none' }} />
    </Modal>
  );
};

export default ShowOpenAppModalComponent;
