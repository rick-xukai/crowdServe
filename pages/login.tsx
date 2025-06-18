import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { isEmpty } from 'lodash';
import { isMobile } from 'react-device-detect';
import { Row, Col, Form, Input, Button, message } from 'antd';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';

import { useCookie, useResetPageCache } from '../hooks';
import Messages from '../constants/Messages';
import { CookieKeys, LocalStorageKeys, RouterKeys } from '../constants/Keys';
import { DefaultEmail, TokenExpire } from '../constants/General';
import {
  isEmail,
  getErrorMessage,
  isPassword,
  base64Decrypt,
  base64Encrypt,
  generateRandomString,
  renderAuthCookiesField,
  isFinishProfile,
} from '../utils/func';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  loginAction,
  LoginPayloadType,
  selectError,
  selectLoading,
  selectData,
  reset,
  setLoginRedirectPage,
  selectLoginRedirectPage,
  resetLoginRedirectPage,
  LoginType,
  setShowCompeledProfileAfterLogin,
} from '../slice/user.slice';
import OpenAppComponent from '../components/openAppComponent';
import { LoginContainer } from '../styles/login-style';
import AuthPageHearder from '@/components/authPageHearder';
import { Images } from '@/theme';
import GoogleAuthComponent from '@/components/googleLoginComponent';

const Login = ({
  defultLoginEmail,
  currentTicketEventSlug,
  ticketIdFormEmailLink,
  redirectPage,
}: {
  defultLoginEmail: undefined | string;
  currentTicketEventSlug: string;
  ticketIdFormEmailLink: string;
  redirectPage: string;
}) => {
  const router: any = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useAppDispatch();
  const resetPageCache = useResetPageCache();
  const cookies = useCookie([
    CookieKeys.userLoginToken,
    CookieKeys.userLoginEmail,
    CookieKeys.userProfileInfo,
  ]);

  const error = useAppSelector(selectError);
  const loading = useAppSelector(selectLoading);
  const data = useAppSelector(selectData);
  const loginRedirectPage = useAppSelector(selectLoginRedirectPage);

  const [isFirstRender, setIsFirstRender] = useState<boolean>(true);
  const [loginEmailParameter, setLoginEmailParameter] = useState<string>(
    defultLoginEmail || ''
  );
  const [loginFormValue, setLoginFormValue] = useState<LoginPayloadType>({
    email: defultLoginEmail || '',
    password: '',
    externalChannel: LoginType.email,
  });
  const [isOpenAppShow, setIsOpenAppShow] = useState<boolean>(true);

  useEffect(() => {
    const { query } = router;
    if (query && !isEmpty(query)) {
      if (!query.redirect && query.redirect !== '') {
        const parameters = base64Decrypt(Object.keys(query)[0]);
        if (parameters.email) {
          setLoginEmailParameter(parameters.email);
        }
      }
    }
  }, [router.isReady]);

  const doTheLogin = async (values: LoginPayloadType) => {
    const response: any = await dispatch(loginAction(values));
    if (
      response &&
      response.payload &&
      response.payload.code === Messages.activateAccountUserDosentExist1001.code
    ) {
      router.push(
        `${RouterKeys.activateAccountNormalFlow}?${base64Encrypt({
          email: loginFormValue.email,
        })}`
      );
    }
  };

  const onFinish = async (values: LoginPayloadType) => {
    let payload: LoginPayloadType = {
      ...((defultLoginEmail && loginFormValue) || values),
      externalChannel: LoginType.email,
    };
    doTheLogin(payload);
  };

  useEffect(() => {
    if (data.token) {
      const currentDate = new Date();
      renderAuthCookiesField(data, loginFormValue).forEach((item) => {
        cookies.setCookie(item.name, item.value, {
          expires: new Date(currentDate.getTime() + TokenExpire),
          path: '/',
          domain: window.location.hostname,
        });
      });
      localStorage.setItem(
        LocalStorageKeys.pageViewTrackKeys,
        generateRandomString()
      );
      resetPageCache.handleResetPageCache();
      dispatch(resetLoginRedirectPage());
      if (ticketIdFormEmailLink && !currentTicketEventSlug) {
        router.push(RouterKeys.myTickets);
        if (!isFinishProfile(data.user)) {
          dispatch(setShowCompeledProfileAfterLogin(true));
        }
        return;
      }
      if (currentTicketEventSlug) {
        router.push(
          RouterKeys.myTicketsEventDetail.replace(
            ':slug',
            currentTicketEventSlug
          )
        );
      } else {
        let currentRedirectPage = RouterKeys.eventList;
        if (redirectPage) {
          currentRedirectPage = redirectPage;
        } else if (loginRedirectPage) {
          currentRedirectPage = loginRedirectPage;
        }
        if (router.query.raves) {
          router.push({
            pathname: currentRedirectPage,
            query: `raves=${router.query.raves}`,
          });
        } else {
          router.push(currentRedirectPage);
        }
      }
      if (!isFinishProfile(data.user)) {
        dispatch(setShowCompeledProfileAfterLogin(true));
      }
    }
  }, [data]);

  useEffect(() => {
    if (redirectPage) {
      dispatch(setLoginRedirectPage(redirectPage));
    }
  }, [redirectPage]);

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

  useEffect(() => {
    const { query } = router;
    const userToken = cookies.getCookie(CookieKeys.userLoginToken);
    if (userToken) {
      router.push(query.redirect || RouterKeys.eventList);
    }
  }, [router.isReady]);

  useEffect(() => {
    setIsFirstRender(false);
    return () => {
      dispatch(reset());
    };
  }, []);

  return (
    <LoginContainer>
      <img
        className="page-background"
        src={Images.AnimatedBackground.src}
        alt=""
      />
      <AuthPageHearder skipClick={() => router.push(RouterKeys.eventList)} />
      <div className="page-main">
        <div className="main-form-content">
          <div>
            <Row className="main-title">
              <Col span={24} className="title">
                SIGN IN TO YOUR ACCOUNT
              </Col>
            </Row>
            <Form onFinish={onFinish}>
              {(loginEmailParameter && (
                <>
                  <div className="tips">Login with</div>
                  <div className="tips signup-email">{loginEmailParameter}</div>
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
                        email:
                          (isEmail(e.target.value) && e.target.value) || '',
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
                    <span
                      onClick={() => {
                        if (redirectPage || loginRedirectPage) {
                          if (loginEmailParameter) {
                            router.push({
                              pathname: RouterKeys.forgotPassword,
                              query: `redirect=${
                                redirectPage || loginRedirectPage
                              }&email=${base64Encrypt({
                                email: loginEmailParameter,
                              })}`,
                            });
                          } else {
                            router.push({
                              pathname: RouterKeys.forgotPassword,
                              query: `redirect=${
                                redirectPage || loginRedirectPage
                              }`,
                            });
                          }
                        } else {
                          if (loginEmailParameter) {
                            router.push(
                              `${RouterKeys.forgotPassword}?${base64Encrypt({
                                email: loginEmailParameter,
                              })}`
                            );
                          } else {
                            router.push(RouterKeys.forgotPassword);
                          }
                        }
                      }}
                    >
                      Forgot password?
                    </span>
                  </p> */}
                </div>
              </Form.Item>
              <Form.Item>
                <Button
                  className="signin-btn"
                  disabled={
                    !loginFormValue.email ||
                    !isPassword(loginFormValue.password || '') ||
                    loading
                  }
                  type="primary"
                  htmlType="submit"
                >
                  SIGN IN
                </Button>
              </Form.Item>
              {/* <GoogleAuthComponent
                buttonText="SIGN IN WITH GOOGLE"
                onSuccess={(code) =>
                  doTheLogin({
                    email: DefaultEmail,
                    externalId: code,
                    externalChannel: LoginType.google,
                  })
                }
              /> */}
            </Form>
          </div>
          {/* <div
            className={
              (isOpenAppShow && 'page-bottom open-app') || 'page-bottom'
            }
          >
            <p className="registered">{`New to CrowdServe?`}</p>
            <p
              className="activate"
              onClick={() => {
                if (redirectPage || loginRedirectPage) {
                  router.push({
                    pathname: RouterKeys.createAccount,
                    query: `redirect=${redirectPage || loginRedirectPage}`,
                  });
                } else {
                  router.push(RouterKeys.createAccount);
                }
              }}
            >
              Create an account
            </p>
          </div> */}
        </div>
      </div>
      {isMobile && <OpenAppComponent setIsOpenAppShow={setIsOpenAppShow} />}
      {contextHolder}
    </LoginContainer>
  );
};

Login.getInitialProps = async (ctx: any) => {
  const { query, req, res } = ctx;
  let defultLoginEmail = undefined;
  let currentTicketEventSlug = '';
  let ticketIdFormEmailLink = '';
  let redirectPage = '';
  try {
    const token = req.cookies[CookieKeys.userLoginToken];
    if (token) {
      res.writeHead(302, { Location: redirectPage || RouterKeys.eventList });
      res.end();
    } else {
      if (!isEmpty(query)) {
        const { redirect, raves, userEmail } = query;
        if (redirect) {
          redirectPage = redirect;
          if (raves) {
            redirectPage = `${redirect}&raves=${raves}`;
          }
          if (userEmail) {
            defultLoginEmail = userEmail;
          }
        } else {
          const parameters = base64Decrypt(Object.keys(query)[0]);
          redirectPage = query.redirect || '';
          defultLoginEmail = parameters.email;
          currentTicketEventSlug = parameters.eventSlug;
          ticketIdFormEmailLink = parameters.ticketId;
        }
      }
    }
  } catch (_) {}
  return {
    defultLoginEmail,
    currentTicketEventSlug,
    redirectPage,
    ticketIdFormEmailLink,
  };
};

export default Login;
