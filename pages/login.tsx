import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { isEmpty } from 'lodash';
import { isMobile } from 'react-device-detect';
import { Row, Col, Form, Input, Button, message } from 'antd';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';

import { useCookie } from '../hooks';
import Messages from '../constants/Messages';
import { CookieKeys, LocalStorageKeys, RouterKeys } from '../constants/Keys';
import { TokenExpire } from '../constants/General';
import {
  isEmail,
  getErrorMessage,
  isPassword,
  base64Decrypt,
  base64Encrypt,
  generateRandomString,
} from '../utils/func';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  loginAction,
  LoginPayloadType,
  verifyUserAction,
  selectError,
  selectLoading,
  selectData,
  reset,
  setLoginRedirectPage,
  selectLoginRedirectPage,
  resetLoginRedirectPage,
} from '../slice/user.slice';
import OpenAppComponent from '../components/openAppComponent';
import { LoginContainer } from '../styles/login-style';
import { resetTicketsCache } from '../slice/ticketsCache.slice';
import { resetTicketsListData } from '../slice/tickets.slice';
import { resetCrowdFundCache } from '../slice/crowdFundCache.slice';
import {
  resetEventCache,
  setEventDataForSearch,
} from '../slice/eventCache.slice';
import { resetMyTicketsCache } from '../slice/myTicketsCache.slice';
import { resetMyCollectiblesCache } from '../slice/myCollectiblesCache.slice';
import { resetCollectionDetailCache } from '../slice/collectionDetailCache.slice';
import AuthPageHearder from '@/components/authPageHearder';
import { resetMyRavesCache } from '@/slice/myRaves.slice';
// import GoogleLoginComponent from '../components/googleLoginComponent';

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
  const cookies = useCookie([
    CookieKeys.userLoginToken,
    CookieKeys.userLoginEmail,
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

  const onFinish = async (values: LoginPayloadType) => {
    const response: any = await dispatch(
      loginAction((defultLoginEmail && loginFormValue) || values)
    );
    if (
      response &&
      response.payload &&
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

  const handleResetPageCache = () => {
    dispatch(resetTicketsListData());
    dispatch(resetTicketsCache());
    dispatch(resetEventCache());
    dispatch(resetMyTicketsCache());
    dispatch(resetMyCollectiblesCache());
    dispatch(resetCollectionDetailCache());
    dispatch(resetCrowdFundCache());
    dispatch(setEventDataForSearch([]));
    dispatch(resetMyRavesCache());
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
      cookies.setCookie(CookieKeys.userLoginId, data.user.userId, {
        expires: new Date(currentDate.getTime() + TokenExpire),
        path: '/',
        domain: window.location.hostname,
      });
      localStorage.setItem(
        LocalStorageKeys.pageViewTrackKeys,
        generateRandomString()
      );
      handleResetPageCache();
      dispatch(resetLoginRedirectPage());
      if (ticketIdFormEmailLink && !currentTicketEventSlug) {
        router.push(RouterKeys.myTickets);
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
        const currentRedirectPage =
          redirectPage ||
          (loginRedirectPage && loginRedirectPage) ||
          RouterKeys.eventList;
        if (router.query.raves) {
          router.push({
            pathname: redirectPage || currentRedirectPage,
            query: `raves=${router.query.raves}`,
          });
        } else {
          router.push(redirectPage || currentRedirectPage);
        }
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

  // eslint-disable-next-line
  useEffect(() => {
    setIsFirstRender(false);
    return () => {
      dispatch(reset());
    };
  }, []);

  return (
    <LoginContainer>
      <AuthPageHearder skipClick={() => router.push(RouterKeys.eventList)} />
      <div className="page-main">
        <div className="main-form-content">
          <div>
            <Row className="main-title">
              <Col span={24} className="title">
                LOGIN TO YOUR ACCOUNT
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
                  <p className="forgot-password">
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
                      FORGOT PASSWORD?
                    </span>
                  </p>
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
          <div
            className={
              (isOpenAppShow && 'page-bottom open-app') || 'page-bottom'
            }
          >
            <p className="registered">{`Don't have an account?`}</p>
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
              REGISTER NOW
            </p>
          </div>
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
        const { redirect, raves } = query;
        if (raves && redirect) {
          redirectPage = `${redirect}&raves=${raves}`;
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
