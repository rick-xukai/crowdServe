import React, { useEffect, useState, useRef } from 'react';
import { Row, Col, Form, Input, Button, message } from 'antd';
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import _, { isEmpty } from 'lodash';

import { useCookie, useResetPageCache } from '../hooks';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  isPassword,
  getErrorMessage,
  base64Decrypt,
  generateRandomString,
  profileNameValidator,
  renderAuthCookiesField,
  isFinishProfile,
} from '../utils/func';
import {
  TokenExpire,
  VerificationCodeLength,
  ForgotPasswordAccountNotActivate,
  ActivateAccountFirst,
  AccountNotActivate,
} from '../constants/General';
import { RouterKeys, CookieKeys, LocalStorageKeys } from '../constants/Keys';
import { LoginContainer } from '../styles/login-style';
import OpenAppComponent from '../components/openAppComponent';
import {
  selectData,
  loginAction,
  selectError,
  selectLoading,
  reset,
  getUserGenderAction,
  selectGetUserGenderLoading,
  selectLoginRedirectPage,
  resetLoginRedirectPage,
  setShowCompeledProfileAfterLogin,
  LoginType,
  verifyUserAction,
} from '../slice/user.slice';
import AuthPageHearder from '@/components/authPageHearder';
import { Images } from '@/theme';
import CustomOTPInput from '@/components/CustomOTPInput';
import useCountdown from '@/hooks/useCountDown';

const ActivateAccountNormalFlow = ({
  accountEmail,
  redirectPage,
  currentTicketEventSlug,
  ticketIdFormEmailLink,
  accountFirstName,
  accountLastName,
  accountPassword,
}: {
  accountEmail: string;
  redirectPage: string;
  currentTicketEventSlug: string;
  ticketIdFormEmailLink: string;
  accountFirstName: string;
  accountLastName: string;
  accountPassword: string;
}) => {
  const resetPageCache = useResetPageCache();
  const cookies = useCookie([
    CookieKeys.userLoginToken,
    CookieKeys.userLoginEmail,
    CookieKeys.userLoginId,
    CookieKeys.userProfileInfo,
  ]);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const inputRefs = useRef<any>({});

  const data = useAppSelector(selectData);
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);
  const getUserGenderLoading = useAppSelector(selectGetUserGenderLoading);
  const loginRedirectPage = useAppSelector(selectLoginRedirectPage);

  const [isFirstRender, setIsFirstRender] = useState<boolean>(true);
  const [isOpenAppShow, setIsOpenAppShow] = useState<boolean>(true);
  const [passwordValue, setPasswordValue] = useState<string>('');
  const [passwordSuccess, setPasswordSuccess] = useState<boolean>(
    !!accountPassword
  );
  const [activateAccountValue, setActivateAccountValue] = useState({
    email: accountEmail,
    code: '',
    password: accountPassword,
    firstName: accountFirstName,
    lastName: accountLastName,
  });
  const totalCount = 60;
  const { seconds, startTheCountdown } = useCountdown({ count: totalCount });

  const onFinish = async (values: any) => {
    if (!passwordSuccess) {
      setPasswordSuccess(true);
      dispatch(verifyUserAction({ email: activateAccountValue.email }));
      return;
    }
    if (passwordSuccess) {
      if (activateAccountValue.email) {
        dispatch(
          loginAction({
            ...activateAccountValue,
            externalChannel: LoginType.email,
            ...values,
          })
        );
      } else {
        message.open({
          content: 'Email is required.',
          className: 'error-message-event',
        });
      }
      return;
    }
  };

  useEffect(() => {
    if (data.token) {
      const currentDate = new Date();
      renderAuthCookiesField(data, activateAccountValue).forEach((item) => {
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
            pathname: redirectPage || currentRedirectPage,
            query: `raves=${router.query.raves}`,
          });
        } else {
          router.push(redirectPage || currentRedirectPage);
        }
      }
      if (!isFinishProfile(data.user)) {
        dispatch(setShowCompeledProfileAfterLogin(true));
      }
    }
  }, [data]);

  useEffect(() => {
    const { query } = router;
    if (query && !isEmpty(query)) {
      const { source, redirect, raves } = query;
      let currentSource = '';
      if (redirect && raves) {
        currentSource = (source as string) || '';
      } else {
        const parameters = base64Decrypt(Object.keys(query)[0]);
        currentSource = parameters.source;
      }
      if (currentSource && currentSource === ForgotPasswordAccountNotActivate) {
        message.open({
          content: ActivateAccountFirst,
          className: 'error-message-login',
        });
      } else {
        message.open({
          content: AccountNotActivate,
          className: 'error-message-login',
        });
      }
    }
  }, [router.isReady]);

  useEffect(() => {
    if (error && !isFirstRender) {
      message.open({
        content: getErrorMessage(error.code),
        className: 'error-message-login',
      });
    }
  }, [error]);

  useEffect(() => {
    dispatch(getUserGenderAction());
    setIsFirstRender(false);
    return () => {
      dispatch(reset());
    };
  }, []);

  const initEmailFormValues = {
    email: activateAccountValue.email,
  };

  const resendOtp = _.debounce(() => {
    if (passwordSuccess && seconds >= totalCount) {
      dispatch(verifyUserAction({ email: activateAccountValue.email }));
      startTheCountdown();
    }
  }, 1000);

  return (
    <>
      {(getUserGenderLoading && (
        <LoginContainer>
          <div className="page-loading">
            <LoadingOutlined />
          </div>
        </LoginContainer>
      )) || (
        <LoginContainer className={isOpenAppShow ? 'open-app-show' : ''}>
          <img
            className="page-background"
            src={Images.AnimatedBackground.src}
            alt=""
          />
          <AuthPageHearder
            skipClick={() => router.push(RouterKeys.eventList)}
          />
          <div className="page-main">
            <div className="main-form-content">
              <div>
                <Row className="main-title">
                  <Col span={24} className="title">
                    ACTIVATE YOUR ACCOUNT
                  </Col>
                </Row>
                {!passwordSuccess && (
                  <Form
                    onFinish={onFinish}
                    initialValues={initEmailFormValues}
                    autoComplete="off"
                  >
                    <Form.Item
                      className="only-read-item"
                      name="email"
                      label="Signup with"
                      colon={false}
                      labelCol={{ span: 24 }}
                    >
                      <Input
                        autoComplete="off"
                        placeholder="Email"
                        bordered={false}
                        disabled
                      />
                    </Form.Item>
                    <Row gutter={10}>
                      <Col span={12}>
                        <Form.Item
                          name="firstName"
                          rules={[{ validator: profileNameValidator }]}
                          getValueFromEvent={(e) => {
                            const { value } = e.target;
                            return value
                              .replace(/[0-9]/g, '')
                              .replace(/[^\w^\s^\u4e00-\u9fa5]/gi, '');
                          }}
                        >
                          <Input
                            ref={(input) =>
                              (inputRefs.current.firstName = input)
                            }
                            autoComplete="off"
                            className={`${
                              (activateAccountValue.firstName &&
                                'border-white') ||
                              ''
                            }`}
                            placeholder="First name (at least 2 characters)"
                            maxLength={20}
                            bordered={false}
                            onChange={(e) =>
                              setActivateAccountValue({
                                ...activateAccountValue,
                                firstName: e.target.value,
                              })
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="lastName"
                          rules={[
                            {
                              required: true,
                              message: 'Last name is required',
                            },
                          ]}
                          getValueFromEvent={(e) => {
                            const { value } = e.target;
                            return value
                              .replace(/[0-9]/g, '')
                              .replace(/[^\w^\s^\u4e00-\u9fa5]/gi, '');
                          }}
                        >
                          <Input
                            ref={(input) =>
                              (inputRefs.current.lastName = input)
                            }
                            autoComplete="off"
                            className={`${
                              (activateAccountValue.lastName &&
                                'border-white') ||
                              ''
                            }`}
                            placeholder="Last name (at least 1 character)"
                            maxLength={20}
                            bordered={false}
                            onChange={(e) =>
                              setActivateAccountValue({
                                ...activateAccountValue,
                                lastName: e.target.value,
                              })
                            }
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Form.Item>
                      <Input.Password
                        autoComplete="new-password"
                        value={passwordValue}
                        className={`${(passwordValue && 'border-white') || ''}`}
                        placeholder="Set your password (at least 8 characters)"
                        bordered={false}
                        maxLength={20}
                        iconRender={(visible) =>
                          visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                        }
                        onChange={(e) => {
                          setPasswordValue(e.target.value);
                          setActivateAccountValue({
                            ...activateAccountValue,
                            password:
                              (isPassword(e.target.value) && e.target.value) ||
                              '',
                          });
                        }}
                      />
                    </Form.Item>
                    <Form.Item>
                      <Button
                        className="signin-btn"
                        type="primary"
                        htmlType="submit"
                      >
                        CONTINUE
                      </Button>
                    </Form.Item>
                  </Form>
                )}
                {passwordSuccess && (
                  <>
                    <Row className="code-sent" justify="center">
                      <Col span={24} className="title">
                        Verification code has been sent to
                      </Col>
                      <Col span={24} className="value">
                        {activateAccountValue.email}
                      </Col>
                    </Row>
                    <Form onFinish={onFinish}>
                      <Row justify="center">
                        <Col>
                          <Form.Item name="code">
                            <CustomOTPInput
                              onChange={(value) =>
                                setActivateAccountValue({
                                  ...activateAccountValue,
                                  code: value,
                                })
                              }
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Form.Item>
                        <Button
                          className="signin-btn"
                          disabled={
                            activateAccountValue.code.length <
                              VerificationCodeLength || loading
                          }
                          type="primary"
                          htmlType="submit"
                        >
                          COMPLETE
                        </Button>
                      </Form.Item>
                    </Form>
                  </>
                )}
              </div>
              <div
                className={
                  (isOpenAppShow && 'page-bottom open-app') || 'page-bottom'
                }
              >
                {passwordSuccess ? (
                  <>
                    <>
                      <p className="registered">Didn’t receive the code?</p>
                      <p
                        className={
                          seconds < totalCount
                            ? 'activate resend-count-down'
                            : 'activate'
                        }
                        onClick={resendOtp}
                      >
                        {seconds < totalCount ? `${seconds}s` : 'Resend'}
                      </p>
                    </>
                  </>
                ) : (
                  <>
                    <p className="registered">Already have an account?</p>
                    <p
                      className="activate"
                      onClick={() => {
                        if (redirectPage || loginRedirectPage) {
                          router.push({
                            pathname: RouterKeys.login,
                            query: `redirect=${
                              redirectPage || loginRedirectPage
                            }`,
                          });
                        } else {
                          router.push(RouterKeys.login);
                        }
                      }}
                    >
                      Sign in
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
          <OpenAppComponent setIsOpenAppShow={setIsOpenAppShow} />
        </LoginContainer>
      )}
    </>
  );
};

ActivateAccountNormalFlow.getInitialProps = async (ctx: any) => {
  const { query } = ctx;
  let accountEmail = '';
  let currentTicketEventSlug = '';
  let ticketIdFormEmailLink = '';
  let redirectPage = '';
  let accountFirstName = '';
  let accountLastName = '';
  let accountPassword = '';
  try {
    if (!isEmpty(query)) {
      const { redirect, raves, email } = query;
      if (raves && redirect) {
        redirectPage = `${redirect}&raves=${raves}`;
        const {
          email: currentEmail,
          firstName: currentFirstName,
          lastName: currentLastName,
          password: currentPassword,
        } = base64Decrypt(email.replaceAll('=', '')) || {};
        accountEmail = currentEmail || '';
        accountFirstName = currentFirstName || '';
        accountLastName = currentLastName || '';
        accountPassword = currentPassword || '';
      } else {
        const parameters = base64Decrypt(Object.keys(query)[0]);
        currentTicketEventSlug = parameters.eventSlug;
        ticketIdFormEmailLink = parameters.ticketId;
        redirectPage = query.redirect || '';
        accountEmail = parameters.email;
        accountFirstName = parameters.firstName || '';
        accountLastName = parameters.lastName || '';
        accountPassword = parameters.password || '';
      }
    }
  } catch {}
  return {
    accountEmail,
    redirectPage,
    currentTicketEventSlug,
    ticketIdFormEmailLink,
    accountFirstName,
    accountLastName,
    accountPassword,
  };
};

export default ActivateAccountNormalFlow;
