import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { Row, Col, Form, Input, Button, message, Checkbox } from 'antd';
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import _, { isEmpty } from 'lodash';

import { useCookie, useResetPageCache } from '../hooks';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  isEmail,
  isPassword,
  getErrorMessage,
  base64Encrypt,
  base64Decrypt,
  generateRandomString,
  profileNameValidator,
  emailValidator,
  passwordValidator,
  renderAuthCookiesField,
  isFinishProfile,
} from '../utils/func';
import {
  TermsConditionsLink,
  PrivacyPolicyLink,
  TokenExpire,
  RegisterVerifyType,
  VerificationCodeLength,
  DefaultEmail,
  CountdownSeconds,
} from '../constants/General';
import { RouterKeys, CookieKeys, LocalStorageKeys } from '../constants/Keys';
import { LoginContainer } from '../styles/login-style';
import {
  reset,
  selectData,
  selectError,
  selectLoading,
  verifyUserAction,
  registerAccountAction,
  RegisterAccountPayload,
  getUserGenderAction,
  selectGetUserGenderLoading,
  selectLoginRedirectPage,
  resetLoginRedirectPage,
  LoginType,
  setShowCompeledProfileAfterLogin,
} from '../slice/user.slice';
import GoogleDocComponent from '../components/googleDocComponent';
import OpenAppComponent from '../components/openAppComponent';
import Messages from '../constants/Messages';
import AuthPageHearder from '@/components/authPageHearder';
import { Images } from '@/theme';
import GoogleAuthComponent from '@/components/googleLoginComponent';
import CustomOTPInput from '@/components/CustomOTPInput';
import useCountdown from '@/hooks/useCountDown';

const CreateAccount = ({
  redirectPage,
  currentTicketEventSlug,
  ticketIdFormEmailLink,
}: {
  redirectPage: string;
  currentTicketEventSlug: string;
  ticketIdFormEmailLink: string;
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
  const [checked, setChecked] = useState<boolean>(false);
  const [isTextShak, setTextShak] = useState<boolean>(false);
  const [checkGoogleDoc, setCheckGoogleDoc] = useState<boolean>(false);
  const [googleDocLink, setgoogleDocLink] = useState<string>('');
  const [isVerificationEmail, setIsVerificationEmail] =
    useState<boolean>(false);
  const [isVerificationCode, setIsVerificationCode] = useState<boolean>(false);
  const [passwordValue, setPasswordValue] = useState<string>('');
  const [createAccountValue, setCreateAccountValue] =
    useState<RegisterAccountPayload>({
      email: '',
      code: '',
      password: '',
      firstName: '',
      lastName: '',
    });
  const { seconds, startTheCountdown } = useCountdown({ count: CountdownSeconds });

  const onFinishFailed = (errors: any) => {
    const firstErrorField = errors.errorFields[0];
    if (firstErrorField) {
      const { name } = firstErrorField;
      const inputElement = inputRefs.current[name[0]];
      if (inputElement) {
        inputElement.focus();
      }
    }
  };

  const resendOtp = _.debounce(() => {
    if (isVerificationEmail && seconds >= CountdownSeconds) {
      dispatch(
        verifyUserAction({
          email: createAccountValue.email,
          firstName: createAccountValue.firstName,
          lastName: createAccountValue.lastName,
        })
      );
      startTheCountdown();
    }
  }, 1000);

  const onGoogleSuccess = (googleCode: string) => {
    dispatch(
      registerAccountAction({
        email: DefaultEmail,
        externalChannel: LoginType.google,
        externalId: googleCode,
      })
    );
  };

  const onFinish = async (values: any) => {
    if (!isVerificationEmail) {
      if (checked) {
        const result = await dispatch(
          verifyUserAction({
            email: createAccountValue.email,
            firstName: createAccountValue.firstName,
            lastName: createAccountValue.lastName,
          })
        );
        if (result.type === verifyUserAction.fulfilled.toString()) {
          if (redirectPage || loginRedirectPage) {
            router.push({
              pathname: RouterKeys.activateAccountNormalFlow,
              query: `redirect=${
                redirectPage || loginRedirectPage
              }&email=${base64Encrypt({
                email: createAccountValue.email,
                firstName: createAccountValue.firstName,
                lastName: createAccountValue.lastName,
                password: createAccountValue.password,
              })}`,
            });
          } else {
            router.push(
              `${RouterKeys.activateAccountNormalFlow}?${base64Encrypt({
                email: createAccountValue.email,
                firstName: createAccountValue.firstName,
                lastName: createAccountValue.lastName,
                password: createAccountValue.password,
              })}`
            );
          }
        }
      } else {
        setTextShak(true);
      }
      return;
    }
    if (!isVerificationCode) {
      if (createAccountValue.email) {
        const result = await dispatch(
          registerAccountAction({
            ...createAccountValue,
            ...values,
            email: createAccountValue.email,
            type: RegisterVerifyType,
            externalChannel: LoginType.email,
          })
        );
        if (result.type === registerAccountAction.fulfilled.toString()) {
          setIsVerificationCode(true);
        }
      } else {
        message.open({
          content: 'Email is required.',
          className: 'error-message-event',
        });
      }
      return;
    }
  };

  const checkGoogleDocAction = (link: string) => {
    setCheckGoogleDoc(true);
    setgoogleDocLink(link);
  };

  useEffect(() => {
    if (data.token) {
      const currentDate = new Date();
      renderAuthCookiesField(data, createAccountValue).forEach((item) => {
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
    if (!isFirstRender && error) {
      if (error.code === Messages.continueToRegister.code) {
        setIsVerificationEmail(true);
      } else {
        message.open({
          content:
            (error.code === Messages.activateAccountUserAlreadyExist.code &&
              'This email address is already registered. Please log in or use a different email address.') ||
            getErrorMessage(error.code),
          className: 'error-message-login',
        });
      }
    }
  }, [error]);

  useEffect(() => {
    dispatch(getUserGenderAction());
    setIsFirstRender(false);
    return () => {
      dispatch(reset());
    };
  }, []);

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
          {(!checkGoogleDoc && (
            <div className="page-main">
              <div className="main-form-content">
                <div>
                  <Row className="main-title">
                    <Col span={24} className="title">
                      CREATE AN ACCOUNT
                    </Col>
                  </Row>
                  {!isVerificationEmail && (
                    <Form
                      autoComplete="off"
                      onFinish={onFinish}
                      onFinishFailed={onFinishFailed}
                    >
                      <Form.Item
                        name="email"
                        rules={[{ validator: emailValidator }]}
                      >
                        <Input
                          ref={(input) => (inputRefs.current.email = input)}
                          className={`${
                            (createAccountValue.email && 'border-white') || ''
                          }`}
                          placeholder="Email"
                          bordered={false}
                          onChange={(e) =>
                            setCreateAccountValue({
                              ...createAccountValue,
                              email:
                                (isEmail(e.target.value) && e.target.value) ||
                                '',
                            })
                          }
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
                              className={`${
                                (createAccountValue.firstName &&
                                  'border-white') ||
                                ''
                              }`}
                              placeholder="First name (at least 2 characters)"
                              maxLength={20}
                              bordered={false}
                              onChange={(e) =>
                                setCreateAccountValue({
                                  ...createAccountValue,
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
                              className={`${
                                (createAccountValue.lastName &&
                                  'border-white') ||
                                ''
                              }`}
                              placeholder="Last name (at least 1 character)"
                              maxLength={20}
                              bordered={false}
                              onChange={(e) =>
                                setCreateAccountValue({
                                  ...createAccountValue,
                                  lastName: e.target.value,
                                })
                              }
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Form.Item
                        name="password"
                        rules={[{ validator: passwordValidator }]}
                      >
                        <Input.Password
                          autoComplete="new-password"
                          ref={(input) => (inputRefs.current.password = input)}
                          className={`${
                            (passwordValue && 'border-white') || ''
                          }`}
                          placeholder="Set your password (at least 8 characters)"
                          bordered={false}
                          maxLength={20}
                          iconRender={(visible) =>
                            visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                          }
                          onChange={(e) => {
                            setPasswordValue(e.target.value);
                            setCreateAccountValue({
                              ...createAccountValue,
                              password:
                                (isPassword(e.target.value) &&
                                  e.target.value) ||
                                '',
                            });
                          }}
                        />
                      </Form.Item>
                      <Form.Item
                        style={{ marginBottom: 0 }}
                        className={(isTextShak && 'text-shak') || ''}
                      >
                        <div className="agreement-wrapper">
                          <Checkbox
                            className={`${
                              (!checked && 'checkbox-show-error') || ''
                            }`}
                            checked={checked}
                            onChange={(e) => setChecked(e.target.checked)}
                          />
                          <div style={{ marginLeft: 8 }}>
                            <span className="agreement-label">
                              I agree to CrowdServe{' '}
                              <span
                                className="agreement-label-action"
                                onClick={() =>
                                  checkGoogleDocAction(TermsConditionsLink)
                                }
                              >
                                Terms&Conditions
                              </span>
                              and{' '}
                              <span
                                className="agreement-label-action"
                                onClick={() =>
                                  checkGoogleDocAction(PrivacyPolicyLink)
                                }
                              >
                                Privacy Policy.
                              </span>
                            </span>
                          </div>
                        </div>
                      </Form.Item>
                      <Form.Item>
                        <Button
                          className="signin-btn"
                          disabled={loading}
                          type="primary"
                          htmlType="submit"
                          onClick={() => setTextShak(false)}
                        >
                          CONTINUE
                        </Button>
                      </Form.Item>
                      <GoogleAuthComponent
                        buttonText="SIGN IN WITH GOOGLE"
                        onSuccess={onGoogleSuccess}
                      />
                    </Form>
                  )}
                  {!isVerificationCode && isVerificationEmail && (
                    <>
                      <Row className="code-sent">
                        <Col span={24} className="title">
                          Verification code has been sent to
                        </Col>
                        <Col span={24} className="value">
                          {createAccountValue.email}
                        </Col>
                      </Row>
                      <Form onFinish={onFinish}>
                        <Row justify="center">
                          <Col>
                            <Form.Item name="code">
                              <CustomOTPInput
                                onChange={(value) =>
                                  setCreateAccountValue({
                                    ...createAccountValue,
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
                              !createAccountValue.code ||
                              createAccountValue.code.length <
                                VerificationCodeLength ||
                              loading
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
                  {isVerificationEmail ? (
                    <>
                      <>
                        <p className="registered">Didn’t receive the code?</p>
                        <p
                          className={
                            seconds < CountdownSeconds
                              ? 'activate resend-count-down'
                              : 'activate'
                          }
                          onClick={resendOtp}
                        >
                          {seconds < CountdownSeconds ? `${seconds}s` : 'Resend'}
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
          )) || (
            <GoogleDocComponent
              docLink={googleDocLink}
              checkGoogleDoc={setCheckGoogleDoc}
            />
          )}
          <OpenAppComponent setIsOpenAppShow={setIsOpenAppShow} />
        </LoginContainer>
      )}
    </>
  );
};

CreateAccount.getInitialProps = async (ctx: any) => {
  const { query } = ctx;
  let currentTicketEventSlug = '';
  let ticketIdFormEmailLink = '';
  let redirectPage = '';
  try {
    if (!isEmpty(query)) {
      const { redirect, raves } = query;
      if (raves && redirect) {
        redirectPage = `${redirect}&raves=${raves}`;
      } else {
        const parameters = base64Decrypt(Object.keys(query)[0]);
        currentTicketEventSlug = parameters.eventSlug;
        ticketIdFormEmailLink = parameters.ticketId;
        redirectPage = query.redirect || '';
      }
    }
  } catch {}
  return {
    currentTicketEventSlug,
    redirectPage,
    ticketIdFormEmailLink,
  };
};

export default CreateAccount;
