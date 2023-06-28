import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Row, Col } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { isAndroid, isIOS } from 'react-device-detect';
import Image from 'next/image';

import { openApp } from '../utils/func';
import { LocalStorageKeys } from '../constants/Keys';
import { AppLandingPage } from '../constants/General';
import { Colors, Images } from '../theme';

const OpenAppContainer = styled.div`
  position: fixed;
  bottom: 20px;
  height: 62px;
  width: calc(100% - 40px);
  background: ${Colors.grayScale10};
  box-shadow: 0px 4px 10px rgb(0 0 0 / 10%);
  border-radius: 6px;
  padding: 10px;
  z-index: 99;
  max-width: 1240px;
  left: 0;
  right: 0;
  margin: auto;
  .main-row {
    height: 100%;
  }
  .app-logo {
    margin-right: 12px;
    img {
      width: 42px !important;
      height: 42px !important;
    }
  }
  p {
    margin: 0;
    color: ${Colors.grayScale70};
  }
  .title {
    font-weight: 700;
    font-size: 16px;
  }
  .description {
    font-weight: 400;
    font-size: 13px;
  }
  .close-btn {
    text-align: right;
    .anticon {
      color: ${Colors.grayScale40};
      font-size: 16px;
    }
  }
`;

const OpenAppComponent = ({
  setIsOpenAppShow
}: {
  setIsOpenAppShow: (status: boolean) => void
}) => {
  const openAppInIos = useRef<any>(null);

  const [showContainer, setShowContainer] = useState<boolean>(false);

  const handleOpenApp = () => {
    if (isIOS) {
      openAppInIos.current.click();
    } else if (isAndroid) {
      openApp();
    }
  };

  const closeInstallAppButton = () => {
    localStorage.setItem(
      LocalStorageKeys.closeInstallAppTime,
      new Date().getTime().toString(),
    );
    setIsOpenAppShow(false);
    setShowContainer(false);
  };

  useEffect(() => {
    const currentTime = new Date().getTime();
    const lastCloseInstallAppTime = Number(
      localStorage.getItem(LocalStorageKeys.closeInstallAppTime)
    );
    if (lastCloseInstallAppTime === 0) {
      setShowContainer(true);
      setIsOpenAppShow(true);
      return;
    }
    if (Math.abs(currentTime - lastCloseInstallAppTime) >= (2 * 60 * 60 * 1000)) {
      setShowContainer(true);
      setIsOpenAppShow(true);
    }
  }, []);

  return (
    <>
      {showContainer && (
        <OpenAppContainer>
          <Row>
            <Col span={20} onClick={handleOpenApp}>
              <Row>
                <Col className="app-logo">
                  <Image src={Images.AppLogo} alt="" />
                </Col>
                <Col>
                  <p className="title">
                    Join the crowd
                  </p>
                  <p className="description">
                    Explore more fun with our app.
                  </p>
                </Col>
              </Row>
            </Col>
            <Col span={4} className="close-btn">
              <CloseOutlined onClick={closeInstallAppButton} />
            </Col>
          </Row>
          <a ref={openAppInIos} href={AppLandingPage} style={{ display: 'none' }} />
        </OpenAppContainer>
      ) || null}
    </>
  );
};

export default OpenAppComponent;
