import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Form, Input, message } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import { isEmpty } from 'lodash';

import {
  PasswordNotMatch,
  UserNotExist,
  ForgotPasswordVerifyType,
  TokenExpire,
  VerificationCodeLength,
  ForgotPasswordAccountNotActivate,
} from '@/constants/General';
import { useCookie, useResetPageCache } from '@/hooks';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  isPassword,
  base64Decrypt,
  isEmail,
  base64Encrypt,
  generateRandomString,
  renderAuthCookiesField,
} from '@/utils/func';
import { verifyUserAction } from '@/slice/user.slice';
import {
  forgotPasswordResetAction,
  forgotPasswordSendVerificationCodeAction,
  selectForgotPasswordLoading,
  selectForgotPasswordError,
  resetForgotPasswordValue,
  verificationCodeAction,
  loginAction,
  selectData,
  reset,
  selectLoginRedirectPage,
  resetLoginRedirectPage,
} from '@/slice/user.slice';
import { LoginContainer } from '@/styles/login-style';
import { RouterKeys, CookieKeys, LocalStorageKeys } from '@/constants/Keys';
import Messages from '@/constants/Messages';
import AuthPageHearder from '@/components/authPageHearder';
import { Images } from '@/theme';

const ForgotPassword = ({
  defultEmail,
  redirectPage,
  currentTicketEventSlug,
  ticketIdFormEmailLink,
}: {
  defultEmail: string;
  redirectPage: string;
  currentTicketEventSlug: string;
  ticketIdFormEmailLink: string;
}) => {
  const resetPageCache = useResetPageCache();
  const cookies = useCookie([
    CookieKeys.userLoginToken,
    CookieKeys.userLoginEmail,
    CookieKeys.userLoginId,
  ]);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const loading = useAppSelector(selectForgotPasswordLoading);
  const error = useAppSelector(selectForgotPasswordError);
  const data = useAppSelector(selectData);
  const loginRedirectPage = useAppSelector(selectLoginRedirectPage);

  const [isFirstRender, setIsFirstRender] = useState<boolean>(true);
  const [sendVerificationCode, setSendVerificationCode] =
    useState<boolean>(false);
  const [verificationCodeSuccess, setVerificationCodeSuccess] =
    useState<boolean>(false);
  const [passwordValue, setPasswordValue] = useState<string>('');
  const [confirmPasswordValue, setConfirmPasswordValue] = useState<string>('');
  const [forgotPasswordValue, setForgotPasswordValue] = useState({
    email: defultEmail || '',
    code: '',
    password: '',
  });

  const onFinish = async () => {
    if (forgotPasswordValue.password !== confirmPasswordValue) {
      setPasswordValue('');
      setConfirmPasswordValue('');
      setForgotPasswordValue({
        ...forgotPasswordValue,
        password: '',
      });
      message.open({
        content: PasswordNotMatch,
        className: 'error-message-event',
      });
      return;
    }
    const response = await dispatch(
      forgotPasswordResetAction(forgotPasswordValue)
    );
    if (response.type === forgotPasswordResetAction.fulfilled.toString()) {
      dispatch(
        loginAction({
          email: forgotPasswordValue.email,
          password: forgotPasswordValue.password,
        })
      );
    }
  };

  const hanldeSendCode = async () => {
    const response: any = await dispatch(
      forgotPasswordSendVerificationCodeAction({
        email: forgotPasswordValue.email,
      })
    );
    if (
      response.type ===
      forgotPasswordSendVerificationCodeAction.fulfilled.toString()
    ) {
      setSendVerificationCode(true);
    }
  };

  const handleVerificationCode = async () => {
    const response = await dispatch(
      verificationCodeAction({
        email: forgotPasswordValue.email,
        code: forgotPasswordValue.code,
        type: ForgotPasswordVerifyType,
      })
    );
    if (response.type === verificationCodeAction.fulfilled.toString()) {
      setVerificationCodeSuccess(true);
    }
  };

  useEffect(() => {
    if (data.token) {
      const currentDate = new Date();
      renderAuthCookiesField(data, forgotPasswordValue).forEach((item) => {
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
      dispatch(reset());
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
    if (error && !isFirstRender) {
      if (error.code === Messages.notFound.code) {
        message.open({
          content: UserNotExist,
          className: 'error-message-login',
        });
        return;
      }
      if (error.code === Messages.activateAccountUserDosentExist1001.code) {
        dispatch(verifyUserAction({ email: forgotPasswordValue.email }));
        if (redirectPage || loginRedirectPage) {
          router.push({
            pathname: RouterKeys.activateAccountNormalFlow,
            query: `redirect=${
              redirectPage || loginRedirectPage
            }&email=${base64Encrypt({
              email: forgotPasswordValue.email,
            })}&source=${ForgotPasswordAccountNotActivate}`,
          });
        } else {
          router.push(
            `${RouterKeys.activateAccountNormalFlow}?${base64Encrypt({
              email: forgotPasswordValue.email,
              source: ForgotPasswordAccountNotActivate,
            })}`
          );
        }
        return;
      }
      if (error.code === Messages.invalidActivationCode.code) {
        message.open({
          content: Messages.invalidActivationCode.text,
          className: 'error-message-login',
        });
        return;
      }
      message.open({
        content: error.message,
        className: 'error-message-login',
      });
    }
  }, [error]);

  useEffect(() => {
    setIsFirstRender(false);
    dispatch(resetForgotPasswordValue());
  }, []);

  return (
    <LoginContainer>
      <img
        className="page-background"
        src={Images.AnimatedBackground.src}
        alt=""
      />
      <AuthPageHearder showSkip={false} />
      <div className="page-main">
        <div className="main-form-content">
          <div>
            <Row className="main-title">
              <Col span={24} className="title">
                RESET PASSWORD
              </Col>
            </Row>
            {!sendVerificationCode && (
              <>
                <Row>
                  {(defultEmail && (
                    <Col className="user-email">{defultEmail}</Col>
                  )) || (
                    <Input
                      className={`${
                        (forgotPasswordValue.email && 'border-white') || ''
                      }`}
                      placeholder="Enter your email"
                      bordered={false}
                      onChange={(e) =>
                        setForgotPasswordValue({
                          ...forgotPasswordValue,
                          email:
                            (isEmail(e.target.value) && e.target.value) || '',
                        })
                      }
                    />
                  )}
                </Row>
                <Button
                  className="signin-btn"
                  type="primary"
                  disabled={!forgotPasswordValue.email || loading}
                  onClick={hanldeSendCode}
                >
                  VERIFICATION CODE
                </Button>
              </>
            )}
            {sendVerificationCode && !verificationCodeSuccess && (
              <>
                <Row className="code-sent">
                  <Col span={24} className="title">
                    Verification code has been sent to
                  </Col>
                  <Col span={24} className="value">
                    {forgotPasswordValue.email}
                  </Col>
                </Row>
                <Form>
                  <Form.Item name="code" style={{ marginBottom: 0 }}>
                    <Input
                      className={`${
                        (forgotPasswordValue.code && 'border-white') || ''
                      }`}
                      placeholder="Enter verification code"
                      bordered={false}
                      onChange={(e) =>
                        setForgotPasswordValue({
                          ...forgotPasswordValue,
                          code: e.target.value,
                        })
                      }
                    />
                  </Form.Item>
                  <Form.Item style={{ marginBottom: 25 }}>
                    <Button
                      className="signin-btn"
                      disabled={
                        !forgotPasswordValue.code ||
                        forgotPasswordValue.code.length <
                          VerificationCodeLength ||
                        loading
                      }
                      type="primary"
                      htmlType="submit"
                      onClick={handleVerificationCode}
                    >
                      NEXT
                    </Button>
                  </Form.Item>
                </Form>
              </>
            )}
            {verificationCodeSuccess && sendVerificationCode && (
              <Form onFinish={onFinish}>
                <Form.Item style={{ marginBottom: 20 }}>
                  <Input.Password
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
                      setForgotPasswordValue({
                        ...forgotPasswordValue,
                        password:
                          (isPassword(e.target.value) && e.target.value) || '',
                      });
                    }}
                  />
                </Form.Item>
                <Form.Item style={{ marginBottom: 0 }}>
                  <Input.Password
                    value={confirmPasswordValue}
                    className={`${
                      (confirmPasswordValue && 'border-white') || ''
                    }`}
                    iconRender={(visible) =>
                      visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                    }
                    placeholder="Confirm your password"
                    bordered={false}
                    maxLength={20}
                    onChange={(e) => setConfirmPasswordValue(e.target.value)}
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    style={{ marginTop: 60 }}
                    className="signin-btn"
                    disabled={
                      !forgotPasswordValue.password ||
                      !isPassword(confirmPasswordValue)
                    }
                    type="primary"
                    htmlType="submit"
                  >
                    DONE
                  </Button>
                </Form.Item>
              </Form>
            )}
          </div>
        </div>
      </div>
    </LoginContainer>
  );
};

ForgotPassword.getInitialProps = async (ctx: any) => {
  const { query } = ctx;
  let defultEmail = undefined;
  let redirectPage = '';
  let currentTicketEventSlug = '';
  let ticketIdFormEmailLink = '';
  try {
    if (!isEmpty(query)) {
      const { redirect, raves } = query;
      if (raves && redirect) {
        redirectPage = `${redirect}&raves=${raves}`;
      } else {
        const parameters = base64Decrypt(Object.keys(query)[0]);
        defultEmail = parameters.email;
        currentTicketEventSlug = parameters.eventSlug;
        ticketIdFormEmailLink = parameters.ticketId;
        redirectPage = query.redirect || '';
      }
    }
  } catch (_) {}
  return {
    defultEmail,
    currentTicketEventSlug,
    redirectPage,
    ticketIdFormEmailLink,
  };
};

export default ForgotPassword;
