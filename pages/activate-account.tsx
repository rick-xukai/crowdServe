import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { Row, Col, Form, Input, Button, message, Checkbox } from 'antd';
import {
  EyeInvisibleOutlined,
  EyeOutlined,
  LoadingOutlined,
} from '@ant-design/icons';

import { useCookie } from '../hooks';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { CookieKeys, RouterKeys } from '../constants/Keys';
import {
  loginAction,
  selectError,
  selectLoading,
  selectData,
  reset,
  getUserGenderAction,
  selectGetUserGenderLoading,
  setShowCompeledProfileAfterLogin,
} from '../slice/user.slice';
import { verifyUserAction } from '../slice/user.slice';
import {
  isPassword,
  base64Decrypt,
  getErrorMessage,
  profileNameValidator,
  verificationCodeValidator,
  passwordValidator,
  renderAuthCookiesField,
  isFinishProfile,
} from '../utils/func';
import {
  TokenExpire,
  PrivacyPolicyLink,
  TermsConditionsLink,
  CodeExpired,
} from '../constants/General';
import GoogleDocComponent from '../components/googleDocComponent';
import OpenAppComponent from '../components/openAppComponent';
import AuthPageHearder from '@/components/authPageHearder';
import { ActivateAccountContainer } from '@/styles/activateAccount.style';
import { Images } from '@/theme';

let timer: NodeJS.Timer | null = null;

const ActivateAccount = ({
  redirectPage,
  defultEmail,
  defultFirstName,
  defultLastName,
  activateCode,
  currentTicketId,
  currentTicketEventSlug,
  codeStatusExpired,
}: {
  redirectPage: string;
  defultEmail: string;
  defultFirstName: string;
  defultLastName: string;
  activateCode: string;
  currentTicketId: string;
  currentTicketEventSlug: string;
  codeStatusExpired: boolean;
}) => {
  const cookies = useCookie([
    CookieKeys.userLoginToken,
    CookieKeys.userProfileInfo,
  ]);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const inputRefs = useRef<any>({});
  const formRef = useRef<any>(null);

  const error = useAppSelector(selectError);
  const loading = useAppSelector(selectLoading);
  const data = useAppSelector(selectData);
  const getUserGenderLoading = useAppSelector(selectGetUserGenderLoading);

  const [checked, setChecked] = useState<boolean>(false);
  const [isFirstRender, setIsFirstRender] = useState<boolean>(true);
  const [isTextShak, setTextShak] = useState<boolean>(false);
  const [checkGoogleDoc, setCheckGoogleDoc] = useState<boolean>(false);
  const [googleDocLink, setGoogleDocLink] = useState<string>('');
  const [passwordValue, setPasswordValue] = useState<string>('');
  const [isOpenAppShow, setIsOpenAppShow] = useState<boolean>(false);

  const [activateAccountFormValue, setActivateAccountFormValue] = useState<any>(
    {
      email: defultEmail,
      code: activateCode,
      password: '',
      firstName: defultFirstName,
      lastName: defultLastName,
    }
  );
  const [passwordSuccess, setPasswordSuccess] = useState<boolean>(false);
  const [showCodeExpiredRequestButton, setShowCodeExpiredRequestButton] =
    useState<boolean>(false);
  const [countdownNumber, setCountdownNumber] = useState<
    number | ((prevTime: number) => void)
  >(0);

  const onFinishFailed = (formError: any) => {
    const firstErrorField = formError.errorFields[0];
    if (firstErrorField) {
      const { name } = firstErrorField;
      const inputElement = inputRefs.current[name[0]];
      if (inputElement) {
        inputElement.focus();
      }
    }
  };

  const onFinish = async () => {
    if (!passwordSuccess && checked) {
      setPasswordSuccess(true);
      dispatch(loginAction(activateAccountFormValue));
      return;
    }
    if (!checked) {
      setTextShak(true);
      return;
    }
  };

  const timeMethod = () => {
    setCountdownNumber(60);
    if (timer) {
      clearInterval(timer);
    }
    timer = setInterval(() => {
      setCountdownNumber((prevTime: number) => {
        if (prevTime > 0) {
          return prevTime - 1;
        }
        return 0;
      });
    }, 1000);
  };

  const requestNewCode = () => {
    dispatch(verifyUserAction({ email: activateAccountFormValue.email }));
    timeMethod();
  };

  useEffect(() => {
    if (data.token) {
      const currentDate = new Date();
      renderAuthCookiesField(data, activateAccountFormValue).forEach((item) => {
        cookies.setCookie(item.name, item.value, {
          expires: new Date(currentDate.getTime() + TokenExpire),
          path: '/',
          domain: window.location.hostname,
        });
      });
      if (!isFinishProfile(data.user)) {
        dispatch(setShowCompeledProfileAfterLogin(true));
      }
      if (currentTicketId && !currentTicketEventSlug) {
        router.push(RouterKeys.eventList);
        return;
      }
      if (currentTicketEventSlug) {
        router.push(
          RouterKeys.myTicketsEventDetail.replace(
            ':slug',
            currentTicketEventSlug
          )
        );
        return;
      }
      if (redirectPage) {
        router.push(redirectPage);
        return;
      }
      router.push(RouterKeys.eventList);
    }
  }, [data.token]);

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
      clearInterval(Number(timer));
    };
  }, []);

  useEffect(() => {
    if (codeStatusExpired) {
      message.open({
        content: CodeExpired,
        className: 'error-message-event',
      });
      setShowCodeExpiredRequestButton(true);
    }
  }, [codeStatusExpired]);

  return (
    <>
      {(getUserGenderLoading && (
        <ActivateAccountContainer>
          <div className="page-loading">
            <LoadingOutlined />
          </div>
        </ActivateAccountContainer>
      )) || (
        <ActivateAccountContainer
          className={isOpenAppShow ? 'open-app-show' : ''}
        >
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
                <Form
                  autoComplete="off"
                  ref={formRef}
                  initialValues={{
                    ...activateAccountFormValue,
                  }}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                >
                  <div className="tips">Signup with</div>
                  <div className="tips signup-email">{defultEmail}</div>
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
                          autoComplete="off"
                          ref={(input) => (inputRefs.current.firstName = input)}
                          className={`${
                            (activateAccountFormValue.firstName &&
                              'border-white') ||
                            ''
                          }`}
                          placeholder="First name (at least 2 characters)"
                          maxLength={20}
                          bordered={false}
                          onChange={(e) =>
                            setActivateAccountFormValue({
                              ...activateAccountFormValue,
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
                          autoComplete="off"
                          ref={(input) => (inputRefs.current.lastName = input)}
                          className={`${
                            (activateAccountFormValue.lastName &&
                              'border-white') ||
                            ''
                          }`}
                          placeholder="Last name (at least 1 character)"
                          maxLength={20}
                          bordered={false}
                          onChange={(e) =>
                            setActivateAccountFormValue({
                              ...activateAccountFormValue,
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
                      className={`${(passwordValue && 'border-white') || ''}`}
                      placeholder="Set your password (at least 8 characters)"
                      bordered={false}
                      maxLength={20}
                      iconRender={(visible) =>
                        visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                      }
                      onChange={(e) => {
                        setPasswordValue(e.target.value);
                        setActivateAccountFormValue({
                          ...activateAccountFormValue,
                          password:
                            (isPassword(e.target.value) && e.target.value) ||
                            '',
                        });
                      }}
                    />
                  </Form.Item>
                  {showCodeExpiredRequestButton && (
                    <>
                      <Form.Item
                        name="code"
                        rules={[{ validator: verificationCodeValidator }]}
                      >
                        <Row>
                          <Col span={24}>
                            <div className="request-code-content">
                              <Input
                                ref={(input) =>
                                  (inputRefs.current.code = input)
                                }
                                className={`${
                                  (passwordValue && 'border-white') || ''
                                }`}
                                placeholder="Verification code"
                                bordered={false}
                                maxLength={6}
                                onChange={(e) => {
                                  setActivateAccountFormValue({
                                    ...activateAccountFormValue,
                                    code: e.target.value,
                                  });
                                }}
                              />
                              {((countdownNumber as number) > 0 && (
                                <div className="request-code-button show-count-number">
                                  <div className="button">
                                    {`(${countdownNumber}s)`}
                                  </div>
                                </div>
                              )) || (
                                <div
                                  className="request-code-button"
                                  onClick={requestNewCode}
                                >
                                  <div className="button">REQUEST</div>
                                </div>
                              )}
                            </div>
                          </Col>
                        </Row>
                      </Form.Item>
                      <Form.Item className="auto-complete-hidden">
                        <Input />
                      </Form.Item>
                      <Form.Item className="auto-complete-hidden">
                        <Input.Password />
                      </Form.Item>
                    </>
                  )}
                  <Form.Item
                    className={(isTextShak && 'text-shak') || ''}
                    style={{ marginBottom: 0 }}
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
                            onClick={() => {
                              setGoogleDocLink(TermsConditionsLink);
                              setCheckGoogleDoc(true);
                            }}
                          >
                            Terms&Conditions
                          </span>
                          and{' '}
                          <span
                            className="agreement-label-action"
                            onClick={() => {
                              setGoogleDocLink(PrivacyPolicyLink);
                              setCheckGoogleDoc(true);
                            }}
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
                      type="primary"
                      htmlType="submit"
                      onClick={() => setTextShak(false)}
                    >
                      ACTIVATE
                      {loading && <LoadingOutlined />}
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </div>
          </div>
          {checkGoogleDoc ? (
            <GoogleDocComponent
              docLink={googleDocLink}
              checkGoogleDoc={setCheckGoogleDoc}
            />
          ) : null}
          <OpenAppComponent setIsOpenAppShow={setIsOpenAppShow} />
        </ActivateAccountContainer>
      )}
    </>
  );
};

ActivateAccount.getInitialProps = async (ctx: any) => {
  const { query } = ctx;
  let redirectPage = '';
  let defultEmail = '';
  let defultFirstName = '';
  let defultLastName = '';
  let defultPhoneNumber = '';
  let activateCode = '';
  let currentTicketId = '';
  let currentTicketEventSlug = '';
  let codeStatusExpired = false;
  try {
    if (query.redirect && query.userEmail && query.activateCode) {
      defultEmail = query.userEmail;
      redirectPage = query.redirect;
      activateCode = query.activateCode;
    } else {
      const { codeStatus } = query;
      const parameters = base64Decrypt(Object.keys(query)[0]);
      if (codeStatus && codeStatus === 'expired') {
        codeStatusExpired = true;
      } else {
        activateCode = parameters.code;
      }
      defultEmail = parameters.email;
      defultFirstName = parameters.firstName;
      defultLastName = parameters.lastName;
      defultPhoneNumber = parameters.phoneNumber;
      currentTicketId = parameters.ticketId;
      currentTicketEventSlug = parameters.eventSlug;
    }
  } catch (_) {}
  return {
    defultEmail,
    defultFirstName,
    defultLastName,
    defultPhoneNumber,
    activateCode,
    currentTicketId,
    currentTicketEventSlug,
    redirectPage,
    codeStatusExpired,
  };
};

export default ActivateAccount;
