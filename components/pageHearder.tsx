import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Row, Col } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import Image from 'next/image';
import Router from 'next/router';

import { useCookie } from '../hooks';
import { RouterKeys, LocalStorageKeys, CookieKeys } from '../constants/Keys';
import { Images, Colors } from '../theme';

const PageHearderContainer = styled(Row)`
  position: fixed;
  width: 100%;
  padding-left: 20px;
  padding-right: 20px;
  z-index: 2;
  background: ${Colors.backgorund};
  top: 0;
  height: 45px;
  align-items: center;
  left: 0;
  right: 0;
  margin: auto;
  .hearder-action {
    text-align: right;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .hearder-logo {
    width: 62px;
    height: 30px;
    display: flex;
    align-items: center;
  }
  .hearder-back {
    color: ${Colors.white};
    font-size: 22px;
  }
  .user-login {
    margin-right: 20px;
    font-weight: 400;
    font-size: 15px;
    color: ${Colors.branding};
  }
  .close-icon {
    font-size: 24px;
    color: ${Colors.white};
  }
`;

const PageHearderComponent = ({
  showMenuBtn = true,
  routerPath = RouterKeys.eventList,
}: {
  routerPath?: string;
  showMenuBtn?: boolean;
}) => {
  const cookie = useCookie([CookieKeys.userLoginToken]);

  const [isUserToken, setIsUserToken] = useState<boolean>(false);

  useEffect(() => {
    const token = cookie.getCookie(CookieKeys.userLoginToken);
    if (token) {
      setIsUserToken(true);
    }
  }, []);

  return (
    <PageHearderContainer>
      <Col span={12} className="left-container">
        <div className="hearder-logo">
          <Image src={Images.LogoNameIcon} alt="" />
        </div>
      </Col>
      <Col span={12} className="right-container">
        <div
          className="hearder-action"
        >
          {!isUserToken && (
            <div className="user-login" onClick={() => Router.push(RouterKeys.login)}>
              LOG IN
            </div>
          )}
          {showMenuBtn && (
            <Image
              src={Images.MenuIcon}
              alt=""
              onClick={() => {
                Router.push(RouterKeys.settings);
                localStorage.setItem(LocalStorageKeys.currentPageToSetting, window.location.pathname);
              }}
            />
          ) || (
            <div className="close-icon" onClick={() => Router.push(routerPath)}>
              <CloseOutlined />
            </div>
          )}
        </div>
      </Col>
    </PageHearderContainer>
  );
};

export default PageHearderComponent;
