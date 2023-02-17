import React, { useState } from 'react';
import { Row, Col, Divider, Button } from 'antd';
import { ArrowLeftOutlined, RightOutlined } from '@ant-design/icons';
import Router from 'next/router';

import AuthHoc from '../components/hoc/AuthHoc';
import { useCookie } from '../hooks';
import { useAppDispatch } from '../app/hooks';
import ClientModalComponent from '../components/clientModal';
import { PrivacyPolicyLink, TermsConditionsLink } from '../constants/General';
import { RouterKeys, CookieKeys } from '../constants/Keys';
import { SettingsContainer } from '../styles/settings-style';
import { logoutAction } from '../slice/login.slice';
import GoogleDocComponent from '../components/googleDocComponent';

const Settings = () => {
  const dispatch = useAppDispatch();
  const cookies = useCookie([CookieKeys.userLoginToken]);

  const [modalShow, setModalShow] = useState<boolean>(false);
  const [checkGoogleDoc, setCheckGoogleDoc] = useState<boolean>(false);
  const [iframeLink, setIframeLink] = useState<string>('');

  const userLogout = () => {
    dispatch(logoutAction());
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

  return (
    <SettingsContainer>
      <Row className={`${checkGoogleDoc && 'iframe-back' || ''}`}>
        <Col
          span={24}
          className="goback-icon"
          onClick={backIconAction}
        >
          <ArrowLeftOutlined />
        </Col>
      </Row>
      {!checkGoogleDoc && (
        <>
          <Row>
            <Col span={24} className="page-title">
              SETTINGS
            </Col>
          </Row>
          <div className="page-main">
            <Row
              onClick={() => {
                setIframeLink(PrivacyPolicyLink);
                setCheckGoogleDoc(true);
              }}
            >
              <Col span={20} className="info-name">Privacy Policy</Col>
              <Col span={4} className="arrow-right">
                <RightOutlined />
              </Col>
            </Row>
            <Divider />
            <Row
              onClick={() => {
                setIframeLink(TermsConditionsLink);
                setCheckGoogleDoc(true);
              }}
            >
              <Col span={20} className="info-name">Terms & Conditions</Col>
              <Col span={4} className="arrow-right">
              <RightOutlined />
              </Col>
            </Row>
          </div>
          <div className="logout-btn">
            <Button onClick={() => setModalShow(true)}>
              LOG OUT
            </Button>
          </div>
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
        </>
      ) || (
        <GoogleDocComponent
          docLink={iframeLink}
          checkGoogleDoc={setCheckGoogleDoc}
        />
      )}
    </SettingsContainer>
  );
};

export default AuthHoc(Settings);
