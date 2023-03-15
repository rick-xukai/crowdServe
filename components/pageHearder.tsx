import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Row, Col, Divider } from 'antd';
import { CloseOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import Image from 'next/image';
import Router from 'next/router';

import { useAppDispatch } from '../app/hooks';
import { useCookie } from '../hooks';
import { resetEventCache, setEventDataForSearch } from '../slice/eventCache.slice';
import { resetTicketsCache } from '../slice/ticketsCache.slice';
import { resetTicketsListData } from '../slice/tickets.slice';
import { PrivacyPolicyLink, TermsConditionsLink } from '../constants/General';
import { RouterKeys, CookieKeys } from '../constants/Keys';
import { Images, Colors } from '../theme';
import ClientModalComponent from './clientModal';
import GoogleDocComponent from './googleDocComponent';

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
  max-width: 1240px;
  @media (min-width: 1280px) {
    padding: 0;
    height: 60px;
  }
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
    cursor: pointer;
    @media (min-width: 1280px) {
      width: 100px;
      height: 40px;
    }
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
  .menu-container {
    position: fixed;
    height: calc(100% - 45px);
    width: 100%;
    background: ${Colors.backgorund};
    left: 0;
    bottom: 0;
    right: 0px;
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 40px;
    margin: auto;
    max-width: 1240px;
    @media (min-width: 1280px) {
      padding-left: 0;
      padding-right: 0;
    }
    .menu-item-row {
      user-select: none;
      margin-bottom: 20px;
    }
    .info-name,
    .arrow-right {
      font-weight: 400;
      font-size: 17px;
      color: ${Colors.white};
    }
    .info-name {
      user-select: none;
      display: flex;
      align-items: center;
      .name {
        user-select: none;
        margin-left: 10px;
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
`;

const PageHearderComponent = ({
  setMenuState = () => {}
}: {
  setMenuState?: (status: boolean) => void
}) => {
  const cookie = useCookie([CookieKeys.userLoginToken, CookieKeys.userLoginEmail]);
  const dispatch = useAppDispatch();

  const [isUserToken, setIsUserToken] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [checkGoogleDoc, setCheckGoogleDoc] = useState<boolean>(false);
  const [iframeLink, setIframeLink] = useState<string>('');
  const [modalShow, setModalShow] = useState<boolean>(false);

  const userLogout = () => {
    cookie.removeCookie(CookieKeys.userLoginToken);
    cookie.removeCookie(CookieKeys.userLoginEmail);
    Router.push(RouterKeys.login);
  };

  const hanldeMenuClick = (path: string) => {
    if (path === window.location.pathname) {
      setShowMenu(false);
    } else {
      dispatch(resetEventCache());
      dispatch(setEventDataForSearch([]));
      dispatch(resetTicketsListData());
      dispatch(resetTicketsCache());
      Router.push(path);
    }
  };

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
          {checkGoogleDoc && (
            <ArrowLeftOutlined onClick={() => setCheckGoogleDoc(false)} />
          ) || (
            <Image src={Images.LogoNameIcon} alt="" onClick={() => Router.push(RouterKeys.eventList)} />
          )}
        </div>
      </Col>
      {!checkGoogleDoc && (
        <>
          <Col span={12} className="right-container">
            <div
              className="hearder-action"
            >
              {!isUserToken && (
                <div className="user-login" onClick={() => Router.push(RouterKeys.login)}>
                  LOG IN
                </div>
              )}
              {!showMenu && (
                <Image
                  src={Images.MenuIcon}
                  alt=""
                  onClick={() => { setShowMenu(true); setMenuState(true); }}
                />
              ) || (
                <div className="close-icon" onClick={() => { setShowMenu(false); setMenuState(false); }}>
                  <CloseOutlined />
                </div>
              )}
            </div>
          </Col>
          {showMenu && (
            <Col className="menu-container">
              <Row
                className="menu-item-row"
                onClick={() => hanldeMenuClick(RouterKeys.eventList)}
              >
                <Col span={24} className="info-name">
                  <Image src={Images.MenuHomeIcon} alt="" />
                  <span className="name">
                    Home
                  </span>
                </Col>
              </Row>
              <Row
                className="menu-item-row"
                onClick={() => hanldeMenuClick(RouterKeys.ticketsList)}
              >
                <Col span={24} className="info-name">
                  <Image src={Images.MenuTicketIcon} alt="" />
                  <span className="name">
                    My Tickets
                  </span>
                </Col>
              </Row>
              <Row
                className="menu-item-row"
                onClick={() => hanldeMenuClick(RouterKeys.myWallet)}
              >
                <Col span={24} className="info-name">
                  <Image src={Images.MenuWalletIcon} alt="" />
                  <span className="name">
                    My Wallet
                  </span>
                </Col>
              </Row>
              <Row
                className="menu-item-row"
                onClick={() => {
                  setIframeLink(PrivacyPolicyLink);
                  setCheckGoogleDoc(true);
                }}
              >
                <Col span={24} className="info-name">
                  <Image src={Images.MenuPrivacyIcon} alt="" />
                  <span className="name">
                    Privacy Policy
                  </span>
                </Col>
              </Row>
              <Row
                className="menu-item-row"
                onClick={() => {
                  setIframeLink(TermsConditionsLink);
                  setCheckGoogleDoc(true);
                }}
              >
                <Col span={24} className="info-name">
                  <Image src={Images.MenuTemsIcon} alt="" />
                  <span className="name">
                    Tems & Conditions
                  </span>
                </Col>
              </Row>
              {isUserToken && (
                <>
                  <Divider />
                  <Row
                    className="menu-item-row"
                    onClick={() => setModalShow(true)}
                  >
                    <Col span={24} className="info-name">
                      <Image src={Images.MenuLogoutIcon} alt="" />
                      <span className="name">
                        Log Out
                      </span>
                    </Col>
                  </Row>
                </>
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
            </Col>
          )}
        </>
      ) || (
        <Col className="menu-container google-doc">
          <GoogleDocComponent
            docLink={iframeLink}
            checkGoogleDoc={setCheckGoogleDoc}
          />
        </Col>
      )}
    </PageHearderContainer>
  );
};

export default PageHearderComponent;
