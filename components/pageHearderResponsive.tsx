import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Row, Col, Button, Avatar, Popover } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { Images, Colors } from '../theme';
import { useCookie } from '../hooks';
import { RouterKeys, CookieKeys } from '../constants/Keys';

const PageHearderResponsiveContainer = styled.div`
  max-width: 1008px;
  margin: auto;
  padding-top: 18px;
  padding-bottom: 18px;
  position: fixed;
  width: 100%;
  background: rgba(39, 39, 42, 0.96);
  z-index: 1000;
  user-select: none;
  .header-logo {
    width: 102px;
    height: 40px;
    cursor: pointer;
  }
  .header-main {
    height: 45px;
  }
  .header-menu {
    margin-left: 50px;
    font-weight: 400;
    font-size: 15px;
    color: ${Colors.white};
    display: flex;
    .menu-item {
      margin-right: 35px;
      font-weight: 400;
      font-size: 15px;
      user-select: none;
      cursor: pointer;
      span {
        line-height: 45px;
        &.active {
          padding-bottom: 1px;
          border-bottom: solid 2px ${Colors.branding};
        }
      }
    }
  }
  .right-button {
    text-align: right;
    position: relative;
    .ant-btn {
      border: none;
      background: ${Colors.branding};
      padding: 12px 32px;
      height: 45px;
      font-weight: 700;
      border-radius: 2px;
      font-size: 15px;
      color: ${Colors.grayScale10};
      :hover {
        background: ${Colors.branding10};
      }
    }
    @media (min-width: 768px) and (max-width: 1200px) {
      .ant-btn {
        height: 35px;
        padding: 7px 22px;
        font-weight: 700;
        font-size: 13px;
        margin-top: 4px;
        span {
          margin-top: 1px;
        }
      }
    }
  }
  .ant-avatar {
    width: 40px;
    height: 40px;
    background: ${Colors.grayScale10};
    line-height: 38px;
    cursor: pointer;
    .ant-avatar-string {
      font-weight: 700;
      font-size: 20px;
      color: ${Colors.backgorund};
      font-family: 'Oswald';
    }
  }
  .log-out {
    cursor: pointer;
    width: 164px;
    height: 47px;
    background: ${Colors.grayScale10};
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    font-weight: 400;
    font-size: 13px;
    text-align: left;
    padding: 14px 12px;
    color: ${Colors.grayScale90};
    position: absolute;
    right: 0;
    top: 50px;
  }
  @media (min-width: 768px) and (max-width: 1200px) {
    max-width: 688px;
    left: 0;
    right: 0;
    padding-top: 0;
    padding-bottom: 0;
    height: 60px;
    display: flex;
    align-items: center;
    .header-main {
      height: 40px;
      width: 100%;
    }
  }
`;

const PageHearderResponsive = () => {
  const router = useRouter();
  const cookie = useCookie([
    CookieKeys.userLoginToken,
    CookieKeys.userLoginEmail,
  ]);

  const [isUserToken, setIsUserToken] = useState<boolean | null>(null);
  const [userLoginInitials, setUserLoginInitials] = useState<string>('');
  const [showLogout, setShowLogout] = useState<boolean>(false);

  const userLogout = () => {
    setShowLogout(false);
    cookie.removeCookie(CookieKeys.userLoginToken, {
      domain: window.location.hostname,
    });
    cookie.removeCookie(CookieKeys.userLoginEmail, {
      domain: window.location.hostname,
    });
    router.push(RouterKeys.login);
  };

  useEffect(() => {
    const token = cookie.getCookie(CookieKeys.userLoginToken);
    const email = cookie.getCookie(CookieKeys.userLoginEmail);
    if (token) {
      setIsUserToken(true);
    } else {
      setIsUserToken(false);
    }
    if (email) {
      setUserLoginInitials(email.slice(0, 1).toUpperCase());
    }
  }, []);

  return (
    <PageHearderResponsiveContainer>
      <div className="header-main">
        <Row>
          <Col span={18}>
            <Row>
              <Col className="header-logo">
                <Image
                  src={Images.LogoNameDesktopIcon}
                  alt=""
                  onClick={() => router.push(RouterKeys.eventList)}
                />
              </Col>
              <Col className="header-menu">
                <div
                  className="menu-item"
                  onClick={() => router.push(RouterKeys.eventList)}
                >
                  <span
                    className={
                      (router.pathname === RouterKeys.eventList && 'active') ||
                      ''
                    }
                  >
                    EVENTS
                  </span>
                </div>
                <div
                  className="menu-item"
                  onClick={() => router.push(RouterKeys.ticketsList)}
                >
                  <span
                    className={
                      (router.pathname === RouterKeys.ticketsList &&
                        'active') ||
                      ''
                    }
                  >
                    MY TICKETS
                  </span>
                </div>
                <div
                  className="menu-item"
                  onClick={() => router.push(RouterKeys.myWallet)}
                >
                  <span
                    className={
                      (router.pathname === RouterKeys.myWallet && 'active') ||
                      ''
                    }
                  >
                    MY WALLET
                  </span>
                </div>
              </Col>
            </Row>
          </Col>
          <Col span={6} className="right-button">
            {isUserToken !== null && (
              <>
                {(!isUserToken && (
                  <Button onClick={() => router.push(RouterKeys.login)}>
                    LOG IN
                  </Button>
                )) || (
                  <div>
                    <Popover
                      title={
                        <span
                          className="logout-popover-title"
                          onClick={userLogout}
                        >
                          LOG OUT
                        </span>
                      }
                      trigger="hover"
                      open={showLogout}
                      onOpenChange={(status) => setShowLogout(status)}
                    >
                      <Avatar>{userLoginInitials}</Avatar>
                    </Popover>
                  </div>
                )}
              </>
            )}
          </Col>
        </Row>
      </div>
    </PageHearderResponsiveContainer>
  );
};

export default PageHearderResponsive;
