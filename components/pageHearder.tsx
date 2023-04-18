import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Row, Col } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { useAppDispatch } from '../app/hooks';
import { useCookie } from '../hooks';
import {
  resetEventCache,
  setEventDataForSearch,
} from '../slice/eventCache.slice';
import { resetTicketsCache } from '../slice/ticketsCache.slice';
import { resetTicketsListData } from '../slice/tickets.slice';
import { RouterKeys, CookieKeys } from '../constants/Keys';
import { Images, Colors } from '../theme';
import ClientModalComponent from './clientModal';

const PageHearderContainer = styled(Row)`
  position: fixed;
  width: 100%;
  padding-left: 20px;
  padding-right: 20px;
  z-index: 1000;
  background: ${Colors.backgorund};
  top: 0;
  height: 45px;
  align-items: center;
  left: 0;
  right: 0;
  margin: auto;
  max-width: 1240px;
  .left-container,
  .hearder-logo,
  .right-container,
  .hearder-action {
    height: 45px !important;
  }
  &.show-tabs {
    background: ${Colors.black10};
  }
  &.show-menu {
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    height: 100%;
    .menu-container {
      background: unset;
      position: unset;
      padding: 0;
      display: flex;
      align-items: center;
    }
  }
  .hearder-action {
    text-align: right;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .hearder-logo {
    width: 62px;
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  .hearder-back {
    color: ${Colors.white};
    font-size: 22px;
  }
  .user-login {
    padding: 5px 20px;
    background: ${Colors.branding};
    border-radius: 2px;
    font-weight: 700;
    font-size: 13px;
    color: ${Colors.grayScale10};
    margin-right: 20px;
  }
  .close-icon {
    font-size: 24px;
    color: ${Colors.white};
  }
  .menu-container {
    height: calc(100% - 45px);
    width: 100%;
    .menu-item-row {
      user-select: none;
      margin-bottom: 50px;
    }
    .info-name,
    .arrow-right {
      font-weight: 400;
      font-size: 17px;
      color: ${Colors.white};
    }
    .info-name {
      user-select: none;
      text-align: center;
      font-weight: 400;
      font-size: 17px;
      color: ${Colors.white};
      .name {
        user-select: none;
        &.active {
          border-bottom: 2px solid ${Colors.branding};
          padding-bottom: 2px;
        }
      }
      &.logout {
        color: ${Colors.grayScale50};
      }
      &.login {
        .user-login {
          width: 185px;
          margin: auto;
          padding-top: 12px;
          padding-bottom: 12px;
          background: #fc0006;
          font-weight: 700;
          font-size: 15px;
          color: #f8f6f0;
          border-radius: 2px;
        }
      }
    }
    .arrow-right {
      text-align: right;
      color: ${Colors.grayScale50};
    }
    .ant-divider {
      background: ${Colors.grayScale90};
      margin: 15px 0;
    }
    &.google-doc {
      height: 100%;
      background: ${Colors.white};
    }
  }
  .logout-btn {
    position: absolute;
    width: calc(100% - 40px);
    left: 0;
    right: 0;
    margin: auto;
    bottom: 32px;
    .ant-btn {
      height: 45px;
      background: transparent;
      border: 1px solid ${Colors.grayScale10};
      border-radius: 2px;
      width: 100%;
      padding-top: 12px;
      padding-bottom: 12px;
      color: ${Colors.grayScale10};
      font-weight: 700;
      font-size: 15px;
    }
  }
  .menu-container-item {
    width: 100%;
  }
`;

const PageHearderComponent = ({
  showTabs = false,
  setMenuState = () => {},
  setShowTabs = () => {},
}: {
  showTabs?: boolean;
  setMenuState?: (status: boolean) => void;
  setShowTabs?: (status: boolean) => void;
}) => {
  const router = useRouter();
  const cookie = useCookie([
    CookieKeys.userLoginToken,
    CookieKeys.userLoginEmail,
  ]);
  const dispatch = useAppDispatch();

  const [isUserToken, setIsUserToken] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [modalShow, setModalShow] = useState<boolean>(false);

  const userLogout = () => {
    cookie.removeCookie(CookieKeys.userLoginToken, {
      domain: window.location.hostname,
    });
    cookie.removeCookie(CookieKeys.userLoginEmail, {
      domain: window.location.hostname,
    });
    router.push(RouterKeys.login);
  };

  const hanldeMenuClick = (path: string) => {
    if (path === window.location.pathname) {
      setShowMenu(false);
      if (path === RouterKeys.ticketsList) {
        setShowTabs(true);
      }
    } else {
      dispatch(resetEventCache());
      dispatch(setEventDataForSearch([]));
      dispatch(resetTicketsListData());
      dispatch(resetTicketsCache());
      router.push(path);
    }
  };

  useEffect(() => {
    try {
      if (showMenu) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'scroll';
      }
    } catch (_) {}
  }, [showMenu]);

  useEffect(() => {
    const token = cookie.getCookie(CookieKeys.userLoginToken);
    if (token) {
      setIsUserToken(true);
    }
  }, []);

  return (
    <PageHearderContainer
      className={`${(showTabs && !showMenu && 'show-tabs') || ''} ${
        (showMenu && 'show-menu') || ''
      }`}
    >
      <Col span={12} className="left-container">
        <div className="hearder-logo">
          <Image
            src={Images.LogoNameIcon}
            alt=""
            onClick={() => router.push(RouterKeys.eventList)}
          />
        </div>
      </Col>
      <>
        <Col span={12} className="right-container">
          <div className="hearder-action">
            {!isUserToken && !showMenu && (
              <div
                className="user-login"
                onClick={() => router.push(RouterKeys.login)}
              >
                LOG IN
              </div>
            )}
            {(!showMenu && (
              <Image
                src={Images.MenuIcon}
                alt=""
                onClick={() => {
                  setShowMenu(true);
                  setMenuState(true);
                  setShowTabs(false);
                }}
              />
            )) || (
              <div
                className="close-icon"
                onClick={() => {
                  setShowMenu(false);
                  setMenuState(false);
                  setShowTabs(true);
                }}
              >
                <CloseOutlined />
              </div>
            )}
          </div>
        </Col>
        {showMenu && (
          <Col className="menu-container">
            <div className="menu-container-item">
              <Row
                className="menu-item-row"
                onClick={() => hanldeMenuClick(RouterKeys.eventList)}
              >
                <Col span={24} className="info-name">
                  <span
                    className={`name ${
                      (router.pathname === RouterKeys.eventList && 'active') ||
                      ''
                    }`}
                  >
                    EVENTS
                  </span>
                </Col>
              </Row>
              <Row
                className="menu-item-row"
                onClick={() => hanldeMenuClick(RouterKeys.ticketsList)}
              >
                <Col span={24} className="info-name">
                  <span
                    className={`name ${
                      (router.pathname === RouterKeys.ticketsList &&
                        'active') ||
                      ''
                    }`}
                  >
                    MY TICKETS
                  </span>
                </Col>
              </Row>
              <Row
                className="menu-item-row"
                onClick={() => hanldeMenuClick(RouterKeys.myWallet)}
              >
                <Col span={24} className="info-name">
                  <span
                    className={`name ${
                      (router.pathname === RouterKeys.myWallet && 'active') ||
                      ''
                    }`}
                  >
                    MY WALLET
                  </span>
                </Col>
              </Row>
              {(isUserToken && (
                <Row
                  className="menu-item-row"
                  onClick={() => setModalShow(true)}
                >
                  <Col span={24} className="info-name logout">
                    <span className="name">LOG OUT</span>
                  </Col>
                </Row>
              )) || (
                <Row
                  className="menu-item-row"
                  onClick={() => setModalShow(true)}
                >
                  <Col span={24} className="info-name login">
                    <div
                      className="user-login"
                      onClick={() => router.push(RouterKeys.login)}
                    >
                      LOG IN
                    </div>
                  </Col>
                </Row>
              )}
              {modalShow && (
                <ClientModalComponent
                  title="Log out"
                  modalShow={modalShow}
                  closable={false}
                  handleOk={userLogout}
                  handleCancel={() => setModalShow(false)}
                >
                  <p>Are you sure you want to log out?</p>
                </ClientModalComponent>
              )}
            </div>
          </Col>
        )}
      </>
    </PageHearderContainer>
  );
};

export default PageHearderComponent;
