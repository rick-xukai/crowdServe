import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { Row, Col, Form, Input, Button, message, Checkbox } from 'antd';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';

import { useCookie } from '../hooks';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { CookieKeys, RouterKeys } from '../constants/Keys';
import {
  loginAction,
  selectError,
  selectLoading,
  selectData,
  reset,
} from '../slice/user.slice';
import { isPassword, base64Decrypt, getErrorMessage } from '../utils/func';
import { TokenExpire, PrivacyPolicyLink, TermsConditionsLink } from '../constants/General';
import { Images, Colors } from '../theme';
import GoogleDocComponent from '../components/googleDocComponent';
import OpenAppComponent from '../components/openAppComponent';

const ActivateAccountContainer = styled.div`
  padding: 20px;
  height: 100%;
  display: flex;
  align-items: center;
  position: relative;
  max-width: 400px;
  margin: auto;
  .skip-login {
    position: absolute;
    color: ${Colors.white};
    top: 20px;
    right: 20px;
    font-weight: 400;
    font-size: 15px;
  }
  .page-main {
    width: 100%;
    position: relative;
    .main-logo {
      .logo {
        display: flex;
        justify-content: center;
        div {
          width: 62px;
          height: 62px;
        }
      }
    }
    .main-title {
      margin-bottom: 38px;
      .title {
        margin-top: 30px;
        font-weight: 700;
        font-size: 28px;
        font-family: 'Oswald';
        color: ${Colors.white};
        text-align: center;
      }
    }
    .ant-input-affix-wrapper {
      width: 100%;
      display: inline-flex;
      border-bottom: 0.7px solid ${Colors.grayScale50};
      border-radius: 0;
      padding: 0;
      .ant-input-suffix {
        display: flex;
        align-items: center;
      }
      &.border-white {
        border-bottom: 0.7px solid ${Colors.white};
        .anticon {
          color: ${Colors.white};
        }
      }
      .ant-input {
        border: none;
        color: ${Colors.white};
        padding-left: 0;
        padding-right: 0;
      }
      .anticon {
        font-size: 18px;
        color: ${Colors.grayScale50};
      }
    }
    input:-internal-autofill-previewed,
    input:-internal-autofill-selected {
      -webkit-text-fill-color: ${Colors.white} !important;
      transition: background-color 5000s ease-in-out 0s !important;
    }
    .ant-input {
      width: 100%;
      height: 50px;
      border: none;
      border-bottom: 0.7px solid ${Colors.grayScale50};
      padding: 4px 4px;
      border-radius: unset;
      background: transparent; 
      color: ${Colors.white};
      &.ant-input-status-success {
        color: ${Colors.white};
      }
      &::placeholder {
        color: ${Colors.grayScale50};
      }
      &.border-white {
        border-bottom: 0.7px solid ${Colors.white};
      }
    }
    .signin-btn {
      margin-top: 45px;
      width: 100%;
      color: ${Colors.grayScale10};
      background: ${Colors.branding};
      border-radius: 2px;
      font-weight: 700;
      font-size: 15px;
      height: 45px;
      border: none;
      &:disabled {
        background: ${Colors.brandingGray};
        color: ${Colors.grayScale30};
      }
    }
    .forgot-password {
      font-weight: 400;
      font-size: 13px;
      color: ${Colors.branding};
      text-align: right;
      margin-top: 12px;
      margin-bottom: 0;
    }
  }
  .agreement-wrapper {
    display: flex;
    .change-text {
      margin-left: 5px;
      .agreement-label {
        font-size: 12px;
      }
    }
    .change-text-checkbox {
      .ant-checkbox-inner {
        width: 15px;
        height: 15px;
      }
    }
    .checkbox-show-error {
      .ant-checkbox-inner {
        border: 1px solid ${Colors.branding};
      }
    }
  }
  .agreement-label {
    font-weight: 400;
    font-size: 13px;
    color: ${Colors.grayScale40};
    .agreement-label-action {
      margin-left: 3px;
      margin-right: 3px;
      color: ${Colors.white};
    }
  }
  .ant-checkbox-wrapper {
    height: 18px;
    .ant-checkbox {
      top: 0.1em;
      width: 18px;
      height: 18px;
    }
    .ant-checkbox-inner {
      background: transparent;
      border-radius: 2px;
      width: 18px;
      height: 18px;
      border: 1px solid ${Colors.grayScale10};
    }
    .ant-checkbox-input {
      display: none;
    }
  }
  .ant-checkbox-checked:after {
    border: 1px solid ${Colors.branding};
  }
  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: ${Colors.branding};
    border-color: ${Colors.branding};
  }
  .ant-checkbox-wrapper:not(.ant-checkbox-wrapper-disabled):hover .ant-checkbox-checked:not(.ant-checkbox-disabled) .ant-checkbox-inner {
    background-color: ${Colors.branding};
  }
  .ant-checkbox-wrapper:not(.ant-checkbox-wrapper-disabled):hover .ant-checkbox-checked:not(.ant-checkbox-disabled):after {
    border-color: ${Colors.branding} !important;
    border-radius: 2px;
  }
  .tips {
    font-weight: 400;
    font-size: 13px;
    color: ${Colors.grayScale50};
    &.signup-email {
      margin-top: 5px;
      font-weight: 400;
      font-size: 17px;
      color: ${Colors.white};
      margin-bottom: 15px;
    }
    &.password {
      margin-bottom: -5px;
    }
  }
`;

const ActivateAccount = ({
  defultEmail,
  activateCode,
  currentTicketId,
}: {
  defultEmail: string;
  activateCode: string;
  currentTicketId: string;
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const cookies = useCookie([CookieKeys.userLoginToken]);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const error = useAppSelector(selectError);
  const loading = useAppSelector(selectLoading);
  const data = useAppSelector(selectData);

  const [checked, setChecked] = useState<boolean>(false);
  const [isFirstRender, setIsFirstRender] = useState<boolean>(true);
  const [isTextShak, setTextShak] = useState<boolean>(false);
  const [checkGoogleDoc, setCheckGoogleDoc] = useState<boolean>(false);
  const [googleDocLink, setGoogleDocLink] = useState<string>('');
  const [activateAccountFormValue, setActivateAccountFormValue] = useState<any>({
    email: defultEmail,
    code: activateCode,
    password: '',
  });

  const onFinish = () => {
    if (checked) {
      dispatch(loginAction(activateAccountFormValue));
    } else {
      setTextShak(true);
    }
  };

  useEffect(() => {
    if (data.token) {
      const currentDate = new Date();
      cookies.setCookie(CookieKeys.userLoginToken, data.token, {
        expires: new Date(currentDate.getTime() + TokenExpire),
        path: '/',
        domain: window.location.hostname,
      });
      cookies.setCookie(CookieKeys.userLoginEmail, activateAccountFormValue.email, {
        expires: new Date(currentDate.getTime() + TokenExpire),
        path: '/',
        domain: window.location.hostname,
      });
      if (currentTicketId) {
        router.push(RouterKeys.ticketDetail.replace(':slug', currentTicketId));
      } else {
        router.push(RouterKeys.ticketsList);
      }
    }
  }, [data]);

  useEffect(() => {
    if (error && !isFirstRender) {
      messageApi.open({
        content: getErrorMessage(error.code),
        className: 'error-message-login',
      });
    }
  }, [error]);

  useEffect(() => {
    setIsFirstRender(false);
    return () => {
      dispatch(reset());
    };
  }, []);

  return (
    <ActivateAccountContainer>
      <div className="skip-login" onClick={() => router.push(RouterKeys.eventList)}>
        <span>Skip</span>
      </div>
      {!checkGoogleDoc && (
        <div className="page-main">
          <Row className="main-logo">
            <Col span={24} className="logo">
              <div><Image src={Images.Logo} alt="" /></div>
            </Col>
          </Row>
          <Row className="main-title">
            <Col span={24} className="title">
              ACTIVATE YOUR ACCOUNT
            </Col>
          </Row>
          <Form onFinish={onFinish}>
            <div className="tips">Signup with</div>
            <div className="tips signup-email">
              {defultEmail}
            </div>
            {activateAccountFormValue.password && (
              <div className="tips password">Set your password (at least 8 characters)</div>
            )}
            <Form.Item name="password" style={{ marginBottom: 0 }}>
              <div>
                <Input.Password
                  className={`${(activateAccountFormValue.password && 'border-white') || ''}`}
                  placeholder="Set your password (at least 8 characters)"
                  bordered={false}
                  maxLength={20}
                  iconRender={(visible) =>
                    (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)
                  }
                  onChange={(e) =>
                    setActivateAccountFormValue({
                      ...activateAccountFormValue,
                      password: e.target.value,
                    })
                  }
                />
              </div>
            </Form.Item>
            <Form.Item>
              <Button
                className="signin-btn"
                disabled={!isPassword(activateAccountFormValue.password) || !activateAccountFormValue.email || loading}
                type="primary"
                htmlType="submit"
                onClick={() => setTextShak(false)}
              >
                ACTIVATE
              </Button>
            </Form.Item>
            <Form.Item style={{ marginBottom: 32 }} className={isTextShak && 'text-shak' || ''}>
              <div className="agreement-wrapper">
                <Checkbox
                  className={`${!checked && 'checkbox-show-error' || ''}`}
                  checked={checked}
                  onChange={(e) => setChecked(e.target.checked)}
                />
                <div style={{ marginLeft: 8 }}>
                  <span className="agreement-label">
                    I agree to CrowdServe <span className="agreement-label-action" onClick={() => { setGoogleDocLink(TermsConditionsLink); setCheckGoogleDoc(true); }}>Terms&Conditions</span>
                    and <span className="agreement-label-action" onClick={() => { setGoogleDocLink(PrivacyPolicyLink); setCheckGoogleDoc(true); }}>Privacy Policy.</span>
                  </span>
                </div>
              </div>
            </Form.Item>
          </Form>
        </div>
      ) || (
        <GoogleDocComponent
          docLink={googleDocLink}
          checkGoogleDoc={setCheckGoogleDoc}
        />
      )}
      <OpenAppComponent setIsOpenAppShow={() => {}} />
      {contextHolder}
    </ActivateAccountContainer>
  );
};

ActivateAccount.getInitialProps = async (ctx: any) => {
  const { query } = ctx;
  let defultEmail = '';
  let activateCode = '';
  let currentTicketId = '';
  try {
    const parameters = base64Decrypt(Object.keys(query)[0]);
    defultEmail = parameters.email;
    activateCode = parameters.code;
    currentTicketId = parameters.ticketId;
  } catch (_) {}
  return { defultEmail, activateCode, currentTicketId };
};

export default ActivateAccount;
