import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { isEmpty } from 'lodash';
import { isMobile } from 'react-device-detect';
import { Row, Col, Form, Input, Button, message, Checkbox } from 'antd';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';

import { useCookie } from '../hooks';
import Messages from '../constants/Messages';
import { CookieKeys, RouterKeys } from '../constants/Keys';
import {
  TokenExpire,
  PrivacyPolicyLink,
  TermsConditionsLink,
} from '../constants/General';
import {
  isEmail,
  getErrorMessage,
  isPassword,
  base64Decrypt,
  base64Encrypt,
} from '../utils/func';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  loginAction,
  LoginPayloadType,
  verifyUserAction,
  verificationCodeAction,
  selectError,
  selectLoading,
  selectData,
  reset,
} from '../slice/user.slice';
import { Images } from '../theme';
import GoogleDocComponent from '../components/googleDocComponent';
import OpenAppComponent from '../components/openAppComponent';
import { LoginContainer } from '../styles/login-style';
import { resetTicketsCache } from '../slice/ticketsCache.slice';
import { resetTicketsListData } from '../slice/tickets.slice';
import { resetCrowdFundCache } from '../slice/crowdFundCache.slice';
import {
  resetEventCache,
  setEventDataForSearch,
} from '../slice/eventCache.slice';
// import GoogleLoginComponent from '../components/googleLoginComponent';

const ActivateAccountComponent = ({
  checkGoogleDoc,
  googleDocLink,
}: {
  checkGoogleDoc: (status: boolean) => void;
  googleDocLink: (link: string) => void;
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectLoading);

  const [checked, setChecked] = useState<boolean>(false);
  const [isTextShak, setTextShak] = useState<boolean>(false);
  const [verifyUserSuccess, setVerifyUserSuccess] = useState<boolean>(false);
  const [verificationCodeSuccess, setVerificationCodeSuccess] =
    useState<boolean>(false);
  const [activateAccountValue, setActivateAccountValue] = useState({
    email: '',
    code: '',
    password: '',
  });

  const onFinish = async (values: any) => {
    if (!verifyUserSuccess) {
      if (checked) {
        const result = await dispatch(verifyUserAction(values));
        if (result.type === verifyUserAction.fulfilled.toString()) {
          setVerifyUserSuccess(true);
        }
      } else {
        setTextShak(true);
      }
      return;
    }
    if (!verificationCodeSuccess) {
      const result = await dispatch(
        verificationCodeAction({
          ...values,
          email: activateAccountValue.email,
          type: 1,
        })
      );
      if (result.type === verificationCodeAction.fulfilled.toString()) {
        setVerificationCodeSuccess(true);
      }
      return;
    }
    if (verificationCodeSuccess && verifyUserSuccess) {
      const result = await dispatch(
        loginAction({
          ...activateAccountValue,
          password: activateAccountValue.password,
        })
      );
      if (result.type === loginAction.fulfilled.toString()) {
        router.push(RouterKeys.eventList);
      }
    }
  };

  const checkGoogleDocAction = (link: string) => {
    checkGoogleDoc(true);
    googleDocLink(link);
  };

  // eslint-disable-next-line
  useEffect(() => {
    return () => {
      dispatch(reset());
    };
  }, []);

  return (
    <div>
      <Row className="main-title">
        <Col span={24} className="title">
          ACTIVATE YOUR ACCOUNT
        </Col>
      </Row>
      {!verifyUserSuccess && (
        <Form onFinish={onFinish}>
          <Form.Item name="email" style={{ marginBottom: 0 }}>
            <Input
              className={`${
                (activateAccountValue.email && 'border-white') || ''
              }`}
              placeholder="Email for ticket booking"
              bordered={false}
              onChange={(e) =>
                setActivateAccountValue({
                  ...activateAccountValue,
                  email: (isEmail(e.target.value) && e.target.value) || '',
                })
              }
            />
          </Form.Item>
          <Form.Item>
            <Button
              className="signin-btn"
              disabled={!activateAccountValue.email || loading}
              type="primary"
              htmlType="submit"
              onClick={() => setTextShak(false)}
            >
              ACTIVATE
            </Button>
          </Form.Item>
          <Form.Item
            style={{ marginBottom: 32 }}
            className={(isTextShak && 'text-shak') || ''}
          >
            <div className="agreement-wrapper">
              <Checkbox
                className={`${(!checked && 'checkbox-show-error') || ''}`}
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
              />
              <div style={{ marginLeft: 8 }}>
                <span className="agreement-label">
                  I agree to CrowdServe{' '}
                  <span
                    className="agreement-label-action"
                    onClick={() => checkGoogleDocAction(TermsConditionsLink)}
                  >
                    Terms&Conditions
                  </span>
                  and{' '}
                  <span
                    className="agreement-label-action"
                    onClick={() => checkGoogleDocAction(PrivacyPolicyLink)}
                  >
                    Privacy Policy.
                  </span>
                </span>
              </div>
            </div>
          </Form.Item>
        </Form>
      )}
      {!verificationCodeSuccess && verifyUserSuccess && (
        <>
          <Row className="code-sent">
            <Col span={24} className="title">
              Verification code has been sent to
            </Col>
            <Col span={24} className="value">
              {activateAccountValue.email}
            </Col>
          </Row>
          <Form onFinish={onFinish}>
            <Form.Item name="code" style={{ marginBottom: 0 }}>
              <Input
                className={`${
                  (activateAccountValue.code && 'border-white') || ''
                }`}
                placeholder="Enter verification code"
                bordered={false}
                onChange={(e) =>
                  setActivateAccountValue({
                    ...activateAccountValue,
                    code: e.target.value,
                  })
                }
              />
            </Form.Item>
            <Form.Item style={{ marginBottom: 25 }}>
              <Button
                className="signin-btn"
                disabled={!activateAccountValue.code || loading}
                type="primary"
                htmlType="submit"
              >
                NEXT
              </Button>
            </Form.Item>
          </Form>
        </>
      )}
      {verificationCodeSuccess && verifyUserSuccess && (
        <Form onFinish={onFinish}>
          <Form.Item name="password" style={{ marginBottom: 0 }}>
            <Input.Password
              className={`${
                (activateAccountValue.password && 'border-white') || ''
              }`}
              placeholder="Set your password (at least 8 characters)"
              bordered={false}
              maxLength={20}
              iconRender={(visible) =>
                visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
              }
              onChange={(e) =>
                setActivateAccountValue({
                  ...activateAccountValue,
                  password:
                    (isPassword(e.target.value) && e.target.value) || '',
                })
              }
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 25 }}>
            <Button
              className="signin-btn"
              disabled={!activateAccountValue.password || loading}
              type="primary"
              htmlType="submit"
            >
              DONE
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

const Login = ({
  defultLoginEmail,
  currentTicketId,
  redirectPage,
}: {
  defultLoginEmail: undefined | string;
  currentTicketId: string;
  redirectPage: string;
}) => {
  const router: any = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useAppDispatch();
  const cookies = useCookie([
    CookieKeys.userLoginToken,
    CookieKeys.userLoginEmail,
  ]);

  const error = useAppSelector(selectError);
  const loading = useAppSelector(selectLoading);
  const data = useAppSelector(selectData);

  const [isFirstRender, setIsFirstRender] = useState<boolean>(true);
  const [loginFormValue, setLoginFormValue] = useState<LoginPayloadType>({
    email: defultLoginEmail || '',
    password: '',
  });
  const [showActivateAccount, setShowActivateAccount] =
    useState<boolean>(false);
  const [checkGoogleDoc, setCheckGoogleDoc] = useState<boolean>(false);
  const [googleDocLink, setgoogleDocLink] = useState<string>('');
  const [isOpenAppShow, setIsOpenAppShow] = useState<boolean>(true);

  const onFinish = async (values: LoginPayloadType) => {
    const response: any = await dispatch(
      loginAction((defultLoginEmail && loginFormValue) || values)
    );
    if (
      response.payload.code === Messages.activateAccountUserDosentExist1001.code
    ) {
      dispatch(verifyUserAction({ email: loginFormValue.email }));
      router.push(
        `${RouterKeys.activateAccountNormalFlow}?${base64Encrypt({
          email: loginFormValue.email,
        })}`
      );
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
      cookies.setCookie(CookieKeys.userLoginEmail, loginFormValue.email, {
        expires: new Date(currentDate.getTime() + TokenExpire),
        path: '/',
        domain: window.location.hostname,
      });
      dispatch(resetTicketsListData());
      dispatch(resetTicketsCache());
      dispatch(resetEventCache());
      dispatch(resetCrowdFundCache());
      dispatch(setEventDataForSearch([]));
      if (currentTicketId) {
        router.push(
          RouterKeys.ticketDetail.replace(':slug', currentTicketId)
        );
      } else {
        router.push(redirectPage || RouterKeys.eventList);
      }
    }
  }, [data]);

  useEffect(() => {
    if (
      error &&
      !isFirstRender &&
      error.code !== Messages.activateAccountUserDosentExist1001.code
    ) {
      messageApi.open({
        content: getErrorMessage(error.code),
        className: 'error-message-login',
      });
    }
  }, [error]);

  // eslint-disable-next-line
  useEffect(() => {
    setShowActivateAccount(false);
    setIsFirstRender(false);
    return () => {
      dispatch(reset());
    };
  }, []);

  return (
    <LoginContainer>
      <div
        className="skip-login"
        onClick={() => router.push(RouterKeys.eventList)}
      >
        <span>Skip</span>
      </div>
      {(!checkGoogleDoc && (
        <div className="page-main">
          <Row className="main-logo">
            <Col span={24} className="logo">
              <div>
                <Image src={Images.Logo} alt="" />
              </div>
            </Col>
          </Row>
          {(!showActivateAccount && (
            <div>
              <Row className="main-title">
                <Col span={24} className="title">
                  LOGIN TO YOUR ACCOUNT
                </Col>
              </Row>
              <Form onFinish={onFinish}>
                {(defultLoginEmail && (
                  <>
                    <div className="tips">Login with</div>
                    <div className="tips signup-email">{defultLoginEmail}</div>
                  </>
                )) || (
                  <Form.Item name="email">
                    <Input
                      className={`${
                        (loginFormValue.email && 'border-white') || ''
                      }`}
                      placeholder="Email"
                      bordered={false}
                      onChange={(e) =>
                        setLoginFormValue({
                          ...loginFormValue,
                          email: e.target.value,
                        })
                      }
                    />
                  </Form.Item>
                )}
                <Form.Item name="password" style={{ marginBottom: 0 }}>
                  <div>
                    <Input.Password
                      className={`${
                        (loginFormValue.password && 'border-white') || ''
                      }`}
                      placeholder="Password"
                      bordered={false}
                      maxLength={20}
                      iconRender={(visible) =>
                        visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                      }
                      onChange={(e) =>
                        setLoginFormValue({
                          ...loginFormValue,
                          password: e.target.value,
                        })
                      }
                    />
                    {/* <p className="forgot-password">
                      FORGOT PASSWORD?
                    </p> */}
                  </div>
                </Form.Item>
                <Form.Item>
                  <Button
                    className="signin-btn"
                    disabled={
                      !loginFormValue.email ||
                      !isPassword(loginFormValue.password) ||
                      loading
                    }
                    type="primary"
                    htmlType="submit"
                  >
                    SIGN IN
                  </Button>
                </Form.Item>
                {/* <Divider>OR</Divider>
                <GoogleLoginComponent buttonText="CONTINUE WITH GOOGLE" /> */}
              </Form>
            </div>
          )) || (
            <ActivateAccountComponent
              checkGoogleDoc={setCheckGoogleDoc}
              googleDocLink={setgoogleDocLink}
            />
          )}
          <div
            className={
              (isOpenAppShow && 'page-bottom open-app') || 'page-bottom'
            }
          >
            <p className="registered">Don't have an account?</p>
            <p
              className="activate"
              onClick={() => router.push(RouterKeys.createAccount)}
            >
              REGISTER NOW
            </p>
          </div>
        </div>
      )) || (
        <GoogleDocComponent
          docLink={googleDocLink}
          checkGoogleDoc={setCheckGoogleDoc}
        />
      )}
      {isMobile && <OpenAppComponent setIsOpenAppShow={setIsOpenAppShow} />}
      {contextHolder}
    </LoginContainer>
  );
};

Login.getInitialProps = async (ctx: any) => {
  const { query } = ctx;
  let defultLoginEmail = undefined;
  let currentTicketId = '';
  let redirectPage = '';
  if (!isEmpty(query)) {
    redirectPage = query.redirect || '';
  }
  try {
    const parameters = base64Decrypt(Object.keys(query)[0]);
    defultLoginEmail = parameters.email;
    currentTicketId = parameters.ticketId;
  } catch (_) {}
  return { defultLoginEmail, currentTicketId, redirectPage };
};

export default Login;
