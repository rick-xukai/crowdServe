import React, { useState, useEffect } from 'react';
import { Row, Col, Divider } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Image from 'next/image';
import Router from 'next/router';

import { Images } from '../theme';
import { useCookie } from '../hooks';
import ClientModalComponent from '../components/clientModal';
import { PrivacyPolicyLink, TermsConditionsLink } from '../constants/General';
import { RouterKeys, CookieKeys, LocalStorageKeys } from '../constants/Keys';
import { SettingsContainer } from '../styles/settings-style';
import GoogleDocComponent from '../components/googleDocComponent';
import PageHearderComponent from '../components/pageHearder';

const Settings = () => {
  const cookies = useCookie([CookieKeys.userLoginToken]);

  const [modalShow, setModalShow] = useState<boolean>(false);
  const [userToken, setUserToken] = useState<boolean>(false);
  const [checkGoogleDoc, setCheckGoogleDoc] = useState<boolean>(false);
  const [iframeLink, setIframeLink] = useState<string>('');
  const [currentPageToSetting, setCurrentPageToSetting] = useState<string>(RouterKeys.eventList);

  const userLogout = () => {
    cookies.removeCookie(CookieKeys.userLoginToken);
    Router.push(RouterKeys.login);
  };

  const backIconAction = () => {
    if (checkGoogleDoc) {
      setCheckGoogleDoc(false);
    } else {
      Router.push(RouterKeys.ticketsList);
    }
  };

  useEffect(() => {
    if (localStorage) {
      setCurrentPageToSetting(
        localStorage.getItem(LocalStorageKeys.currentPageToSetting) || RouterKeys.eventList
      );
    }
    const token = cookies.getCookie(CookieKeys.userLoginToken);
    if (token) {
      setUserToken(true);
    }
  }, []);

  return (
    <SettingsContainer>
      {checkGoogleDoc && (
        <Row className={`${checkGoogleDoc && 'iframe-back' || ''}`}>
          <Col
            span={24}
            className="goback-icon"
            onClick={backIconAction}
          >
            <ArrowLeftOutlined />
          </Col>
        </Row>
      ) || (
        <PageHearderComponent
          showMenuBtn={false}
          routerPath={currentPageToSetting}
        />
      )}
      {!checkGoogleDoc && (
        <div className="page-main">
          <Row
            className="menu-item-row"
            onClick={() => Router.push(RouterKeys.eventList)}
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
            onClick={() => Router.push(RouterKeys.ticketsList)}
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
            onClick={() => Router.push(RouterKeys.myWallet)}
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
          {userToken && (
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
        </div>
      ) || (
        <GoogleDocComponent
          docLink={iframeLink}
          checkGoogleDoc={setCheckGoogleDoc}
        />
      )}
    </SettingsContainer>
  );
};

export default Settings;
