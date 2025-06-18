import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Row, Col, Button, Avatar, Popover } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { Images, Colors } from '../theme';
import { useCookie } from '../hooks';
import { RouterKeys, CookieKeys, LocalStorageKeys } from '../constants/Keys';
import { generateRandomString } from '@/utils/func';

const PageHearderResponsiveContainer = styled.div`
  padding-top: 18px;
  padding-bottom: 18px;
  position: fixed;
  width: 100%;
  background: rgba(39, 39, 42, 0.96);
  z-index: 1000;
  user-select: none;
  left: 0;
  right: 0;
  &.backgroundTransparent {
    background: rgba(39, 39, 42, 0.3);
  }
  .header-logo {
    width: 102px;
    height: 40px;
    cursor: pointer;
  }
  .header-main {
    height: 45px;
    max-width: 1008px;
    margin: auto;
  }
  .header-menu {
    margin-left: 50px;
    font-weight: 400;
    font-size: 15px;
    color: ${Colors.white};
    display: flex;
    > :last-child {
      margin-right: 0 !important;
    }
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
  .show-img-avatar {
    display: flex;
    justify-content: right;
    align-items: center;
    .img-avatar {
      width: 40px;
      height: 40px;
      cursor: pointer;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
      }
    }
  }
  @media (max-width: 1200px) {
    .header-menu {
      margin-left: 25px !important;
      .menu-item {
        font-size: 14px;
        margin-right: 15px;
      }
    }
  }
  @media (min-width: 768px) and (max-width: 1200px) {
    left: 0;
    right: 0;
    padding-top: 10px;
    padding-bottom: 0;
    min-height: 60px;
    display: flex;
    align-items: center;
    .header-menu {
      margin-left: 35px;
    }
    .header-main {
      height: 100%;
      width: 100%;
      max-width: 688px;
    }
  }
`;

const PageHearderResponsive = ({
  profileAvatar,
  backgroundTransparent = false,
  showBackgroundColor = true,
  saveScrollValue = () => {},
}: {
  profileAvatar?: string;
  backgroundTransparent?: boolean;
  showBackgroundColor?: boolean;
  saveScrollValue?: () => void;
}) => {
  const router = useRouter();
  const cookie = useCookie([
    CookieKeys.userLoginToken,
    CookieKeys.userLoginEmail,
    CookieKeys.userProfileInfo,
  ]);

  const [isUserToken, setIsUserToken] = useState<boolean | null>(null);
  const [userLoginInitials, setUserLoginInitials] = useState<string>('');
  const [showLogout, setShowLogout] = useState<boolean>(false);
  const [userAvatar, setUserAvatar] = useState<string>('');

  const userLogout = () => {
    setShowLogout(false);
    cookie.removeCookie(CookieKeys.userLoginToken, {
      path: '/',
      domain: window.location.hostname,
    });
    cookie.removeCookie(CookieKeys.userLoginEmail, {
      path: '/',
      domain: window.location.hostname,
    });
    cookie.removeCookie(CookieKeys.userLoginId, {
      path: '/',
      domain: window.location.hostname,
    });
    cookie.removeCookie(CookieKeys.userProfileInfo, {
      path: '/',
      domain: window.location.hostname,
    });
    localStorage.setItem(
      LocalStorageKeys.pageViewTrackKeys,
      generateRandomString()
    );
    router.push(RouterKeys.login);
  };

  const hanldeMenuClick = (path: string) => {
    if (path !== router.pathname) {
      saveScrollValue();
      router.push(path);
    }
  };

  useEffect(() => {
    const token = cookie.getCookie(CookieKeys.userLoginToken);
    const email = cookie.getCookie(CookieKeys.userLoginEmail);
    const userProfileInfo = cookie.getCookie(CookieKeys.userProfileInfo);
    if (userProfileInfo) {
      const { profileImage } = userProfileInfo;
      setUserAvatar(profileImage);
    }
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
    <PageHearderResponsiveContainer
      className={(backgroundTransparent && 'backgroundTransparent') || ''}
      style={{
        background:
          (!showBackgroundColor && 'none') || 'rgba(39, 39, 42, 0.96)',
      }}
    >
      <div className="header-main">
        <Row>
          <Col md={22} xl={21}>
            <Row>
              <Col className="header-logo">
                <Image
                  src={Images.LogoNameDesktopIcon}
                  alt=""
                  onClick={() => hanldeMenuClick(RouterKeys.eventList)}
                />
              </Col>
              <Col className="header-menu">
                <div
                  className="menu-item"
                  onClick={() => hanldeMenuClick(RouterKeys.eventList)}
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
                  onClick={() => hanldeMenuClick(RouterKeys.crowdFundList)}
                >
                  <span
                    className={
                      (router.pathname === RouterKeys.crowdFundList &&
                        'active') ||
                      ''
                    }
                  >
                    CROWDFUND
                  </span>
                </div>
                <div
                  className="menu-item"
                  onClick={() => hanldeMenuClick(RouterKeys.myTickets)}
                >
                  <span
                    className={
                      (router.pathname === RouterKeys.myTickets && 'active') ||
                      ''
                    }
                  >
                    UPCOMING EVENTS
                  </span>
                </div>
                <div
                  className="menu-item"
                  onClick={() => hanldeMenuClick(RouterKeys.myCollectibles)}
                >
                  <span
                    className={
                      (router.pathname === RouterKeys.myCollectibles &&
                        'active') ||
                      ''
                    }
                  >
                    ALL TICKETS
                  </span>
                </div>
                <div
                  className="menu-item"
                  onClick={() => hanldeMenuClick(RouterKeys.myRaves)}
                >
                  <span
                    className={
                      (router.pathname === RouterKeys.myRaves && 'active') || ''
                    }
                  >
                    MY RAVES
                  </span>
                </div>
                {/* <div
                  className="menu-item"
                  onClick={() => hanldeMenuClick(RouterKeys.ticketsList)}
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
                </div> */}
                <div
                  className="menu-item"
                  onClick={() => hanldeMenuClick(RouterKeys.myWallet)}
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
          <Col md={2} xl={3} className="right-button">
            {isUserToken !== null && (
              <>
                {(!isUserToken && (
                  <Button onClick={() => hanldeMenuClick(RouterKeys.login)}>
                    LOG IN
                  </Button>
                )) || (
                  <div
                    className={
                      ((userAvatar || profileAvatar) && 'show-img-avatar') || ''
                    }
                  >
                    <Popover
                      title={
                        <div>
                          <div
                            className="logout-popover-title"
                            onClick={() => hanldeMenuClick(RouterKeys.profile)}
                          >
                            PROFILE
                          </div>
                          <div
                            className="logout-popover-title"
                            onClick={userLogout}
                          >
                            LOG OUT
                          </div>
                        </div>
                      }
                      trigger="hover"
                      open={showLogout}
                      onOpenChange={(status) => setShowLogout(status)}
                    >
                      {(profileAvatar && (
                        <div className="img-avatar">
                          <img
                            src={profileAvatar}
                            alt=""
                            onError={(e: any) => {
                              e.target.onerror = null;
                              e.target.src = Images.BackgroundLogo.src;
                            }}
                          />
                        </div>
                      )) || (
                        <>
                          {(userAvatar && (
                            <div className="img-avatar">
                              <img
                                src={userAvatar}
                                alt=""
                                onError={(e: any) => {
                                  e.target.onerror = null;
                                  e.target.src = Images.BackgroundLogo.src;
                                }}
                              />
                            </div>
                          )) || <Avatar>{userLoginInitials}</Avatar>}
                        </>
                      )}
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
